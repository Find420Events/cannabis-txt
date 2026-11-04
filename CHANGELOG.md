# Changelog

All notable changes to the cannabis.txt specification family are documented
here. Each specification uses [semantic versioning](https://semver.org):

- **MAJOR** — incompatible changes to definitions or required fields
- **MINOR** — backward-compatible additions
- **PATCH** — clarifications and corrections

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
