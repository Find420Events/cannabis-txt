# Grammar

A formal, machine-readable grammar for files in the cannabis.txt specification
family. It preserves the human-readable, Markdown-compatible presentation while
giving parsers deterministic rules for fields, lists, records, and values.

This document is normative for parser and validator implementers. It is
backward-compatible with every published example: a file that follows the
existing conventions parses cleanly under this grammar.

## 1. Encoding and transport

- Files MUST be UTF-8 encoded and SHOULD be served as
  `text/plain; charset=utf-8`.
- Parsers MUST tolerate a UTF-8 byte-order mark and MUST ignore it.
- Lines are terminated by LF or CRLF; parsers MUST normalize line endings to
  LF before applying this grammar.
- A file MUST NOT contain NUL bytes or other control characters other than
  horizontal tab, line feed, and carriage return. Tabs MAY appear in prose
  but MUST NOT be used for structural indentation.

## 2. Line classification

Every non-blank line is exactly one of the following. Classification depends
only on the line itself and the current indentation context.

| Kind | Pattern | Meaning |
|---|---|---|
| Blank | Empty or whitespace only | Separates blocks |
| Comment | `#` as the first non-whitespace character | Ignored by parsers; preserved as trivia |
| Separator | 3 or more consecutive `=` characters, optionally surrounded by whitespace | Visual divider between sections |
| Section heading | `N.TITLE` or `N.M.TITLE` (numbered) | Begins a new section |
| Field | `Name: value` | A named value in the current context |
| List item | `- value` or `- Name: value` | A scalar item, or the first field of a record |
| Continuation | Indented line that is not a list item | Continues the preceding field value |
| Prose | Any other line | Free text in the current section |

`#` appearing anywhere other than the first non-whitespace character is
literal text, not a comment. URLs containing `#` fragments are unaffected.

## 3. Fields

A field line has the form `Name: value`.

- The field name starts at the first non-whitespace character and ends at
  the first `:` (colon). It contains ASCII letters, digits, spaces, and
  hyphens and MUST begin with a letter.
- The value is everything after that colon, with leading and trailing
  whitespace removed. A field with nothing after the colon has an empty
  value.
- Field names are matched case-insensitively. `Canonical URL`,
  `canonical url`, and `CANONICAL URL` are the same field.
- The canonical key of a field name is formed by lowercasing it and
  replacing every run of spaces with a single hyphen: `Last-Updated` →
  `last-updated`, `Publisher Type` → `publisher-type`.

A continuation line is any line indented by one or more spaces that is not a
list item. It continues the value of the most recent field in the same
context, joined by a single LF with the line's indentation removed:

```
Event detail URL pattern:
  https://find420.events/cannabis-events/{event-slug}
```

parses as `event-detail-url-pattern` =

```
https://find420.events/cannabis-events/{event-slug}
```

## 4. Document structure

A document has two regions:

1. **Metadata block** — the fields before the first section heading or
   separator line. These describe the file itself (`version`, `status`,
   `publisher`, `canonical-url`, `last-updated`, `language`, `depends-on`,
   `extensions`, and publisher-defined fields).
2. **Sections** — everything after the first section heading. Each section
   has a heading and a body of fields, lists, and prose.

An unnumbered first line such as `CANNABIS.TXT` followed by a subtitle line
is treated as prose (the document title), not as a field.

### Sections

A numbered heading is a line matching `^[0-9]+(\.[0-9]+)*\.` followed by at
least one space and the heading text (`3. EVENT DISCOVERY`,
`5.1 Plant and production`). Lines beginning with `#` are always comments,
not headings — a publisher may use Markdown-style `#` heading text inside
comments without affecting parse output.

Parsers MUST record each section's heading text and source order. Section
semantics are publisher-defined; parsers MUST NOT reject a file for unknown
or missing section headings beyond the conformance checks in section 9.

## 5. Lists and records

A list is introduced either by a field with an empty value or by a bare list
item following prose.

```
Locations:
- Location ID: store-001
  Name: Flagship Store
  Locality: Denver, Colorado
- Location ID: store-002
  Name: Second Store
```

