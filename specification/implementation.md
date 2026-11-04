# Implementation

How to publish compatible files in the cannabis.txt specification family.

## Baseline requirements

A compatible core or extension file SHOULD:

- Be available at its specified root path on the publishing domain, served as
  `text/plain; charset=utf-8`
- Identify its version, status, publisher, and last-updated date
- Explain the publisher's relationship to the information
- Use recognizable section headings and the defined vocabulary where practical
- Link to authoritative public pages where useful
- Distinguish the publisher's own information from general definitions
- Be kept current; correct outdated information promptly

The specification documents published by a project steward may be hosted
under a documented path such as `/specs/`. This does not change the required
root path for a publisher's compatible implementation: `/cannabis.txt` and
any applicable extension files remain on that publisher's domain root.

A compatible file MUST NOT:

- Claim that publication guarantees search ranking or AI citations
- Misrepresent licensing, legal status, medical efficacy, or product safety
- Present one jurisdiction's law as universal
- Include credentials, private user data, or non-public records
- Imply certification or endorsement by a regulator without evidence

## Recommended metadata

```
Title: Cannabis Industry Knowledge File
Version: 1.0.0
Status: Proposed
Publisher: [Organization name]
Canonical URL: [URL]
Last-Updated: [YYYY-MM-DD]
Language: en
Contact: [Public contact URL]
```

Every specialized extension additionally declares its compatible parent:

```
Depends on: cannabis.txt version 1.0.0 or compatible
```

## Step-by-step

1. **Create the file.** UTF-8 plain text. Use the spec file in this repository
   or the `examples/` directory as a starting point.
2. **Replace publisher placeholders.** Identify your organization, canonical
   URL, update date, and contact. Describe only what is true of your own site —
   your taxonomy usage, entities, products, services, professionals, or events.
3. **Publish at the domain root.** Publish `/cannabis.txt` and any applicable
   extension files at their specified root paths.
4. **Link it.** From your homepage, About page, public documentation, sitemap,
   or developer resources. You may reference it in `robots.txt` as a comment —
   do not invent a directive for it.
5. **Maintain it.** Keep a last-updated date, version changes with semver, and
   correct outdated information promptly.

## Jurisdiction rules

Cannabis laws differ by country, state, province, territory, tribal
jurisdiction, county, and municipality. When making a legal or licensing
statement, provide:

- Jurisdiction name and level
- Relevant agency or official source
- Effective date or last-verified date
- A link to the official source
- A clear distinction between law, guidance, and interpretation

Do not use "licensed" or "legal" as unqualified marketing claims. A directory
listing or user-submitted profile is not proof of authorization.

## Verification and data quality (events)

Distinguish organizer-confirmed information, official venue/partner reports,
user-submitted information awaiting review, independently reported
information, and estimated or unknown information. Recommended verification
metadata: verification status, last verified date, verifying source,
correction contact.

If an event is postponed or cancelled, update public status promptly. Never
publish private attendee lists, personal contact information, private
invitation codes, or non-public access instructions.

## Extensions and compatibility

Publishers may create additional files for specialized subjects (e.g.
cannabis-licensing.txt, cannabis-research.txt, cannabis-technology.txt). An
extension should state which cannabis.txt version it builds on, define its own
scope, and avoid redefining core terms inconsistently.

Compatibility never requires using Find420 or implies endorsement by it.

## Specialized extension files

A publisher may publish one or more specialized extensions alongside
`/cannabis.txt` when those extensions describe business activities covered by
the publisher's public information.

Current extensions:

- `/cannabis-events.txt` — events and event participation.
- `/cannabis-dispensary.txt` — cannabis retail businesses and storefront
  operations.
- `/cannabis-delivery.txt` — cannabis delivery operators and fulfillment
  services.
- `/cannabis-flower-brand.txt` — brands and public information about cannabis
  flower products.
- `/cannabis-edible-brand.txt` — brands and public information about cannabis
  edible products.
- `/cannabis-concentrate-brand.txt` — brands and public information about
  cannabis concentrate products.
- `/cannabis-physician.txt` — public profiles and service information for
  physicians with cannabis-related clinical or educational services.

Each extension SHOULD:

- Be served as `text/plain; charset=utf-8`.
- Identify its own version, status, publisher, canonical URL, and last-updated
  date.
- Declare `Depends on: cannabis.txt version 1.0.0 or compatible` (or the
  compatible parent version actually used).
- Describe only the publisher's own business, services, locations, or
  information sources accurately.
- Distinguish the seller, retailer, delivery operator, marketplace, and
  technology provider when they are different entities.
- Distinguish brand ownership from licensing, cultivation, processing,
  manufacturing, and distribution relationships.
- Link to public authoritative pages for locations, menus, service areas,
  policies, and regulator records where useful.
- Qualify legal and licensing claims with jurisdiction, source, and effective
  date.
- Attribute product, batch, label, and testing data to a public source; preserve
  the source's units and dates.
- Do not infer product potency, effects, quality, safety, or medical benefit.
- For physician profiles, use verified public titles and credentials, link to
  official licensing sources, and do not publish patient information or
  individualized medical advice.

A business that operates a dispensary and also provides delivery may publish
both `cannabis-dispensary.txt` and `cannabis-delivery.txt`. The files describe
different business functions; they do not imply separate legal entities.

Product brands may publish one or more product extensions when their public
catalog includes those categories. Brand, manufacturer, processor, cultivator,
licensee, and distributor roles SHOULD be distinguished when they differ. A
product or batch listing does not establish current inventory, authorization,
or a safety or efficacy claim.

A physician or practice may publish `cannabis-physician.txt` when it maintains
public information about relevant professional services. Use the accurate
professional title, identify the source and jurisdiction for credentials, and
do not imply patient eligibility, a treatment outcome, or authorization that
the cited source does not establish.

## Suggested discovery links

Publishers may list applicable extension URLs in the core `/cannabis.txt` file
under an `Extensions` or `Related Specifications` section. This is a
human-readable cross-reference, not an automated discovery guarantee. Do not
list an extension unless it is actually published and maintained.

For consistent parsing, use a top-level `Extensions:` block with one
lowercase extension identifier and absolute publisher-file URL per line:

```
Extensions:
- events: https://example.com/cannabis-events.txt
- dispensary: https://example.com/cannabis-dispensary.txt
```

Recognized identifiers are `events`, `dispensary`, `delivery`, `flower-brand`,
`edible-brand`, `concentrate-brand`, and `physician`. Include only extensions
that the publisher actually maintains; omit the block when none are published.
List publisher files here, not links to the normative specification documents.

## Data freshness and privacy

Treat menus, inventory, product formulations, label values, test records,
service areas, fees, hours, delivery windows, credentials, and license status
as changeable information. Include sources and last-updated timestamps where
practical. Do not expose customer/order data, patient status, medical records,
private addresses, driver routes, credentials, or sensitive operational
information.

## Legal and licensing claims

A taxonomy label is not evidence of authorization. Identify the responsible
legal entity, activity, jurisdiction, issuing authority, status source, and
date checked where available. Do not attribute one entity's license to another
entity or present a publisher statement as regulator verification.
