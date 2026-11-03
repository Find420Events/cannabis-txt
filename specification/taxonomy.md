# Taxonomy

The shared vocabulary defined by cannabis.txt and its event, retail, delivery,
product-brand, and physician extensions.
Categories are descriptive — they are not legal determinations, proof of
licensure, or endorsements.

## Industry taxonomy (cannabis.txt §5)

### Plant and production

- Cultivation
- Nursery
- Genetics and breeding
- Harvesting
- Processing
- Extraction
- Manufacturing
- Packaging
- Testing and laboratory services

### Supply chain and commerce

- Distribution
- Wholesale
- Retail
- Delivery
- Brand
- Product development
- Supply-chain services

### Ancillary businesses

- Technology provider
- Software and SaaS
- Marketing and advertising
- Design and creative services
- Legal services
- Accounting and finance
- Insurance
- Real estate
- Security
- Equipment and supplies
- Consulting
- Education and training
- Media and publishing
- Payments and financial services

### Community and public-interest activity

- Research
- Public education
- Advocacy
- Community organization
- Workforce development
- Charity and fundraising
- Social equity initiative

### Industry events

- Expo
- Trade show
- Conference
- Convention
- Networking event
- Festival
- Pop-up
- Vendor market
- Educational event
- Workshop
- Job fair
- Fundraiser
- Product or brand showcase

## Participant vocabulary (cannabis.txt §6)

- Business
- Brand
- Manufacturer
- Cultivator
- Distributor
- Retailer
- Service provider
- Technology provider
- Event organizer
- Venue
- Exhibitor
- Vendor
- Sponsor
- Speaker
- Educator
- Researcher
- Industry professional
- Attendee
- Consumer

A person may hold multiple roles. Do not infer a person's role, identity,
qualification, or legal authority without reliable supporting information.

## Product and service vocabulary (cannabis.txt §7)

- Cannabis-derived product
- Hemp-derived product
- Accessory
- Equipment
- Software
- Professional service
- Educational service
- Marketing service
- Event service
- Ancillary service

## Event taxonomy (cannabis-events.txt §4)

- Expo
- Trade Show
- Conference
- Convention
- Networking Event
- Festival
- Pop-Up
- Vendor Market
- Educational Event
- Workshop
- Seminar
- Webinar
- Livestream
- Job Fair
- Charity Event
- Fundraiser
- Business-to-Business Event
- Brand Showcase
- Product Showcase
- Community Event
- Industry Meeting

Publishers may add subcategories. Preserve the primary type and use a
descriptive subtype when needed.

## Event roles (cannabis-events.txt §5)

- Organizer
- Co-organizer
- Host
- Venue
- Exhibitor
- Vendor
- Sponsor
- Speaker
- Presenter
- Instructor
- Performer
- Partner
- Media Partner
- Attendee

## Event status vocabulary (cannabis-events.txt §6)

| Status | Meaning |
|---|---|
| Draft | Not publicly announced |
| Announced | Publicly announced; details may still change |
| Scheduled | Event is planned for the stated date |
| Registration Open | Registration is available |
| Sold Out | Organizer reports no remaining admission capacity |
| Postponed | Event moved from its original date |
| Cancelled | Organizer has cancelled the event |
| Rescheduled | A replacement date has been announced |
| Live | Event is currently taking place |
| Completed | Event has ended |
| Unknown | Status cannot be established |

Internal moderation statuses (pending review, approved, rejected, expired) are
workflow states — do not confuse them with public event status.

## Event formats (cannabis-events.txt §8)

- In Person
- Online
- Hybrid
- Multiple Locations
- Location To Be Announced

## Access descriptions (cannabis-events.txt §9)

- Free
- Paid
- Invitation Only
- Registration Required
- Public
- Restricted
- Age Restricted
- Members Only

These describe access conditions and do not establish legal eligibility.

## Dispensary and retail taxonomy (`cannabis-dispensary.txt`)

### Business types

- Cannabis dispensary
- Adult-use cannabis retailer
- Medical cannabis dispensary
- Medical and adult-use retailer
- Cannabis retail chain
- Independent cannabis retailer
- Cannabis retail cooperative, where recognized
- Cannabis retail franchise, where applicable
- Cannabis retail operator

### Retail location and access

- Storefront location
- Multi-location retail operator
- Location identifier (publisher-defined, non-sensitive)
- Storefront status (open, temporarily closed, permanently closed,
  coming soon, unknown)
- In-store shopping
- Walk-in service
- Appointment-based service
- Online menu
- Online pre-order
- In-store pickup
- Curbside pickup, where lawful
- Accessibility accommodations

### Retail product categories

- Flower
- Pre-roll
- Vaporizer product
- Concentrate
- Edible
- Beverage
- Tincture
- Capsule or tablet
- Topical
- Transdermal product
- Accessory
- Other regulated retail product