### Scalar items

`- value` produces one string item in the list.

### Record items

`- Name: value` opens a new **record** — an object whose first field is that
name-value pair. Subsequent field lines indented more deeply than the `-`
belong to the same record. The next `-` at the list's indentation level
starts a new record; a line at lower indentation ends the list.

```
Licensing:
- Jurisdiction: Colorado
  License Type: Retail
  Source URL: https://example.gov/license/123
```

parses as a `licensing` list containing one record with three fields.

### Record field rules

Within a record, field rules from section 3 apply: case-insensitive names,
canonical keys, and continuation lines. A record SHOULD have a stable
identifier field (e.g. `Location ID`, `Event ID`) when the publisher assigns
one, but parsers MUST NOT require it.

## 6. Values

All parsed values are strings unless a rule below normalizes them.

### Unknown and missing values

- A field that is absent produces no key in the output. Missing and unknown
  are different states.
- A field whose entire value is `unknown` (case-insensitive) normalizes to
  JSON `null`. A field whose value is `n/a` or `-` also normalizes to `null`.
- An empty field value on a list-introducing field (`Locations:`) is a block
  marker, not `null`. An empty value anywhere else is the empty string.

### Dates

Fields whose canonical key ends in `-date`, `last-updated`, `last-verified`,
`date-checked`, `published`, `expires`, or `expiration-date` MUST use
`YYYY-MM-DD` (ISO 8601 calendar date). Date-times use RFC 3339
(`YYYY-MM-DDTHH:MM:SSZ` or with offset). Publishers SHOULD NOT use any other
date format; parsers MUST report non-conforming values as warnings, not
errors, and preserve the raw string.

### URLs

Values in fields whose canonical key contains `url`, `website`, or `link`
SHOULD be absolute `https://` or `http://` URLs. `mailto:` is permitted in
`contact`. Parsers MUST report non-absolute or malformed URLs as warnings.
URL template placeholders in braces (e.g. `{state-slug}`) are permitted and
MUST be preserved verbatim; they mark a documented URL pattern, not a
retrievable resource.

### Lists of scalars

Comma-separated values are **not** split automatically. A field yields a
scalar unless the file expresses the value as `-` list items. Publishers
SHOULD prefer list items over comma-separated values for machine-readability.

## 7. Duplicate and unknown fields

- Within one context (metadata block or record), a scalar field MUST appear
  at most once. On duplicates, parsers MUST keep the first occurrence and
  report a duplicate-field warning naming the key and line numbers.
- Unknown fields MUST be preserved verbatim in the parsed output under
  their canonical keys. They MUST NOT produce errors — extensibility is a
  design principle of the family.
- A field whose canonical key is defined with a scalar value that instead
  introduces a record list (or vice versa) is reported as a type-mismatch
  warning; the parser emits the form actually present.

## 8. The Extensions block

The core file's machine-readable extension manifest is a metadata-block
field `Extensions` with an empty value, followed by `- identifier: url`
items:

```
Extensions:
- events: https://example.com/cannabis-events.txt
- dispensary: https://example.com/cannabis-dispensary.txt
```

- Identifiers are lowercase ASCII letters and hyphens. Recognized
  identifiers: `events`, `dispensary`, `delivery`, `flower-brand`,
  `edible-brand`, `concentrate-brand`, `physician`. Unknown identifiers are
  preserved and reported as informational notes, not errors.
- Each URL MUST be absolute and SHOULD point to the publisher's own domain
  root file, not to a specification document.
- Parsers emit `extensions` as an array of `{ "type": "events", "url": "..." }`
  objects in document order.
- `Depends on` remains a scalar metadata field; it is not an extension entry.

## 9. Conformance levels

Three levels, cumulative:

**Level 1 — Syntax.** The file parses under this grammar with no errors:
UTF-8, valid line classification, no unrecoverable structure (e.g. a list
item before any list context, a record field at list indentation that
contradicts its parent).

