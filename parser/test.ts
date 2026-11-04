/**
 * Parser test suite and conformance fixtures.
 *
 *   node parser/test.ts
 *
 * - Compares parser/fixtures/basic.txt against basic.expected.json.
 * - Parses every repository specification and example file and asserts
 *   expected conformance levels.
 * - Runs unit assertions for grammar rules: duplicates, unknown fields,
 *   unknown/null normalization, records, continuations, Extensions blocks.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { parseCannabisTxt, conformance } from './parse.ts';
import { validateJson } from './schema.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const documentSchema = JSON.parse(read('schemas/cannabis-txt.schema.json'));
const licensingSchema = JSON.parse(read('schemas/licensing.schema.json'));

let passed = 0;
const check = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`  ok   ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}`);
    console.error(`       ${err instanceof Error ? err.message : err}`);
    process.exitCode = 1;
  }
};

// --- Golden fixture -------------------------------------------------------

check('golden fixture basic.txt matches basic.expected.json', () => {
  const result = parseCannabisTxt(read('parser/fixtures/basic.txt'));
  const expected = JSON.parse(read('parser/fixtures/basic.expected.json'));
  assert.deepEqual(result, expected);
});

// --- Repository files -----------------------------------------------------

const specFiles = readdirSync(root).filter((f) => /^cannabis[a-z0-9-]*\.txt$/.test(f));

for (const file of specFiles) {
  check(`${file} reaches conformance level 3`, () => {
    const result = parseCannabisTxt(read(file), { specification: file });
    const { level, diagnostics } = conformance(result);
    for (const d of [...result.diagnostics, ...diagnostics]) {
      assert.notEqual(d.level, 'error', `${d.code}: ${d.message}`);
    }
    assert.equal(level, 3, `level ${level}; diagnostics: ${JSON.stringify(diagnostics)}`);
  });
}

const exampleFiles = readdirSync(join(root, 'examples'))
  .filter((f) => f.endsWith('.txt'))
  .map((f) => `examples/${f}`);

for (const file of exampleFiles) {
  check(`${file} parses at level 1 or higher`, () => {
    const result = parseCannabisTxt(read(file));
    const { level } = conformance(result);
    assert.ok(level >= 1, `level ${level}`);
  });
}

const find420Files = readdirSync(join(root, 'examples/find420'))
  .filter((f) => f.endsWith('.txt'))
  .map((f) => `examples/find420/${f}`);

for (const file of find420Files) {
  check(`${file} reaches conformance level 3`, () => {
    const result = parseCannabisTxt(read(file));
    const { level, diagnostics } = conformance(result);
    assert.equal(level, 3, `level ${level}; diagnostics: ${JSON.stringify(diagnostics)}`);
  });
}

// --- JSON Schema validation ---------------------------------------------------

check('parse output of every repository file satisfies the document schema', () => {
  const all = [...specFiles.map((f) => f), ...exampleFiles, ...find420Files];
  for (const file of all) {
    const result = parseCannabisTxt(read(file));
    // Example files are publisher templates carrying [bracketed] placeholders
    // in metadata — skip them; the schema validates real values only (same
    // convention as the licensing-record check below).
    const hasPlaceholder = Object.values(result.metadata).some(
      (v) => typeof v === 'string' && /^\[.*\]$/.test(v),
    );
    if (hasPlaceholder) continue;
    const errors = validateJson(result, documentSchema);
    assert.deepEqual(errors, [], `${file}: ${errors.join('; ')}`);
  }
});

check('licensing records in repository files satisfy the licensing schema', () => {
  for (const file of [...specFiles, ...exampleFiles, ...find420Files]) {
    const result = parseCannabisTxt(read(file));
    const records = [
      ...(result.lists['licensing'] ?? []),
      ...result.sections.flatMap((s) => s.lists['licensing'] ?? []),
    ];
    for (const rec of records) {
      if (rec && typeof rec === 'object' && !Array.isArray(rec)) {
        // Example files contain [bracketed] placeholders — templates, not
        // real data — so skip records carrying them; the schema validates
        // real values only.
        const hasPlaceholder = Object.values(rec).some(
          (v) => typeof v === 'string' && /^\[.*\]$/.test(v),
        );
        if (hasPlaceholder) continue;
        const errors = validateJson(rec, licensingSchema);
        assert.deepEqual(errors, [], `${file}: ${errors.join('; ')}`);
      }
    }
  }
});

// --- Unit assertions --------------------------------------------------------

check('duplicate scalar field keeps first occurrence and warns', () => {
  const r = parseCannabisTxt('Version: 1.0.0\nVersion: 9.9.9\n');
  assert.equal(r.metadata['version'], '1.0.0');
  assert.ok(r.diagnostics.some((d) => d.code === 'duplicate-field'));
});

check('unknown fields are preserved without errors', () => {
  const r = parseCannabisTxt('X-Custom-Field: anything\n');
  assert.equal(r.metadata['x-custom-field'], 'anything');
  assert.equal(r.diagnostics.length, 0);
});

check('"unknown" and "n/a" normalize to null', () => {
  const r = parseCannabisTxt('Effective-Date: unknown\nContact: N/A\n');
  assert.equal(r.metadata['effective-date'], null);
  assert.equal(r.metadata['contact'], null);
});

check('record lists parse into arrays of objects', () => {
  const r = parseCannabisTxt(
    'Locations:\n- Location ID: a\n  Name: One\n\n- Location ID: b\n  Name: Two\n',
  );
  assert.deepEqual(r.lists['locations'], [
    { 'location-id': 'a', name: 'One' },
    { 'location-id': 'b', name: 'Two' },
  ]);
});

check('indented continuation extends the preceding field', () => {
  const r = parseCannabisTxt('Event detail URL pattern:\n  https://example.com/e/{slug}\n');
  assert.equal(r.metadata['event-detail-url-pattern'], 'https://example.com/e/{slug}');
});

check('Extensions block emits typed manifest entries', () => {
  const r = parseCannabisTxt('Extensions:\n- events: https://example.com/cannabis-events.txt\n');
  assert.deepEqual(r.extensions, [{ type: 'events', url: 'https://example.com/cannabis-events.txt' }]);
  assert.equal(r.lists['extensions'], undefined);
});

check('a prose sentence ending in a colon is not a field', () => {
  const r = parseCannabisTxt(
    'Version: 1.0.0\n\n======================================================================\n1. SCOPE\n\nCommon attributes include:\n\nA trailing paragraph.\n',
  );
  assert.equal(r.sections[0]?.fields['common-attributes-include'], undefined);
});

check('bare lists without an owning field remain prose', () => {
  const r = parseCannabisTxt(
    '1. PRINCIPLES\n\n- Open: anyone may publish.\n- Consistent: use defined names.\n',
  );
  assert.ok(r.sections[0]?.text.includes('- Open: anyone may publish.'));
  assert.equal(Object.keys(r.sections[0]?.lists ?? {}).length, 0);
});

check('missing required metadata caps conformance below level 2', () => {
  const r = parseCannabisTxt('Version: 1.0.0\n');
  assert.ok(conformance(r).level <= 1);
});

// --- Licensing records (cannabis.txt §8) -----------------------------------

const licensingDoc = (block: string) =>
  `Version: 1.0.0\nStatus: Published\nPublisher: Example\nCanonical URL: https://example.com/cannabis.txt\nLast-Updated: 2026-11-04\nContact: https://example.com/c\n\n1. LICENSES\n\n${block}`;

check('licensing block parses multiple records across jurisdictions', () => {
  const r = parseCannabisTxt(
    licensingDoc(
      'Licensing:\n' +
        '- Jurisdiction: Colorado\n  License Holder: Retail LLC\n  License Type: Retail store\n  License Status: active\n  Verification Status: source-matched\n  Source URL: https://gov.example/co/1\n  Last Verified: 2026-10-15\n  Location ID: store-001\n\n' +
        '- Jurisdiction: Oregon\n  License Holder: Retail OR LLC\n  License Type: Retail store\n  License Status: expired\n  Verification Status: source-matched\n  Source URL: https://gov.example/or/2\n',
    ),
  );
  const recs = r.sections[0]?.lists['licensing'] as Record<string, unknown>[];
  assert.equal(recs.length, 2);
  assert.equal(recs[0]['license-holder'], 'Retail LLC');
  assert.equal(recs[0]['location-id'], 'store-001');
  assert.equal(recs[1]['license-status'], 'expired');
  assert.equal(conformance(r).level, 3);
});

check('unknown license values normalize to null', () => {
  const r = parseCannabisTxt(
    licensingDoc('Licensing:\n- Jurisdiction: Colorado\n  License Status: unknown\n  License Number: unknown\n'),
  );
  const rec = (r.sections[0]?.lists['licensing'] as Record<string, unknown>[])[0];
  assert.equal(rec['license-status'], null);
  assert.equal(rec['license-number'], null);
});

check('independently-verified without verified-by warns', () => {
  const r = parseCannabisTxt(
    licensingDoc(
      'Licensing:\n- Jurisdiction: Colorado\n  Verification Status: independently-verified\n  Source URL: https://gov.example/1\n  Verification URL: https://v.example/r/1\n',
    ),
  );
  assert.ok(conformance(r).diagnostics.some((d) => d.code === 'missing-verified-by'));
});

check('source-matched without source-url warns', () => {
  const r = parseCannabisTxt(
    licensingDoc('Licensing:\n- Jurisdiction: Colorado\n  Verification Status: source-matched\n'),
  );
  assert.ok(conformance(r).diagnostics.some((d) => d.code === 'missing-source-url'));
});

check('regulator status claim without a source warns', () => {
  const r = parseCannabisTxt(
    licensingDoc(
      'Licensing:\n- Jurisdiction: Colorado\n  License Status: active\n  Verification Status: publisher-reported\n',
    ),
  );
  assert.ok(conformance(r).diagnostics.some((d) => d.code === 'unverified-status-claim'));
});

check('legacy licensing field names warn as deprecated', () => {
  const r = parseCannabisTxt(
    licensingDoc(
      'Licensing:\n- Jurisdiction: Colorado\n  Public Verification URL: https://gov.example/1\n  Date Checked: 2026-10-01\n',
    ),
  );
  const codes = conformance(r).diagnostics.map((d) => d.code);
  assert.ok(codes.filter((c) => c === 'deprecated-field').length === 2);
});

check('licensing schema enforces conditional requirements', () => {
  const valid = {
    jurisdiction: 'Colorado',
    'license-type': 'Retail store',
    'license-status': 'active',
    'verification-status': 'source-matched',
    'source-url': 'https://gov.example/1',
    'last-verified': '2026-10-15',
  };
  assert.deepEqual(validateJson(valid, licensingSchema), []);
  const { 'source-url': _dropped, ...noSource } = valid;
  assert.ok(validateJson(noSource, licensingSchema).some((e) => e.includes('source-url')));
  const noVerifier = { jurisdiction: 'Colorado', 'license-type': 'Retail store', 'verification-status': 'independently-verified', 'source-url': 'https://gov.example/1' };
  assert.ok(validateJson(noVerifier, licensingSchema).some((e) => e.includes('verified-by')));
  assert.ok(validateJson({ jurisdiction: 'Colorado', 'license-type': 'Retail store', 'license-status': 'bogus' }, licensingSchema).some((e) => e.includes('license-status')));
  assert.ok(validateJson({ jurisdiction: 'Colorado' }, licensingSchema).some((e) => e.includes('license-type')));
});

// --- Level 3 extension checks (grammar.md section 9) ---------------------

const level3Doc = (extBlock: string) =>
  'CANNABIS.TXT\n\nProfile\n\nVersion: 1.0.0\nStatus: Published\nPublisher: Example\n' +
  'Canonical URL: https://example.com/cannabis.txt\nLast-Updated: 2026-11-04\nContact: https://example.com/c\n' +
  `Extensions:\n${extBlock}`;

check('unrecognized extension identifier caps conformance at level 2', () => {
  const r = parseCannabisTxt(level3Doc('- custom-thing: https://example.com/custom.txt\n'));
  const { level, diagnostics } = conformance(r);
  assert.equal(level, 2);
  assert.ok(diagnostics.some((d) => d.code === 'unrecognized-extension'));
});

check('extension URL off the publisher domain caps conformance at level 2', () => {
  const r = parseCannabisTxt(level3Doc('- events: https://other.example.net/cannabis-events.txt\n'));
  const { level, diagnostics } = conformance(r);
  assert.equal(level, 2);
  assert.ok(diagnostics.some((d) => d.code === 'extension-domain'));
});

check('extension URL on a publisher subdomain reaches level 3', () => {
  const r = parseCannabisTxt(level3Doc('- events: https://files.example.com/cannabis-events.txt\n'));
  assert.equal(conformance(r).level, 3);
});

check('non-http(s) extension URL caps conformance below level 3', () => {
  const r = parseCannabisTxt(level3Doc('- events: not-a-url\n'));
  assert.ok(conformance(r).level < 3);
});

// --- URL validation --------------------------------------------------------

check('URL fields require http(s) schemes', () => {
  const r = parseCannabisTxt('Website: ftp://files.example.com\nWebsite 2: not a url\n');
  const urls = r.diagnostics.filter((d) => d.code === 'invalid-url');
  assert.ok(urls.length >= 1);
});

check('contact accepts any absolute scheme such as mailto', () => {
  const r = parseCannabisTxt('Contact: mailto:hello@example.com\n');
  assert.ok(!r.diagnostics.some((d) => d.code === 'invalid-url'));
});

check('canonical-url must be an absolute http(s) URL', () => {
  const r = parseCannabisTxt(
    'Version: 1.0.0\nStatus: Published\nPublisher: Example\nCanonical URL: ftp://example.com/cannabis.txt\nLast-Updated: 2026-11-04\n',
  );
  const { level, diagnostics } = conformance(r);
  assert.ok(level <= 1);
  assert.ok(diagnostics.some((d) => d.code === 'invalid-url'));
});

console.log(`\n${passed} checks passed${process.exitCode ? ' (with failures above)' : ''}.`);
