# cannabis.txt

**Open, human-readable knowledge specifications for the cannabis industry.**

cannabis.txt is a proposed community specification: a plain-text file a website
publishes at its domain root that describes the cannabis industry in a shared,
consistent vocabulary — terminology, business categories, participants,
products, services, classifications, and relationships.

cannabis-events.txt is a specialized extension covering the events ecosystem:
event types, organizers, venues, schedules, participation, status, and
verification. The dispensary and delivery specifications add focused
vocabularies for retail operations and delivery services.

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

Specialized extensions depend on `cannabis.txt` version 1.0.0 or a compatible
version. A business may publish more than one extension when it performs more
than one business function. For example, a dispensary that also operates
delivery may publish both dispensary and delivery files.

## Status

- **Version:** 1.0.0 for the core and events specifications; 1.0.0 initial
  proposed versions for the dispensary and delivery extensions
- **Status:** Proposed Community Specifications
- **Published:** 2026-10-31 for the core and events specifications
- **Founding publisher:** [Find420.Events](https://find420.events/)
- **Reference implementation:** https://find420.events/cannabis.txt ·
  https://find420.events/cannabis-events.txt
- **Public validator:** https://find420.events/validator
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
   `cannabis.txt` version. Use the events, dispensary, and delivery extensions
   only where they describe your public information.

See [`specification/implementation.md`](./specification/implementation.md) for
conformance rules and [`examples/`](./examples/) for starter files.

## Documentation

- [`specification/taxonomy.md`](./specification/taxonomy.md) — shared
  industry, participant, event, dispensary, and delivery vocabulary
- [`specification/implementation.md`](./specification/implementation.md) — how
  to publish compatible files
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
