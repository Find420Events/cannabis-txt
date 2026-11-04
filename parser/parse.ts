/**
 * Reference parser for files in the cannabis.txt specification family.
 * Implements specification/grammar.md: line classification, fields,
 * continuation lines, list and record structure, value normalization,
 * the Extensions manifest, and the canonical JSON output model.
 *
 * Zero dependencies. Runs on Node.js >= 22.18 (native type stripping).
 */

export type DiagnosticLevel = 'error' | 'warning' | 'note';

export interface Diagnostic {
  level: DiagnosticLevel;
  code: string;
  line: number;
  message: string;
}

export type RecordObject = Record<string, unknown>;
export type ListItem = string | RecordObject | null;

export interface Section {
  heading: string | null;
  fields: RecordObject;
  lists: Record<string, ListItem[]>;
  text: string;
}

export interface ParseResult {
  specification: string | null;
  document: { title: string | null; text: string };
  metadata: RecordObject;
  lists: Record<string, ListItem[]>;
  extensions: { type: string; url: string }[];
  sections: Section[];
  diagnostics: Diagnostic[];
}

export interface ConformanceResult {
  level: 0 | 1 | 2 | 3;
  diagnostics: Diagnostic[];
}

const DATE_KEYS = new Set([
  'last-updated',
  'published',
  'effective-date',
  'last-verified',
  'date-checked',
  'expiration-date',
  'expires',
]);

const EXTENSION_IDS = new Set([
  'events',
  'dispensary',
  'delivery',
  'flower-brand',
  'edible-brand',
  'concentrate-brand',
  'physician',
]);

