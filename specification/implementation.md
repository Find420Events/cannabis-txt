# Implementation

How to publish a compatible cannabis.txt or cannabis-events.txt file.

## Baseline requirements

A compatible file SHOULD:

- Be available at `/cannabis.txt` (or `/cannabis-events.txt`) on the publishing
  domain, served as `text/plain; charset=utf-8`
- Identify its version, status, publisher, and last-updated date
- Explain the publisher's relationship to the information
- Use recognizable section headings and the defined vocabulary where practical
- Link to authoritative public pages where useful
- Distinguish the publisher's own information from general definitions
- Be kept current; correct outdated information promptly

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

For cannabis-events.txt, additionally declare the parent version:

```
Depends on: cannabis.txt version 1.0.0 or compatible
```

## Step-by-step

1. **Create the file.** UTF-8 plain text. Use the spec file in this repository
   or the `examples/` directory as a starting point.
2. **Replace publisher placeholders.** Identify your organization, canonical
   URL, update date, and contact. Describe only what is true of your own site —
   your taxonomy usage, your entities, your events.
3. **Publish at the domain root.** `https://example.com/cannabis.txt` (and
   `https://example.com/cannabis-events.txt` if you cover events).
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
