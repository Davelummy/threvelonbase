# Threvelonbase Product and Conversion Audit

**Audit basis:** `53b8e8c` (`Apply responsive Threvelonbase identity and brand colors`)

**Worktree:** `audit/product-conversion`

**Audit type:** Read-only product, customer-journey, and conversion audit

## Scope and Method

Reviewed the complete tracked application surface at the starting commit:

- `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, and `app/chatgpt-auth.ts`
- `README.md`, `package.json`, `package-lock.json`, TypeScript, Next, Vite, PostCSS, ESLint, Drizzle, and hosting configuration
- `tests/rendered-html.test.mjs`
- All shell scripts under `scripts/`
- Worker, build plugin, database stubs, D1 example, public brand assets, and Git history for the three commits leading to `53b8e8c`

This is a source and journey review, not a live browser, WhatsApp, or workshop-operations test. No application files or existing documentation were changed. Recommendations do not assume online payment, ecommerce inventory, a new service line, or a change to the confirmed operating model.

## Confirmed Operating Constraints

The current product decisions that recommendations must preserve are visible in the implementation:

| Decision | Evidence | Audit treatment |
| --- | --- | --- |
| Repairs are the lead offer | `app/page.tsx:194`, hero and navigation at `156-167` | Preserve the repair-first hierarchy and primary CTA. |
| WhatsApp is the main enquiry handoff | `app/page.tsx:255`, `282-283`, `295`, `302`, `324`, `341`, `366`, `379` | Improve message quality and path clarity before adding a new backend funnel. |
| No online payment is required at the request stage | `app/page.tsx:257-260`, `283` | Do not recommend checkout or deposits collected online. |
| Diagnosis precedes price, timing, and approval | `app/page.tsx:219`, `243-245`, `258-260` | Make this process more explicit and trust-building, not replace it. |
| Business offerings have different stages | `app/page.tsx:336-339` | Keep `Active`, `Active & developing`, `Emerging`, and `Planned` distinctions. |

## Executive Summary

The page is directionally strong for a repair-led local business. The hero leads with repairs, the repair request is a clear destination, the process explains diagnosis before approval, and WhatsApp links are prefilled for the main enquiry categories. The responsive layout and visible address, hours, telephone, map, and WhatsApp contact options create a credible foundation.

The conversion ceiling is operational clarity rather than visual polish. Every meaningful lead eventually becomes a manually handled WhatsApp conversation, but the site does not consistently qualify that conversation, prove the claims that ask customers to trust the workshop, measure which path produced it, or give training and business prospects enough information to self-select. The most important next step is to make the existing handoff more specific and measurable without turning the site into an unconfirmed ecommerce or CRM product.

### Overall assessment

| Area | Assessment | Conversion implication |
| --- | --- | --- |
| Repair-first hierarchy | Strong | The intended lead journey is visible immediately. |
| Repair enquiry path | Good but higher-friction than necessary | A motivated customer can reach WhatsApp, but must complete required fields first. |
| CTA clarity | Mixed | Primary buttons are clear; service cards use one generic label for different destinations. |
| WhatsApp conversion | Present and technically consistent in source | Message context is weak for non-repair enquiries and outcomes are unmeasured. |
| Phones and accessories | Present as enquiry offers | No qualification for model, budget, compatibility, stock, condition, or warranty. |
| Academy funnel | Present but under-specified | Prospects cannot determine fit before starting a manual conversation. |
| Business services | Stage-aware but incomplete | The CTA only explicitly names two of the displayed service states. |
| Trust | Basic local proof exists | High-consideration claims lack supporting evidence, terms, and aftercare detail. |
| Digitization alignment | Good first step, incomplete operating loop | The website digitizes discovery and handoff, not lead continuity or learning. |
| Conversion test coverage | Very limited | The only automated test checks preview metadata and HTTP rendering. |

## Repair-First Hierarchy

**Verdict: directionally correct and should be preserved.**

The page opens with “Expert repairs” (`app/page.tsx:156-167`), exposes “Start a repair” in both the navigation and hero, follows the service overview with a dedicated repair section, explains the three-step process, and places the repair request before phones, accessories, academy, business services, and general contact (`app/page.tsx:190-286`). This matches the stated “Repairs come first” positioning at line 194.

The main hierarchy risk is dilution after the repair request. The hero lead mentions phones, accessories, and training alongside repairs (`160-163`), while the service grid gives five offers similar visual weight (`196-209`). That is acceptable for a multi-service business, but the page should continue to make the intended priority unmistakable:

- Keep “Start a repair” as the only primary hero action.
- Keep phones, accessories, training, and business services as secondary enquiry paths.
- Use category-specific labels instead of “Learn more” where a card opens WhatsApp or jumps to an enquiry section.
- Avoid promoting planned services with the same apparent availability as active services.

## Customer Journeys

| Journey | Current path | What works | Main break or friction |
| --- | --- | --- | --- |
| Repair | Hero/nav CTA -> repair request form -> prefilled WhatsApp message | Clear destination, device and issue selectors, diagnosis-before-approval explanation, no online payment claim | Name and phone are required before the visitor can reach WhatsApp; no visible fallback if the new tab does not open; no measurement of handoff or sent message. |
| Phone purchase | Service card or commerce section -> WhatsApp | Direct human guidance is consistent with availability changing over time | No prompt for desired model, budget, new/used preference, condition, warranty, or timing; “Learn more” hides that the card opens an external chat. |
| Accessories | Service card or commerce section -> WhatsApp | The commerce section names useful accessory categories and gives a direct CTA | No prompt for device model, accessory type, compatibility, quantity, or urgency; no visible stock or compatibility confidence. |
| Training/apprenticeship | Nav/service card -> Academy section -> WhatsApp | Benefits and a direct academy CTA are present | No confirmed duration, schedule, fees, eligibility, cohort availability, location, outcome, or application questions. Prospects must ask basic fit questions manually. |
| Business setup/institutional training | Nav/service card -> Business section -> WhatsApp | Active-stage labels and one project CTA exist | CTA copy only names repair-business setup and institutional training (`341`), while consultancy and equipment importation are also displayed (`336-339`). No project brief or organisation-level qualification. |
| Local visit/call | Contact section -> map, first phone number, hours, or WhatsApp | Address, map link, hours, primary phone, and WhatsApp are visible | A second displayed number is not separately clickable; the primary number is repeated but there is no response-time or service-intake expectation beyond “usually the fastest.” |

## Findings

### P1: The existing WhatsApp funnel is not measurable

**Severity:** High

**Impact:** The site cannot show whether repair, phone, accessory, academy, business, call, or floating WhatsApp actions produce demand. This makes the digitization effort a one-way handoff rather than a learning loop and prevents prioritisation based on real customer behavior.

**Evidence:** The page has multiple WhatsApp and telephone destinations (`app/page.tsx:30-31`, `65`, `72`, `91`, `295`, `302`, `324`, `341`, `366`, `379`), but no event instrumentation was found in the app or package scripts. The test suite only verifies development metadata and a `200` HTML response (`tests/rendered-html.test.mjs:7-32`).

**Safe recommendation:** Add privacy-conscious events for CTA clicks, repair-form start, repair-form completion, outbound WhatsApp handoff by category, map clicks, and phone clicks. Do not send repair descriptions, phone numbers, names, or WhatsApp message content to analytics. Choose the measurement provider and retention policy separately rather than introducing a backend by assumption.

### P1: Repair conversion has unnecessary pre-handoff friction and no recovery path

**Severity:** High

**Impact:** A customer with an urgent fault must provide a name and phone number before reaching the preferred channel (`app/page.tsx:264-265`). A popup blocker, failed WhatsApp launch, or a visitor who prefers to type directly has no visible recovery action in the form. This can lose the highest-intent leads before the workshop sees them.

**Evidence:** `submitRepair` only calls `window.open` after form submission (`app/page.tsx:104-116`); the form has two required inputs and no success, error, or direct-chat alternative (`262-284`).

**Safe recommendation:** Keep the structured repair request as the primary path, but make the alternative explicit: a direct “Chat without the form” or “Call the workshop” option can preserve the WhatsApp-first model. Consider whether name and phone must both be required before handoff; if they are operationally required, explain why beside the fields. Add a visible fallback if WhatsApp cannot open. Do not add online payment or an in-site repair booking promise.

### P1: Trust claims are stronger than the proof provided on the page

**Severity:** High

**Impact:** Repairs, used devices, and training require confidence before a visitor starts a conversation. Claims such as “Expert repairs,” “Professional,” “quality phones,” “Precision diagnostics,” “Since 2020,” and “long-term customer trust” are plausible positioning, but the page supplies no testimonials, before/after examples, warranty or aftercare terms, technician credentials, diagnostic boundaries, or service guarantees (`app/page.tsx:160-163`, `170`, `184-185`, `294`, `347`). Visitors may delay or price-shop instead of enquiring.

**Safe recommendation:** Add only verifiable evidence that the owner approves: real repair examples with device/fault/outcome, customer quotes with permission, workshop photos, training outcomes, and clearly bounded warranty or aftercare terms. Replace unsupported superlatives with specific process proof where evidence is unavailable. Keep “diagnosis first” and “approve price before work” prominent because those are already stated operating expectations (`218-220`, `243-245`, `257-260`).

### P2: Generic “Learn more” labels hide materially different destinations

**Severity:** Medium

**Impact:** All service cards end with “Learn more” (`app/page.tsx:201-206`), even though repairs and training/business cards jump within the page while phone and accessory cards open a new WhatsApp tab (`52-88`, `199-201`). The visitor cannot predict whether they will read information, start a chat, or move down the page. This weakens intent matching and makes the card grid less scannable.

**Safe recommendation:** Use labels that state the next action without changing the destination model: “Start a repair,” “Ask about available phones,” “Ask about accessories,” “View training,” and “View business services.” Keep one dominant repair CTA and make the secondary labels visibly secondary.

### P2: Phone and accessory enquiries are direct but under-qualified

**Severity:** Medium

**Impact:** The commerce CTAs open WhatsApp with only “check the new and used phones currently available” or “ask about an accessory” (`app/page.tsx:295`, `302`). The team must ask basic questions in a back-and-forth conversation, and prospects do not know what information to prepare. This is especially costly where stock, compatibility, and condition vary.

**Safe recommendation:** Keep WhatsApp as the response channel and use category-specific prefilled prompts. For phones, ask for desired model or use case, budget range, new/used preference, and purchase timing. For accessories, ask for device model, accessory category, compatibility need, and quantity. Add stock, condition, warranty, and price information only when it is current and approved; do not imply a catalogue or guaranteed availability.

### P2: The Academy presents benefits but not an actionable qualification funnel

**Severity:** Medium

**Impact:** The academy section communicates a credible philosophy and skills focus (`app/page.tsx:307-324`), but a prospective trainee cannot determine whether the programme fits their schedule, level, budget, or goal without initiating a generic chat. That creates avoidable manual work and lowers enquiry quality.

**Safe recommendation:** Publish a compact set of owner-confirmed facts: who it is for, learning format, approximate duration, schedule or next intake, location, what equipment or supervision is included, and the next decision step. If those facts are not yet fixed, say that availability and terms are confirmed by WhatsApp rather than inventing them. Use a prefilled message that captures experience level, desired start time, location, and learning goal.

### P2: Business-service CTA coverage does not match the displayed service states

**Severity:** Medium

**Impact:** The section displays repair-business setup, institutional training, business consultancy, and equipment importation with four different statuses (`app/page.tsx:329-341`). The only prompt asks whether the visitor is planning a repair business or institutional training (`341`), leaving emerging consultancy and planned equipment interest without a clearly intended next step. “Discuss your project” can also sound like all four are immediately deliverable.

**Safe recommendation:** Preserve the status labels. Make the CTA explicitly cover “active service enquiry” and, if desired by the owner, “register interest in an emerging or planned service.” The prefilled WhatsApp prompt should ask organisation type, project stage, location, desired outcome, and timeframe. Do not present planned equipment importation as available or create a promise of delivery.

### P2: Contact information is internally inconsistent

**Severity:** Medium

**Impact:** The contact card presents two telephone numbers as one linked block (`app/page.tsx:363`), but the link only uses `PHONE_NUMBER`, which contains the first number (`30-31`). The announcement and footer also expose only the first number (`124`, `374`). A visitor trying the second number on a mobile device must copy it manually or may assume it is not active.

**Safe recommendation:** If both numbers are current and intended for enquiries, make each a separate labelled `tel:` action and state the preferred line or purpose. If the second number is not customer-facing, remove it from the displayed contact copy. Keep the WhatsApp number and phone numbers visibly consistent after the owner confirms the canonical contact details.

### P3: The generic enquiry CTA loses category context

**Severity:** Low to Medium

**Impact:** The contact CTA and floating action both send “I would like to make an enquiry” (`app/page.tsx:366`, `379`). This is useful as a catch-all, but the recipient must classify the lead manually and the visitor receives no expectation about what to include. It also makes the floating CTA less useful for visitors who are already reading a specific section.

**Safe recommendation:** Keep the floating catch-all action, but improve its visible label and message guidance: “Chat about a repair, phone, accessory, training, or business service.” Where a section already establishes intent, use a category-specific WhatsApp message instead of the generic message.

### P3: Product strategy is not preserved in the repository guidance

**Severity:** Low to Medium

**Impact:** The app has product-specific positioning, but `README.md` still identifies the repository as `vinext-starter` and describes mostly platform mechanics (`README.md:1-5`, `14-20`). A future contributor could unintentionally change the repair-first order, WhatsApp handoff, no-online-payment boundary, or service-stage labels because these decisions are not documented outside the page.

**Safe recommendation:** In a separate documentation change, add a concise product operating note covering the lead offer, enquiry channel, diagnosis/approval sequence, contact source of truth, and active/developing/emerging/planned service states. This audit does not modify the existing README.

### P3: Automated tests do not protect the conversion contract

**Severity:** Low to Medium

**Impact:** `npm test` builds the app and checks only that the worker returns HTML containing the development-preview metadata (`package.json:13`, `tests/rendered-html.test.mjs:7-32`). It would not catch a broken repair anchor, changed WhatsApp number, missing category message, missing contact link, CTA destination mismatch, or regression in the visible repair-first copy.

**Safe recommendation:** Add lightweight static or rendered checks for the conversion contract: primary repair CTA and target, canonical WhatsApp number, category-specific message fragments, both customer-facing phone numbers, address/hours, service-status labels, and required repair fields. Add browser-level checks only if the project’s test environment can support them. The current scripts are Linux-oriented and explicitly require GNU `timeout`/`flock` (`README.md:7`, `18`), so CI should be the authoritative execution environment.

## What Is Working

- The hero headline and primary CTA immediately identify repairs as the core offer (`app/page.tsx:156-167`).
- The repair process reduces uncertainty by explaining diagnosis, price approval, deposit, and timing (`app/page.tsx:236-246`).
- The repair form collects device type and issue type, and the generated WhatsApp message carries those values forward (`app/page.tsx:96-116`, `268-283`).
- WhatsApp links are centralised through `whatsappHref`, reducing the risk of different numbers across most enquiry paths (`app/page.tsx:30`, `90-91`).
- The page gives local visitors an address, map, hours, telephone, and WhatsApp action (`app/page.tsx:354-366`).
- The responsive layout moves the main grids to one column at mobile breakpoints and keeps buttons full width (`app/globals.css:240-309`).
- The mobile menu has a button, accessible label, and `aria-expanded` state (`app/page.tsx:144-152`).
- The business section communicates service maturity instead of presenting every idea as immediately available (`app/page.tsx:335-341`).

## Prioritised Repair Sequence

### P0: Clarify the current funnel without changing the business model

1. Replace generic service-card labels with destination-specific CTA copy.
2. Make the direct repair-to-WhatsApp alternative and phone fallback visible.
3. Align the business CTA with active services and preserve stage labels for emerging/planned services.
4. Resolve the canonical phone-number presentation and link behavior.

### P1: Improve enquiry quality and trust

1. Use category-specific WhatsApp prompts for repairs, phones, accessories, academy, and business services.
2. Add only owner-approved training facts and verifiable repair evidence.
3. State what happens after a WhatsApp enquiry, including the expected human response or diagnosis step, if the workshop can commit to one.

### P2: Establish the digitization learning loop

1. Track anonymous CTA and handoff events by category without collecting message content or PII.
2. Add conversion-contract tests for links, labels, messages, and contact details.
3. Review enquiry volume and quality before deciding whether a site-owned enquiry log, CRM, inventory catalogue, or training application system is warranted.

## Digitization Strategy Alignment

The current implementation is a sensible first digitization layer: it makes the business discoverable, presents the repair workflow, centralises WhatsApp entry points, exposes local contact details, and avoids forcing an online payment model that is not confirmed (`app/page.tsx:255-260`). The responsive identity work in commits `061243b` and `53b8e8c` improves consistency and mobile presentation without changing that operating model.

It is not yet a complete digital operating loop. The site does not retain enquiries, identify source or service category after handoff, expose current inventory or training availability, or provide evidence that the workshop has responded. The database is intentionally empty (`db/schema.ts:1-4`) and D1 is not configured (`.openai/hosting.json:1-5`), so adding persistence is a product and operations decision, not an audit assumption. The safe sequence is to improve the current WhatsApp workflow and measure demand first, then add system complexity only when the manual process demonstrates a clear bottleneck.

## Verification Status and Remaining Risks

**Tests not run:** `npm test`, `npm run lint`, browser checks, live WhatsApp link checks, map checks, and production deployment checks were not run. This audit was intentionally source-only; the repository also documents Linux/GNU utility requirements for its install and build helpers (`README.md:7`, `18`).

**Remaining risks:**

- The owner has not yet confirmed which proof assets, warranty terms, training facts, response expectation, phone number, or service availability can be published.
- A syntactically valid `wa.me` URL does not prove that the number is active, monitored, or able to respond within the implied customer journey.
- `window.open` behavior and mobile browser handling were not verified in a real device.
- No conclusion is made about visual accessibility, contrast, or layout at every viewport without browser rendering and assistive-technology checks.
- No conversion rate, enquiry volume, response time, or service profitability data was available, so prioritisation is based on journey risk rather than measured funnel performance.
- The audit does not recommend exposing inventory, prices, payment, or planned services until those business decisions and operating capabilities are confirmed.