const FIELD_RE = /^([A-Za-z][A-Za-z0-9 -]*):(.*)$/;
const HEADING_RE = /^[0-9]+(\.[0-9]+)*\.\s+\S/;
const SEPARATOR_RE = /^\s*={3,}\s*$/;
const COMMENT_RE = /^\s*#/;
const LIST_ITEM_RE = /^(\s*)-\s+(.*)$/;
const RECORD_FIELD_RE = /^([A-Za-z][A-Za-z0-9 -]*):(?:\s+(.*))?$/;
const BANNER_RE = /^CANNABIS(-[A-Z0-9-]+)?\.TXT\s*$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;
/** True when `value` parses as an absolute URL (any scheme). */
const isAbsoluteUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/** True when `value` parses as an absolute http(s) URL. */
const isHttpUrl = (value: string): boolean => {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

/** Lowercase the name and collapse whitespace runs to single hyphens. */
export function canonicalKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

interface Context {
  fields: RecordObject;
  lists: Record<string, ListItem[]>;
  textParts: string[];
  heading?: string;
}

interface ActiveList {
  key: string;
  indent: number;
  items: ListItem[];
}

interface Pending {
  holder: RecordObject;
  key: string;
}

export function parseCannabisTxt(
  input: string,
  options: { specification?: string } = {},
): ParseResult {
  const diagnostics: Diagnostic[] = [];
  const diag = (level: DiagnosticLevel, code: string, line: number, message: string) =>
    diagnostics.push({ level, code, line, message });

  let text = input;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) {
    diag('error', 'control-character', 0, 'File contains disallowed control characters.');
  }
  const lines = text.replace(/\r\n?/g, '\n').split('\n');

  const metadata: RecordObject = {};
  const topLists: Record<string, ListItem[]> = {};
  const sections: Section[] = [];
  const sectionParts: string[][] = [];

  let cur: Context = { fields: metadata, lists: topLists, textParts: [] };
  let inMetadata = true;
  let title: string | null = null;
  let banner: string | null = null;
  const docText: string[] = [];

  let list: ActiveList | null = null;
  let record: RecordObject | null = null;
  let pending: Pending | null = null;

  const closeStructure = () => {
    list = null;
    record = null;
    pending = null;
  };

  const nextNonBlank = (from: number) => {
    for (let j = from; j < lines.length; j++) {
      const t = lines[j].trim();
      if (t) return { raw: lines[j], trimmed: t };
    }
    return null;
  };

  const normalizeValue = (key: string, raw: string, lineNo: number): unknown => {
    const value = raw.trim();
    if (/^\[.*\]$/.test(value)) {
      diag('warning', 'placeholder-value', lineNo, `Field "${key}" still contains a placeholder value.`);
      return value;
    }
    if (/^(unknown|n\/a|-)$/i.test(value)) return null;
    if (DATE_KEYS.has(key) || /-date$/.test(key)) {
      if (!ISO_DATE_RE.test(value)) {
        diag('warning', 'invalid-date', lineNo, `Field "${key}" is not an ISO 8601 date: "${value}".`);
      }
    }
    if (key.includes('url') || key === 'website' || key.includes('link') || key === 'contact') {
      // URL-bearing fields must be absolute; web links additionally require
      // http(s). `contact` accepts any absolute scheme (https, mailto, tel).
      const ok = key === 'contact' ? isAbsoluteUrl(value) : isHttpUrl(value);
      if (!value.includes('{') && !ok && value.length > 0) {
        diag('warning', 'invalid-url', lineNo, `Field "${key}" is not an absolute URL: "${value}".`);
      }
    }
    return value;
  };

  const addField = (holder: RecordObject, name: string, value: string, lineNo: number): string => {
    const key = canonicalKey(name);
    if (key in holder) {
      diag('warning', 'duplicate-field', lineNo, `Duplicate field "${key}"; keeping the first occurrence.`);
      return key;
    }
    holder[key] = normalizeValue(key, value, lineNo);
    return key;
  };

  const appendProse = (line: string) => {
    cur.textParts.push(line);
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineNo = i + 1;
    const trimmed = raw.trim();
    const indent = raw.length - raw.trimStart().length;

    if (!trimmed) {
      pending = null;
      if (cur.textParts.length && cur.textParts[cur.textParts.length - 1] !== '') {
        cur.textParts.push('');
      }
      continue;
    }

    if (SEPARATOR_RE.test(raw) || COMMENT_RE.test(raw)) {
      pending = null;
      if (SEPARATOR_RE.test(raw)) closeStructure();
      continue;
    }

    if (indent === 0 && HEADING_RE.test(trimmed)) {
      closeStructure();
      cur = { fields: {}, lists: {}, textParts: [], heading: trimmed };
      sectionParts.push(cur.textParts);
      sections.push({ heading: trimmed, fields: cur.fields, lists: cur.lists, text: '' });
      inMetadata = false;
      continue;
    }

    // Inside an active list: same-indent dashes extend it, deeper field lines
    // extend the current record, anything else closes it.
    if (list) {
      const item = raw.match(LIST_ITEM_RE);
      if (item && item[1].length === list.indent) {
        pending = null;
        const body = item[2];
        const rf = body.match(RECORD_FIELD_RE);
        if (rf) {
          record = {};
          const key = canonicalKey(rf[1]);
          record[key] = normalizeValue(key, rf[2] ?? '', lineNo);
          list.items.push(record);
          pending = { holder: record, key };
        } else {
          record = null;
          list.items.push(normalizeValue(list.key, body, lineNo) as string | null);
        }
        continue;
      }
      if (indent > list.indent && record) {
        const rf = trimmed.match(FIELD_RE);
        if (rf && rf[2].trim()) {
          const key = addField(record, rf[1], rf[2], lineNo);
          pending = { holder: record, key };
          continue;
        }
        if (pending && pending.holder === record && !LIST_ITEM_RE.test(raw)) {
          record[pending.key] = String(record[pending.key]) + '\n' + trimmed;
          continue;
        }
      }
      closeStructure();
    }

    // Field lines only count at indentation zero in the current context.
    const fm = indent === 0 ? trimmed.match(FIELD_RE) : null;
    if (fm) {
      const value = fm[2].trim();
      const key = canonicalKey(fm[1]);
      if (value) {
        addField(cur.fields, fm[1], value, lineNo);
        pending = { holder: cur.fields, key };
        continue;
      }
      // Empty value: a block introducer, or a prose sentence ending in a colon.
      const nnb = nextNonBlank(i + 1);
      const nnbDash = nnb ? nnb.raw.match(LIST_ITEM_RE) : null;
      if (nnbDash) {
        if (key in cur.lists || key in cur.fields) {
          diag('warning', 'duplicate-field', lineNo, `Duplicate block "${key}"; keeping the first.`);
        } else {
          cur.lists[key] = [];
          list = { key, indent: nnbDash[1].length, items: cur.lists[key] };
        }
        continue;
      }
      if (nnb && nnb.raw.length - nnb.raw.trimStart().length > 0) {
        const k = addField(cur.fields, fm[1], '', lineNo);
        pending = { holder: cur.fields, key: k };
        continue;
      }
      appendProse(trimmed);
      continue;
    }

    // Indented, non-list line: continuation of a pending field, else prose.
    if (indent > 0 && pending && !LIST_ITEM_RE.test(raw)) {
      const prev = pending.holder[pending.key];
      pending.holder[pending.key] = (prev ? String(prev) + '\n' : '') + trimmed;
      continue;
    }

    // Prose.
    if (inMetadata) {
      const bannerMatch = trimmed.match(BANNER_RE);
      if (bannerMatch && !banner) {
        banner = trimmed;
        continue;
      }
      if (title === null) {
        title = trimmed;
        continue;
      }
      docText.push(trimmed);
      continue;
    }
    appendProse(trimmed);
  }

  // Join prose into paragraphs.
  const joinText = (parts: string[]) =>
    parts
      .join('\n')
      .split(/\n{2,}/)
      .map((p) => p.replace(/\n/g, ' ').trim())
      .filter(Boolean)
      .join('\n\n');

  sections.forEach((section, idx) => {
    section.text = joinText(sectionParts[idx] ?? []);
  });

  // Extract the Extensions manifest block.
  const extensions: { type: string; url: string }[] = [];
  const extList = topLists['extensions'];
  if (extList) {
    for (const item of extList) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const [type, url] = Object.entries(item)[0] ?? [];
        if (type && typeof url === 'string') {
          extensions.push({ type, url });
          if (!/^[a-z][a-z0-9-]*$/.test(type)) {
            diag('warning', 'invalid-extension-id', 0, `Extension identifier "${type}" is not lowercase-hyphenated.`);
          } else if (!EXTENSION_IDS.has(type)) {
            diag('note', 'unknown-extension-id', 0, `Unrecognized extension identifier "${type}".`);
          }
          if (!isAbsoluteUrl(url)) {
            diag('error', 'invalid-extension-url', 0, `Extension "${type}" URL is not absolute: "${url}".`);
          }
        }
      }
    }
    delete topLists['extensions'];
  }

  const specification =
    options.specification ??
    (banner ? banner.toLowerCase().replace(/\s+/g, '') : null);

  return {
    specification,
    document: { title, text: docText.join(' ') },
    metadata,
    lists: topLists,
    extensions,
    sections,
    diagnostics,
  };
}

