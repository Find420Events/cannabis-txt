# Changelog

All notable changes to the cannabis.txt specification family are documented
here. Each specification uses [semantic versioning](https://semver.org):

- **MAJOR** — incompatible changes to definitions or required fields
- **MINOR** — backward-compatible additions
- **PATCH** — clarifications and corrections

## [1.8.0] - 2026-11-04

Conformance fixes, schema tightening, and tooling updates; extension
dependency declarations are now consistent across the family.

- `cannabis-events.txt` 1.1.1 → 1.1.2 — raised the declared minimum core
  dependency to `cannabis.txt` 1.1.0, matching the other extensions and the
  licensing-record structure it references. The events examples now declare
  1.1.0 as well, and the README dependency text is aligned.
- `parser/` — the reference parser now enforces the Level 3 extension rules
  from `specification/grammar.md` section 9: `extensions` entries must use
  recognized identifiers and resolve absolute http(s) URLs on the
  publisher's domain (the host of `canonical-url`; subdomains accepted).
  Violations emit errors and cap conformance at level 2.
- `parser/` — URL validation now uses real URL parsing (`new URL`) instead
  of a scheme regex: URL-bearing fields warn unless they are absolute
  http(s); `contact` accepts any absolute scheme (e.g. `mailto:`);
  `canonical-url` must be http(s).
- `parser/cli.ts` — `--json` now prints a structured validation report
  (`{ specification, version, conformance-level, valid, errors, warnings,
  notes }`) and the text output includes a badge line
  (`cannabis.txt: v1.1.0 ✓`). The full canonical model moved to `--model`.
- `schemas/cannabis-txt.schema.json` — typed constraints for metadata-block
  fields (semver `version`, ISO dates, BCP 47 `language`, http(s) URL
  patterns), typed `fields`/`lists` maps on sections, and an http(s)
  pattern on extension URLs.
- `schemas/licensing.schema.json` — `license-type` is now required with
  `jurisdiction`; added optional `id`, `effective-date`, and `authority-id`
  fields.
- Added `schemas/licensing-authorities.schema.json` for a registry of
  issuing authorities that license records can reference via
  `authority-id`.
- `package.json` — `engines` now targets active LTS releases
  (`^22.18.0 || >=24.0.0`) instead of the EOL Node 23 line; Node 22.18+
  supports native TypeScript type stripping.
- Added `.github/workflows/ci.yml` running the test suite and CLI
  validation on Node 22.x and 24.x.

## [1.7.0] - 2026-11-04

Added JSON Schema definitions for machine validation; no normative
definitions changed.

- Added `schemas/cannabis-txt.schema.json` validating the canonical JSON
  output model from `specification/grammar.md` section 10.
- Added `schemas/licensing.schema.json` validating a `Licensing:` record:
  enum constraints for `license-status`/`verification-status`, ISO date
  patterns, and the conditional `source-url`/`verified-by` requirements.
- Added `parser/schema.ts`, a minimal zero-dependency JSON Schema
  validator covering the subset used by these schemas, and wired both
  schemas into the conformance test suite (40 checks).

## [1.6.0] - 2026-11-04

Standardized licensing records and provenance vocabularies; all changes
are backward-compatible additions.

- `cannabis.txt` 1.0.0 → 1.1.0 — section 8 now defines the shared
  `Licensing:` record block (jurisdiction, license holder, type, number,
  issuing authority, status, verification, source, dates, and `Location ID`
  linkage), a License Status vocabulary describing what the regulatory
  source reports, and a Verification Status vocabulary describing how the
  claim was checked (`publisher-reported`, `source-matched`,
  `independently-verified`, `unknown`).
- Dispensary, delivery, flower-brand, edible-brand, concentrate-brand, and
  physician extensions 1.1.0 → 1.2.0 — licensing sections now reference the
  shared core structure, and `Depends on` declarations require cannabis.txt
  1.1.0 or compatible.
- `cannabis-events.txt` 1.1.0 → 1.1.1 — clarified that event and venue
  permits are jurisdiction-specific and would reuse the core structure.
- `specification/grammar.md` — added licensing keys to the defined-keys
  list and documented the `source-matched`/`independently-verified`
  semantics, status vocabularies, and legacy aliases
  (`Public Verification URL` → `Source URL`, `Date Checked` →
  `Last Verified`).
- `specification/taxonomy.md` — documented the licensing record fields and
  both status vocabularies.
- `specification/implementation.md` — added licensing-record guidance and
  verification expectations.
- `parser/` — added semantic validation for licensing records: enum
  warnings for `license-status`/`verification-status`, conditional checks
  (`source-matched`/`independently-verified` need `Source URL`,
  `independently-verified` needs `Verified By`, regulator status claims
  need a source), and deprecation warnings for legacy field names. New
  fixtures cover multi-license, multi-jurisdiction, location-linked,
  unknown, expired, and third-party verification cases.
- `examples/` — converted dispensary, delivery, physician, and product
  brand examples to the standardized `Licensing:` record block.

## [1.5.0] - 2026-11-04

`cannabis-events.txt` 1.0.0 → 1.1.0: backward-compatible addition.

- Added an explicit Schema.org crosswalk in section 15: field mapping for
  the event data model, a status mapping onto `EventStatusType`
  (including `SoldOut` via `Offer.availability`), and an attendance-mode
  mapping onto `eventAttendanceMode`.
- No existing definitions or required fields changed.

## [1.4.0] - 2026-11-04

Added a formal machine-readable grammar for the specification family; no
normative definitions or specification file versions changed.

- Added `specification/grammar.md`: line classification, field syntax and
  canonical keys, continuation lines, list and record structure, value
  normalization (dates, URLs, unknown values), duplicate and unknown field
  handling, the `Extensions` manifest block, three conformance levels, and a
  canonical JSON output model.
- Added `parser/`: a zero-dependency TypeScript reference implementation of
  the grammar with a CLI validator (`node parser/cli.ts <path-or-url>`) and
  public conformance fixtures (`parser/fixtures/`).
- Linked the grammar from the README and implementation guidance.

## [1.3.2] - 2026-11-04

Completed the hosted-specification path migration and clarified extension
discovery for publisher files.

- Moved all six remaining hosted extension specification URLs under `/specs/`.
- Added an `Extensions:` manifest to the Find420 first-party core profile.
- Documented the optional extension-manifest format and updated examples.

## [1.3.1] - 2026-11-04

Repository and hosted-reference updates; no normative definitions or
specification file versions changed.

- Updated the hosted canonical URLs for the core and events specifications to
  `/specs/cannabis.txt` and `/specs/cannabis-events.txt`.
- Added generic core and events publisher starter examples.
- Added Find420.Events first-party publisher profiles as reference examples.
- Clarified the distinction between the hosted specification documents and
  compatible publisher files served from a domain root.

## [1.3.0] — 2026-11-03

Backward-compatible additions for businesses with multiple locations,
service areas, or markets. The core `cannabis.txt` and
`cannabis-events.txt` 1.0.0 definitions are unchanged.

### Multi-location and multi-market support

- `cannabis-dispensary.txt` 1.1.0 — clarified that multi-storefront
  businesses describe each location with a repeating `Locations` block
  using the Section 5 location attributes, including a publisher-defined
  location identifier.
- `cannabis-physician.txt` 1.1.0 — added guidance for practices operating
  at multiple public locations and a repeating `Practice Locations` block
  with per-location jurisdiction, hours, and appointment fields.
- `cannabis-delivery.txt` 1.1.0 — added per-city and per-hub coverage for
  operators serving multiple cities or dispatching from multiple
  operating bases, via a repeating `Service Areas` block.
- `cannabis-flower-brand.txt`, `cannabis-edible-brand.txt`, and
  `cannabis-concentrate-brand.txt` 1.1.0 — added a repeating `Markets`
  block for brands selling in multiple jurisdictions, with per-market
  availability, catalog links, and distributor attribution.
- Updated the dispensary, delivery, physician, and product-brand examples
  to illustrate the repeating location, service-area, and market blocks.
- Expanded the shared taxonomy with multi-location, service-area, and
  market vocabulary.

## [1.2.0] - 2026-11-01

Backward-compatible additions of four specialized extensions. The core
vocabulary and existing extension definitions remain compatible with
`cannabis.txt` version 1.0.0.

### New extensions

- Added `cannabis-flower-brand.txt` for flower brand identity, product formats,
  public product attributes, testing references, and supply-chain roles.
- Added `cannabis-edible-brand.txt` for edible brand identity, product and
  label information, ingredients, serving and package values, and testing.
- Added `cannabis-concentrate-brand.txt` for concentrate brand identity,
  product vocabulary, public composition claims, testing, and supply-chain
  roles.
- Added `cannabis-physician.txt` for public physician profiles, credential
  sources, practice services, jurisdiction context, and patient privacy.
- Added illustrative publisher examples for all four extensions.

### Documentation

- Added the extension references to the core specification and README.
- Expanded implementation guidance and shared taxonomy for product-brand and
  physician profiles.
- Updated governance and versioning language to describe the full specification
  family.

## [1.1.0] — 2026-11-01

Backward-compatible additions to the proposed community specification family.

### New extensions

- Added `cannabis-dispensary.txt` for dispensary business types, retail
  locations, customer access, menus, inventory freshness, retail services,
  licensing context, and privacy.
- Added `cannabis-delivery.txt` for delivery business models, ordering
  channels, service areas, fulfillment states, handoff, fees, licensing
  context, and privacy.
- Added illustrative dispensary and delivery publisher examples.

### Documentation

- Expanded the repository index to list the new extensions.
- Added dispensary and delivery vocabulary to the shared taxonomy.
- Expanded implementation guidance for extension dependencies,
  cross-references, business-role distinctions, data freshness, and privacy.

The core `cannabis.txt` and `cannabis-events.txt` 1.0.0 definitions are
unchanged by these additions.

## [1.0.0] — 2026-10-31

Initial proposed community specification.

### cannabis.txt

- Core cannabis industry definition covering the cannabis and hemp ecosystem
- Industry taxonomy: plant and production, supply chain and commerce,
  ancillary businesses, community and public-interest activity, industry events
- Participant vocabulary
- Product and service classifications
- Jurisdiction and regulatory context rules
- Entity and relationship model
- Recommended file format and metadata
- Extension mechanism, discovery, versioning, and governance rules

### cannabis-events.txt

- Event taxonomy (expos, trade shows, festivals, pop-ups, vendor markets,
  workshops, webinars, livestreams, fundraisers, and more)
- Participant and role vocabulary
- Public event status vocabulary
- Date, time, and timezone conventions (ISO 8601, IANA identifiers)
- Location and format vocabulary
- Registration and access descriptions
- Public event data model with required-when-known and optional fields
- Event series, verification, structured data, jurisdiction, and privacy rules
