# cannabis.txt

**Open, human-readable knowledge specifications for the cannabis industry.**

cannabis.txt is a proposed community specification: a plain-text file a website
publishes at its domain root that describes the cannabis industry in a shared,
consistent vocabulary — terminology, business categories, participants,
products, services, classifications, and relationships.

cannabis-events.txt is a specialized extension covering the events ecosystem:
event types, organizers, venues, schedules, participation, status, and
verification. The dispensary and delivery specifications add focused
vocabularies for retail operations and delivery services. The flower, edible,
and concentrate brand specifications describe product-brand information; the
physician extension covers public professional profiles and practice services.

Together, these specifications give developers, businesses, publishers, search
engines, research tools, and AI systems a common frame of reference for
understanding cannabis-related subject matter.

## Files

| File | Layer | Purpose |
|---|---|---|
| [`cannabis.txt`](./cannabis.txt) | Industry-wide | Core vocabulary and classification system for the cannabis industry |
| [`cannabis-events.txt`](./cannabis-events.txt) | Specialized | Events, organizers, venues, schedules, participation, and event status |
| [`cannabis-dispensary.txt`](./cannabis-dispensary.txt) | Specialized | Retail dispensaries, storefronts, menus, inventory, access, and customer services |
| [`cannabis-delivery.txt`](./cannabis-delivery.txt) | Specialized | Delivery operators, ordering, service areas, fulfillment, dispatch, and handoff |
| [`cannabis-flower-brand.txt`](./cannabis-flower-brand.txt) | Specialized | Flower brands, product formats, public product attributes, testing references, and supply-chain roles |
| [`cannabis-edible-brand.txt`](./cannabis-edible-brand.txt) | Specialized | Edible brands, product and label information, ingredients, package values, and testing references |
| [`cannabis-concentrate-brand.txt`](./cannabis-concentrate-brand.txt) | Specialized | Concentrate brands, product vocabulary, public composition claims, testing, and supply-chain roles |
| [`cannabis-physician.txt`](./cannabis-physician.txt) | Specialized | Physician profiles, credential sources, practice services, jurisdiction context, and patient privacy |

Specialized extensions depend on `cannabis.txt` version 1.1.0 or a compatible
version. A business may publish more than one extension when it performs more
than one business function. For example, a dispensary that also operates
delivery may publish both dispensary and delivery files.

## Status

- **Family changelog:** 1.8.0
- **File versions:** 1.1.0 for the core specification; 1.1.2 for the events
  extension; 1.2.0 for the dispensary, delivery, product-brand, and
  physician extensions
- **Status:** Proposed Community Specifications
- **Published:** 2026-10-31 for the core and events specifications; 2026-11-01
  for the dispensary, delivery, flower-brand, edible-brand, concentrate-brand,
  and physician extensions
- **Founding publisher:** [Find420.Events](https://find420.events/)
- **Find420 publisher profiles:** https://find420.events/cannabis.txt ·
  https://find420.events/cannabis-events.txt
- **Hosted specifications:** https://find420.events/specs/cannabis.txt ·
  https://find420.events/specs/cannabis-events.txt and the extension
  specifications under `https://find420.events/specs/`
- **Public validator:** https://find420.events/validator
- **Extension specifications:** https://find420.events/specs/cannabis-dispensary.txt,
  https://find420.events/specs/cannabis-delivery.txt,
  https://find420.events/specs/cannabis-flower-brand.txt,
  https://find420.events/specs/cannabis-edible-brand.txt,
  https://find420.events/specs/cannabis-concentrate-brand.txt, and
  https://find420.events/specs/cannabis-physician.txt
- **Canonical project:** https://github.com/Find420Events/cannabis-txt

## What this is — and is not

These files are informational publishing conventions: a way to explain
cannabis-related subject matter consistently to systems that choose to
retrieve and interpret it.

They are not ranking signals, crawler directives, AI training mechanisms, legal
standards, licensing databases, verification systems, or endorsements. They do
not verify businesses, products, licenses, delivery authority, events, or
claims.

## Publish your own

Any website may publish compatible files — no permission, payment, or use of
Find420 services required.

1. Create a UTF-8 plain-text file at `/cannabis.txt` on your domain.
2. Identify version, status, publisher, and a last-updated date.
3. Use the shared taxonomy and field names where practical; extend with clearly
   named additions where needed.
4. Qualify legal and licensing claims with jurisdiction, source, and effective
   date.
5. Publish applicable extensions at the domain root and declare the parent
   `cannabis.txt` version. Use the relevant events, dispensary, delivery,
   product-brand, or physician extension only where it describes your public
   information.

See [`specification/implementation.md`](./specification/implementation.md) for
conformance rules and [`examples/`](./examples/) for starter files.

New extension examples:

- [`examples/flower-brand.txt`](./examples/flower-brand.txt)
- [`examples/edible-brand.txt`](./examples/edible-brand.txt)
- [`examples/concentrate-brand.txt`](./examples/concentrate-brand.txt)
- [`examples/physician.txt`](./examples/physician.txt)

Core publisher examples:

- Generic starter files: [`examples/cannabis.txt`](./examples/cannabis.txt)
  and [`examples/cannabis-events.txt`](./examples/cannabis-events.txt)
- Find420's first-party profiles:
  [`examples/find420/cannabis.txt`](./examples/find420/cannabis.txt) and
  [`examples/find420/cannabis-events.txt`](./examples/find420/cannabis-events.txt)

The Find420 examples mirror the publisher profiles served from the domain
root; keep them in sync when those profiles change.

## Documentation

- [`specification/taxonomy.md`](./specification/taxonomy.md) — shared
  industry, participant, event, retail, product-brand, and physician vocabulary
- [`specification/implementation.md`](./specification/implementation.md) — how
  to publish compatible files
- [`specification/grammar.md`](./specification/grammar.md) — formal
  machine-readable grammar for parsers and validators
- [`parser/`](./parser/) — zero-dependency TypeScript reference parser, CLI
  validator, and conformance fixtures (`npm test`)
- [`schemas/`](./schemas/) — JSON Schema definitions for the canonical
  document model and licensing records
- [`specification/governance.md`](./specification/governance.md) — versioning
  and the change process

## Contributing

This is a community specification. Compatible implementations, taxonomy
proposals, corrections, and implementation examples are welcome — open an issue
or a pull request. Find420.Events acts as founding steward; no publisher owns
the vocabulary.

## License

[CC0 1.0 Universal](./LICENSE) — the specification text is dedicated to the
public domain. Implement it without restriction or attribution.
