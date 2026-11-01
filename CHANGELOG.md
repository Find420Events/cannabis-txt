# Changelog

All notable changes to cannabis.txt and cannabis-events.txt are documented
here. Both specifications use [semantic versioning](https://semver.org):

- **MAJOR** — incompatible changes to definitions or required fields
- **MINOR** — backward-compatible additions
- **PATCH** — clarifications and corrections

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