### Inventory descriptors

- In stock
- Limited availability
- Out of stock
- Available for pre-order
- Coming soon
- Discontinued
- Availability unknown

## Delivery taxonomy (`cannabis-delivery.txt`)

### Business and service types

- Cannabis delivery operator
- Dispensary-operated delivery service
- Retailer-managed delivery
- Third-party delivery service
- Delivery technology platform
- Order marketplace or ordering platform
- Contracted logistics provider, where lawful
- Medical cannabis delivery service, where authorized
- Adult-use cannabis delivery service, where authorized

### Ordering channels

- Business website
- Online menu and checkout
- Mobile application
- Telephone ordering
- In-store order with delivery fulfillment
- Authorized third-party ordering platform

### Fulfillment and delivery status

- Cart or order submitted
- Order received
- Order under review
- Eligibility check pending
- Order accepted
- Order rejected or cancelled
- Preparing order
- Awaiting dispatch
- Assigned for delivery
- Out for delivery
- Delivery attempted
- Awaiting customer handoff
- Delivered
- Returned or undeliverable
- Refunded or otherwise resolved

### Service areas and coverage

- Service city or market
- Publicly named hub city or operating base
- Published coverage map
- Operator-confirmed, third-party, or estimated coverage

Hub locations are described at city or regional level only; facilities
that are not open to the public should not be given street addresses.

### Service availability

- Active
- Temporarily unavailable
- Paused
- Coming soon
- Discontinued
- Unknown

Publishers may add subcategories. Preserve the shared primary term and use a
descriptive subtype when needed. See each extension for definitions and
safeguards.

## Multi-location and multi-market conventions

Publishers with more than one location, service area, or market describe
each with a repeating block of fields — one entry per record:

- `Locations:` — dispensary storefronts; per-location identifier, name,
  address, locality, jurisdiction, hours, menu, and public contact fields
- `Practice Locations:` — physician practice locations; per-location
  name, address, jurisdiction, hours, appointment, and telehealth fields
- `Service Areas:` — delivery service cities or regions, with an optional
  publicly named hub city and per-area ordering, hours, and coverage
  source
- `Markets:` — product-brand market jurisdictions, with per-market
  availability status, catalog or menu URL, distributor, and
  last-verified date

## Flower brand vocabulary (`cannabis-flower-brand.txt`)

### Product formats

- Whole flower
- Ground flower
- Small buds or popcorn flower
- Pre-roll
- Multi-pack pre-roll
- Other flower format

### Public product attributes

- Cultivar or strain name as stated by the source
- Indoor, greenhouse, outdoor, or other source-supported cultivation
  descriptor
- Package weight and unit count
- Cannabinoid or terpene values, with source units and package context
- Public batch or lot identifier and testing record URL

Terms such as indica, sativa, hybrid, and strain may not have consistent
definitions. Do not treat them as verified genetics or guaranteed predictors
of effects or quality.

## Edible brand vocabulary (`cannabis-edible-brand.txt`)

### Product formats

- Baked good
- Chocolate or confection
- Gummy or chew
- Hard candy or lozenge
- Beverage
- Powder or mix
- Other ingestible format

### Label information

- Product ingredients and source attribution
- Allergen and nutrition statements as displayed by the source
- Package size and unit count
- Serving information as labeled
- Cannabinoid values per serving and per package, separately stated
- Public batch or lot identifier and testing record URL

Label information is descriptive, not consumption or dosing guidance. Do not
infer allergen-free status, suitability, safety, or effect.

## Concentrate brand vocabulary (`cannabis-concentrate-brand.txt`)

### Product categories

- Rosin
- Resin
- Wax
- Shatter
- Badder or batter
- Crumble
- Oil
- Distillate
- Isolate
- Hash or hash-derived concentrate
- Cartridge or vaporizer product
- Other concentrate format

Use category names as stated by the product source. Names may vary across
producers and regions; do not infer manufacturing process, composition,
potency, purity, or quality from a category name.

### Public composition and testing attributes

- Cannabinoid and terpene values with source units
- Ingredients or additives as stated on a public label
- Public source-material or cultivar attribution
- Batch or lot identifier
- Public certificate of analysis or test record URL

These are source-reported attributes, not guarantees of safety, efficacy, or
regulatory compliance.

## Physician vocabulary (`cannabis-physician.txt`)

### Professional and practice entities

- Physician
- Healthcare professional
- Practice or clinic
- Public practice location
- Multi-location practice
- Professional license
- Separate jurisdiction-specific service authorization

### Public service descriptors

- General health education
- Clinical consultation
- Follow-up care
- Referral to another qualified professional
- Telehealth service, where permitted

Use professional titles and credentials as supported by public verification
sources. Distinguish professional licensure from authorization for a
cannabis-related service. Do not include patient information or imply
eligibility, treatment outcome, or universal clinical guidance.