**Level 2 — Core metadata.** Level 1 plus: `version`, `status`, `publisher`
or `founding publisher`, `canonical url`, and a `last-updated` or `published`
date are present in the metadata block; `canonical url` is absolute;
date fields are ISO 8601. A `contact` field is recommended.

**Level 3 — Extension conformance.** Level 2 plus: extension files declare
`depends-on` naming `cannabis.txt` and a compatible version, and any
`extensions` entries use recognized identifiers and absolute URLs on the
publisher's domain.

Warnings never fail Level 1; they indicate data-quality issues
(duplicates, non-ISO dates, unknown fields used where defined fields exist).

## 10. Canonical JSON output model

A conforming parser produces a JSON object:

```json
{
  "specification": "cannabis.txt",
  "document": { "title": "Find420.Events Publisher Profile" },
  "metadata": {
    "version": "1.0.0",
    "status": "Published",
    "publisher": "Find420.Events",
    "publisher-type": "Cannabis event discovery platform",
    "canonical-url": "https://find420.events/cannabis.txt",
    "specification": "https://find420.events/specs/cannabis.txt",
    "last-updated": "2026-11-04",
    "language": "en",
    "website": "https://find420.events/",
    "contact": "https://www.instagram.com/find420.events/",
    "depends-on": null
  },
  "extensions": [
    { "type": "events", "url": "https://find420.events/cannabis-events.txt" }
  ],
  "sections": [
    {
      "heading": "3. EVENT DISCOVERY",
      "fields": {
        "calendar": "https://find420.events/calendar",
        "event-detail-url-pattern":
          "https://find420.events/cannabis-events/{event-slug}"
      },
      "lists": {},
      "text": "Event pages provide event-specific details ..."
    }
  ],
  "diagnostics": []
}
```

Rules for the output model:

- `specification` is the file name (`cannabis.txt`, `cannabis-events.txt`, …)
  when known; parsers that only receive content derive it from context and
  may emit `null`.
- `metadata` contains every metadata-block field under canonical keys,
  in first-seen order. Defined-but-absent keys are omitted, not `null`.
- `sections` preserves document order. Each section exposes `fields`
  (canonical-key map), `lists` (canonical-key → array of strings or record
  objects), and `text` (prose, joined paragraphs).
- `lists` at the top level holds block lists that appear in the metadata
  region — for example `Locations:` in a file without section headings. The
  `extensions` block is extracted into `extensions` and removed from `lists`.
- `diagnostics` is an array of `{ "level": "warning"|"error"|"note",
  "code": "duplicate-field"|..., "line": 12, "message": "..." }`.
  It is always present and may be empty.
- The output MUST be representable as JSON with no information loss for
  fields and lists; prose may be normalized (whitespace collapsed).

## 11. Reserved and defined keys

Parsers recognize these canonical keys without requiring them:

`title`, `version`, `status`, `publisher`, `founding-publisher`,
`publisher-type`, `canonical-url`, `canonical-project`, `suggested-location`,
`specification`, `last-updated`, `published`, `language`, `encoding`,
`media-type`, `contact`, `website`, `depends-on`, `extensions`,
`information-source`, `jurisdiction`, `effective-date`, `last-verified`,
`date-checked`, `source-url`, `public-verification-url`, `license-holder`,
`license-type`, `license-number`, `issuing-authority`, `license-status`,
`license-status-detail`, `verification-status`, `verified-by`,
`verification-url`, `expiration-date`, `location-id`, `license-reference`,
`licensing`.

`license-status` and `verification-status` use the lowercase vocabularies
defined in cannabis.txt section 8; validators MAY warn on unrecognized
values while parsers preserve them verbatim. `public-verification-url` and
`date-checked` are legacy aliases for `source-url` and `last-verified`;
parsers preserve them as written and validators SHOULD note the deprecation.

Extensions define additional keys in their own documents. Keys not listed
anywhere are unknown fields (section 7): preserved, never errors.

## 12. Non-goals

This grammar does not define: section vocabularies, category taxonomies,
verification semantics, or entity identifiers — those live in the
specification documents themselves. It does not adopt RFC 5322 or any other
message format wholesale; it defines only what cannabis.txt files need.
