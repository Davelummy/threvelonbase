# Phase 2 Implementation Plan

**Baseline:** `53b8e8cb20120a8e7e3710ee5371dd870221d5d`

**Goal:** Move the Threvelonbase homepage from a polished prototype to a launch-ready, repair-first MVP without inventing business evidence or adding unconfigured persistence.

## Guardrails

- Keep Threvelonbase as the public name and retain the approved TB identity, Fraunces/Manrope typography, and navy/orange system.
- Keep electronics repairs as the primary offer and WhatsApp as the main enquiry handoff.
- Use the existing business contact, address, hours, service stages, and claims as the current source of truth; do not strengthen them into reviews, guarantees, certifications, prices, inventory, or partnerships.
- Keep D1 and R2 null in `.openai/hosting.json`; do not add a repair tracker runtime or any feature that implies durable storage.
- Preserve Vinext, Cloudflare Worker, ChatGPT Sites, and the existing Linux-oriented build lifecycle.
- Prefer small, typed, dependency-free changes with tests around the customer journey.

## Priority Matrix

| Priority | Work | Customer impact | Business value | Effort | Risk/dependency |
| --- | --- | --- | --- | --- | --- |
| P0 | Split the monolithic page into maintainable layout, section, form, brand, data, and WhatsApp modules | High | High | Medium | Must preserve current markup and CSS contracts |
| P0 | Improve repair enquiry qualification, validation, WhatsApp formatting, and failed-handoff recovery | High | High | Medium | No backend or upload feature; browser behavior needs verification |
| P0 | Add keyboard focus, skip navigation, accessible mobile disclosure, contrast-safe states, and reduced-motion safeguards | High | High | Low-Medium | Rendered browser checks remain required |
| P1 | Give phone, accessory, academy, and business paths differentiated prompts and labels | Medium-High | High | Low-Medium | Availability and training terms remain enquiry-only |
| P1 | Add accurate metadata, social tags, sitemap, robots, and LocalBusiness JSON-LD from typed business data | Medium | High | Medium | Public origin and Maps/asset provenance must not be guessed |
| P1 | Add rendered HTML, WhatsApp, form, navigation, and metadata contract tests | High | Medium | Medium | Browser automation is optional and may remain unavailable locally |
| P1 | Rewrite README and document a non-production repair-tracker architecture | Medium | Medium | Low | Tracker remains design-only until storage/access are approved |
| P2 | Optimize the existing hero asset and add responsive variants | Medium | Medium | Medium | Requires confirming image provenance and image-pipeline compatibility |
| P2 | Add privacy-conscious analytics events | Medium | Medium | Medium | Provider, consent, retention, and deployment policy are not yet specified |
| P2 | Add authentic proof, policies, FAQs, and service-specific pages | High | High | Medium-High | Requires founder-supplied evidence and approved policy text |

## Execution Waves

### Wave 0: Architecture checkpoint

1. Extract verified business/contact values into `app/data/business.ts`.
2. Extract reusable copy, service stages, navigation, repair options, and enquiry prompts into `app/data/content.ts`.
3. Extract WhatsApp URL and message construction into `lib/whatsapp.ts`.
4. Move the menu and repair form into client components; keep the page responsible for composition.
5. Preserve the visual output and run lint/build/test before parallel implementation.

### Wave 1: Parallel implementation

- **Visual/accessibility:** own layout, sections, brand components, and global CSS. Fix responsive behavior, focus states, contrast, mobile disclosure, touch targets, and reduced motion without redesigning the approved identity.
- **Repair/enquiries:** own forms and WhatsApp utility. Add structured repair fields, bounded validation, differentiated enquiry messages, accessible status/fallback behavior, and tests for the utility/form contract.
- **SEO/credibility:** own layout metadata, sitemap, robots, typed data/copy, and structured data. Use only the current verified source values and leave the public origin configurable rather than guessing.
- **Testing/documentation:** own tests and documentation. Expand rendered HTML assertions, rewrite the README, and describe a design-only repair tracker with no production storage.

### Wave 2: Integration and verification

1. Review each branch diff against ownership and the confirmed business constraints.
2. Integrate only compatible commits and resolve conflicts in the lead-owned page composition deliberately.
3. Run `npm run lint` and `npm test` in the supported environment. `npm test` already performs the verified build.
4. Check rendered HTML and important interactions, then inspect 375x812, 768x1024, and 1440x900 when browser tooling is available.
5. Record any unverifiable contact, map, image, policy, credential, or deployment items as blockers rather than public claims.

## Definition Of Done

- The first screen identifies electronics repair and keeps repair as the strongest CTA.
- The page has no horizontal overflow at 320px and remains usable through large desktop.
- Keyboard users receive visible focus, skip navigation, and a manageable mobile menu.
- Repair and non-repair WhatsApp messages are readable, differentiated, bounded, and tested.
- Metadata, sitemap, robots, structured data, contact details, and hours use one typed source of truth.
- No unsupported reviews, prices, warranties, certifications, inventory, partnerships, or active equipment importation claims are added.
- D1/R2 remain unconfigured and the repair tracker remains documentation-only.
- Lint, tests, build validation, and available visual/interaction checks pass.