/**
 * Cumulative conformance levels from grammar.md section 9.
 * Returns the achieved level and any additional diagnostics.
 */
export function conformance(result: ParseResult): ConformanceResult {
  const diagnostics: Diagnostic[] = [];
  const diag = (level: DiagnosticLevel, code: string, message: string) =>
    diagnostics.push({ level, code, line: 0, message });

  if (result.diagnostics.some((d) => d.level === 'error')) {
    return { level: 0, diagnostics };
  }

  // Level 2 — core metadata.
  const required = ['version', 'status', 'canonical-url'];
  for (const key of required) {
    if (!(key in result.metadata)) diag('error', 'missing-field', `Required metadata field "${key}" is missing.`);
  }
  if (!('publisher' in result.metadata) && !('founding-publisher' in result.metadata)) {
    diag('error', 'missing-field', 'Required metadata field "publisher" is missing.');
  }
  if (!('last-updated' in result.metadata) && !('published' in result.metadata)) {
    diag('error', 'missing-field', 'A "last-updated" or "published" date is required.');
  }
  const canonical = result.metadata['canonical-url'];
  if (typeof canonical === 'string' && !isHttpUrl(canonical)) {
    diag('error', 'invalid-url', '"canonical-url" must be an absolute http(s) URL.');
  }
  if (!('contact' in result.metadata)) {
    diag('warning', 'missing-contact', 'A "contact" field is recommended.');
  }
  // Metadata-block dates must be ISO 8601 and metadata must not contain
  // bracketed placeholders. Illustrative fields inside sections do not
  // affect conformance.
  const metadataInvalid = Object.entries(result.metadata).some(([key, value]) => {
    if (typeof value !== 'string') return false;
    if (/^\[.*\]$/.test(value)) return true;
    if ((DATE_KEYS.has(key) || /-date$/.test(key)) && !ISO_DATE_RE.test(value)) return true;
    return false;
  });
  if (metadataInvalid || diagnostics.some((d) => d.level === 'error')) {
    return { level: 1, diagnostics };
  }

  // Licensing record semantics (cannabis.txt §8). Warnings preserve the
  // published values; they flag consistency and provenance issues.
  const LICENSE_STATUS = new Set(['active', 'expired', 'suspended', 'revoked', 'pending', 'unknown']);
  const VERIFICATION_STATUS = new Set([
    'publisher-reported',
    'source-matched',
    'independently-verified',
    'unknown',
  ]);
  const licensingRecords = [
    ...(result.lists['licensing'] ?? []),
    ...result.sections.flatMap((s) => s.lists['licensing'] ?? []),
  ];
  licensingRecords.forEach((item, idx) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return;
    const rec = item as RecordObject;
    const label = `licensing record ${idx + 1}`;
    const licenseStatus = rec['license-status'];
    const verificationStatus = rec['verification-status'];
    const sourceUrl = rec['source-url'];
    if (typeof licenseStatus === 'string' && !LICENSE_STATUS.has(licenseStatus.toLowerCase())) {
      diag('warning', 'invalid-enum', `${label}: unrecognized license-status "${licenseStatus}".`);
    }
    if (
      typeof verificationStatus === 'string' &&
      !VERIFICATION_STATUS.has(verificationStatus.toLowerCase())
    ) {
      diag('warning', 'invalid-enum', `${label}: unrecognized verification-status "${verificationStatus}".`);
    }
    const vs = typeof verificationStatus === 'string' ? verificationStatus.toLowerCase() : null;
    if ((vs === 'source-matched' || vs === 'independently-verified') && !sourceUrl) {
      diag('warning', 'missing-source-url', `${label}: verification-status "${vs}" needs a source-url.`);
    }
    if (vs === 'independently-verified' && !rec['verified-by']) {
      diag('warning', 'missing-verified-by', `${label}: independently-verified needs verified-by.`);
    }
    if (typeof licenseStatus === 'string' && licenseStatus.toLowerCase() !== 'unknown' && !sourceUrl && vs !== 'source-matched' && vs !== 'independently-verified') {
      diag('warning', 'unverified-status-claim', `${label}: license-status reports a regulator status without a source-url.`);
    }
    for (const legacy of ['public-verification-url', 'date-checked']) {
      if (legacy in rec) {
        diag('warning', 'deprecated-field', `${label}: "${legacy}" is deprecated; use ${legacy === 'public-verification-url' ? 'source-url' : 'last-verified'}.`);
      }
    }
  });

  // Level 3 — extension conformance.
  const dependsOn = result.metadata['depends-on'];
  if (result.specification && result.specification !== 'cannabis.txt' && !dependsOn) {
    diag('error', 'missing-depends-on', 'Extension files must declare "depends-on" for cannabis.txt.');
  }
  if (dependsOn && !/^cannabis\.txt\s+version\s+\d+\.\d+\.\d+/i.test(String(dependsOn))) {
    diag('error', 'invalid-depends-on', '"depends-on" must name cannabis.txt and a semantic version.');
  }

  // Level 3 also requires `extensions` entries to use recognized identifiers
  // and absolute URLs on the publisher's domain (grammar.md section 9). The
  // publisher's domain is the host of `canonical-url`.
  let publisherHost: string | null = null;
  try {
    publisherHost = new URL(String(result.metadata['canonical-url'])).hostname.toLowerCase();
  } catch {
    publisherHost = null;
  }
  for (const ext of result.extensions) {
    if (!EXTENSION_IDS.has(ext.type)) {
      diag('error', 'unrecognized-extension', `Extension identifier "${ext.type}" is not recognized (Level 3).`);
    }
    let extHost: string | null = null;
    if (isHttpUrl(ext.url)) {
      extHost = new URL(ext.url).hostname.toLowerCase();
    } else {
      diag('error', 'invalid-extension-url', `Extension "${ext.type}" URL must be an absolute http(s) URL: "${ext.url}".`);
    }
    if (extHost && publisherHost && extHost !== publisherHost && !extHost.endsWith(`.${publisherHost}`)) {
      diag('error', 'extension-domain', `Extension "${ext.type}" URL must resolve on the publisher's domain (${publisherHost}): "${ext.url}".`);
    }
  }
  if (diagnostics.some((d) => d.level === 'error')) {
    return { level: 2, diagnostics };
  }

  return { level: 3, diagnostics };
}
