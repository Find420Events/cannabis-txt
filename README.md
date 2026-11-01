# cannabis.txt

**Open, human-readable knowledge specifications for the cannabis industry.**

cannabis.txt is a proposed community specification: a plain-text file a website
publishes at its domain root that describes the cannabis industry in a shared,
consistent vocabulary — terminology, business categories, participants,
products, services, classifications, and relationships.

cannabis-events.txt is a specialized extension covering the events ecosystem:
event types, organizers, venues, schedules, participation, status, and
verification.

Together they give developers, businesses, publishers, search engines, research
tools, and AI systems a common frame of reference for understanding
cannabis-related subject matter.

## Files

| File | Layer | Purpose |
|---|---|---|
| [`cannabis.txt`](./cannabis.txt) | Industry-wide | Vocabulary and classification system for the cannabis industry as a whole |
| [`cannabis-events.txt`](./cannabis-events.txt) | Specialized | Vocabulary and classification system for cannabis events and industry participation |

## Status

- **Version:** 1.0.0
- **Status:** Proposed Community Specification
- **Published:** 2026-10-31
- **Founding publisher:** [Find420.Events](https://find420.events/)
- **Reference implementation:** https://find420.events/cannabis.txt · https://find420.events/cannabis-events.txt
- **Public validator:** https://find420.events/validator

## What this is — and is not

It **is** an informational publishing convention: a way to explain
cannabis-related subject matter consistently to any system that chooses to
retrieve and interpret it.

It is **not** a ranking signal, crawler directive, AI training mechanism, legal
standard, or endorsement mechanism. It does not verify businesses, products,
licenses, events, or claims.

## Publish your own

Any website may publish a compatible file — no permission, payment, or use of
Find420 services required.

1. Create a UTF-8 plain-text file at `/cannabis.txt` on your domain.
2. Identify version, status, publisher, and a last-updated date.
3. Use the shared taxonomy and field names where practical; extend with clearly
   named additions where needed.
4. Qualify legal and licensing claims with jurisdiction, source, and effective
   date.
5. If you publish or cover cannabis events, add `/cannabis-events.txt` and
   identify the cannabis.txt version it builds on.

See [`specification/implementation.md`](./specification/implementation.md) for
conformance rules and [`examples/`](./examples/) for starter files.

## Documentation

- [`specification/taxonomy.md`](./specification/taxonomy.md) — full category,
  participant, and event vocabulary
- [`specification/implementation.md`](./specification/implementation.md) — how
  to publish a compatible file
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
