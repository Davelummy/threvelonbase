# Threvelonbase Visual Accessibility Audit

## Baseline and Scope

- Repository: Threvelonbase
- Audited commit: `53b8e8cb20120a8e7e3710ee5371dd870221d5d3`
- Branch: `audit/visual-accessibility`
- Review type: read-only source audit of the application, CSS, assets, tests, and configuration
- Responsive range considered: 320px through desktop
- Standards used as practical references: WCAG 2.2 AA, semantic HTML, keyboard access, and common mobile usability guidance

The user-facing surface is a single page in `app/page.tsx`. The other TypeScript files are hosting, authentication, database, or example API code and have no additional rendered UI. The review was performed from source; no browser rendering, screenshot comparison, keyboard session, screen-reader session, or automated accessibility scan was available.

## Executive Summary

The approved identity is applied consistently: the navy/orange palette is centralized in CSS variables, the packaged Fraunces and Manrope fonts are used, the header and footer use the supplied TB marks, and the favicon matches the mark. The page has a sensible heading sequence, meaningful hero image alternative text, native form controls, a labeled primary navigation, and a reduced-motion rule.

The main release risks are:

- High: several text and interactive-state color combinations do not meet normal-text contrast targets.
- High: the form removes the native focus outline and replaces it with an orange indicator that is too low-contrast against white.
- Medium: the mobile navigation is a visual disclosure but lacks a programmatic control relationship and Escape/focus behavior.
- Medium: the long page has no skip link, and the form gives no visual required-field cue or autocomplete hints.
- Medium: the test suite does not exercise UI structure, responsive layout, keyboard behavior, or accessibility.

## Findings

### VA-01 - High - WhatsApp contact CTA text contrast is insufficient

- Location: `app/globals.css:208-213`
- Evidence: `.contact-whatsapp` uses `background: #1f9c59` with white text. The calculated contrast for `#ffffff` on `#1f9c59` is approximately `3.52:1`, below the `4.5:1` target for the 11px and 13px text used in this component. The subtitle is additionally reduced to `rgba(255,255,255,.72)`, so its effective contrast is lower still.
- Impact: The prominent contact action and its supporting explanation can be difficult to read for users with low vision, especially on mobile.
- Minimal recommendation: retain green as the WhatsApp cue, but use a darker green or the approved navy as the container color, and recheck both the white heading and muted subtitle against their actual background. Keep the green icon/accent treatment where it remains decorative or passes non-text contrast.

### VA-02 - High - Orange text is used as readable text on light surfaces below contrast targets

- Locations: `app/globals.css:38`, `app/globals.css:94`, `app/globals.css:98`, `app/globals.css:160`
- Evidence: `--orange-dark: #d95f00` is approximately `3.76:1` against white, while `--orange: #ff7a00` is approximately `2.61:1` against white. These colors are used for the 8px brand tagline, 11px service numbers, 12px card links, and the 10px academy kicker. The actual card/background colors are similarly light. The 8px to 12px text sizes fall under the small-text threshold.
- Impact: Important labels and action affordances lose legibility, and the small brand tagline is particularly fragile.
- Minimal recommendation: preserve orange for rules, icons, fills, and other non-text accents. For readable text, use a darker navy-compatible orange value that passes on the specific light surface, or use navy for the label and retain orange as the adjacent accent line.

### VA-03 - High - Hover states can reduce button text contrast

- Locations: `app/globals.css:43-44`, `app/globals.css:57-58`
- Evidence: `.nav-cta` and `.button-primary` keep navy text when their background changes to `--orange-dark`. `#0b2d5b` on `#d95f00` is approximately `3.63:1`, below the normal-text target.
- Impact: Keyboard users who reach a control with a hover-capable pointer, and users relying on hover feedback, can see a less readable state at the exact point of interaction.
- Minimal recommendation: pair the hover background with white text, or choose a hover shade that preserves the existing navy text contrast. Keep the approved orange-to-navy relationship in the default state.

### VA-04 - High - Form focus indicator is removed and replaced with a low-contrast orange border

- Locations: `app/globals.css:137-138`
- Evidence: Inputs, selects, and the textarea set `outline: none`. Their only explicit focus treatment is an orange border plus a translucent orange box shadow. Solid `#ff7a00` against the white field is approximately `2.61:1`, and the translucent shadow does not provide a stronger reliable indicator. Links and buttons have no explicit `:focus-visible` treatment of their own.
- Impact: Keyboard users can lose track of the active field or control, particularly on the white form card and against the page's low-texture backgrounds.
- Minimal recommendation: add one consistent, high-contrast `:focus-visible` ring for all links, buttons, and form controls, using navy or another identity-compatible color with sufficient contrast and an offset that does not change layout. Keep the orange border as a secondary brand cue rather than the only focus signal.

### VA-05 - Medium - Mobile navigation disclosure lacks a complete keyboard and assistive-technology contract

- Locations: `app/page.tsx:135-152`, `app/globals.css:245-248`
- Evidence: The menu button correctly exposes an accessible label and `aria-expanded`, and the hidden menu uses `display: none`. The button has no `aria-controls` pointing to a navigation ID. There is no Escape-key handler, outside-click behavior, or explicit focus return after closing. The menu closes when one of its links is clicked.
- Impact: Screen-reader users do not get an explicit button-to-menu relationship, and keyboard users must rely on the current tab sequence to manage an opened overlay. An opened menu can remain visible after focus has moved elsewhere.
- Minimal recommendation: give the navigation an ID and connect it with `aria-controls`; close on Escape and return focus to the menu button. Keep the existing simple disclosure rather than introducing a modal focus trap unless the menu becomes more complex.

### VA-06 - Medium - Long-page keyboard navigation has no skip link

- Location: `app/page.tsx:120-154`
- Evidence: The page enters the announcement bar, header wordmark, navigation links, and CTA before reaching the hero content. There is no visually-hidden-on-focus link to skip directly to the main content.
- Impact: Keyboard and switch users must repeatedly traverse the site chrome before reaching the page content, especially after returning to the page or refreshing at the top.
- Minimal recommendation: add a first-focusable skip link targeting the existing `<main>` or the hero section. Style it with the same visible focus treatment and leave the current layout unchanged for pointer users.

### VA-07 - Medium - Repair form affordances are semantically usable but not optimized for completion

- Locations: `app/page.tsx:262-283`
- Evidence: Nested labels and `required` attributes provide valid native associations and required-state semantics. However, the name and phone fields have no `autocomplete` values, the phone field is a text input with `inputMode="tel"` rather than `type="tel"`, and there is no visible required cue for the two required fields. Submission opens WhatsApp with `window.open` and provides no in-page success, failure, or popup-blocked status.
- Impact: Autofill and mobile form completion are less reliable, and users may not know which fields are required until native validation interrupts them. Users who do not get a new tab may not know whether the action succeeded.
- Minimal recommendation: add `name`/`autocomplete` metadata and `type="tel"`, add a concise visible required hint, and provide a small status message for blocked or failed handoff without changing the WhatsApp flow. Preserve native validation rather than replacing it with a custom form system.

### VA-08 - Medium - Responsive layout is thoughtfully stacked but has unverified breakpoint risks

- Locations: `app/globals.css:23-24`, `app/globals.css:231-265`, `app/globals.css:267-309`
- Evidence: At the narrow breakpoint, the shell leaves 17px side gutters, buttons become full width, two-column fields and cards stack, process cards become one column, and the form controls retain a 56px button height. At 320px this is a reasonable structural approach. The full navigation remains active above 820px while the shell is still as narrow as `calc(100% - 48px)`, so the 821px transition is a likely squeeze point for the wordmark plus all navigation labels. The fixed WhatsApp control is also positioned over page content at all widths (`app/globals.css:226-227`).
- Impact: Without browser validation, the 821px header and small-screen fixed action could still produce wrapping, overlap, or content obstruction in specific font/rendering environments.
- Minimal recommendation: verify at 320, 360, 414, 768, 820, 821, 900, 1024, 1280, and 1440px with text zoom. If the 821px header wraps, move the mobile breakpoint slightly upward or reduce only the nav gap. Add bottom safe-area-aware spacing to the fixed WhatsApp control if it obscures form content on devices with gesture insets.

### VA-09 - Low - New-tab destinations are not disclosed in the link names

- Locations: `app/page.tsx:201`, `app/page.tsx:295`, `app/page.tsx:302`, `app/page.tsx:324`, `app/page.tsx:341`, `app/page.tsx:362`, `app/page.tsx:366`, `app/page.tsx:374`, `app/page.tsx:379`
- Evidence: Several WhatsApp, map, Instagram, and other external actions use `target="_blank"`. The visible labels are generally descriptive, and the floating WhatsApp link has an accessible label, but the new-tab behavior is not announced in the link text or accessible name.
- Impact: Screen-reader and keyboard users may be surprised when an action changes browsing context.
- Minimal recommendation: append a short visually-hidden “opens in a new tab” hint to external destinations, or avoid a new tab where the flow does not require it. Retain the current visible copy and external service destinations.

## Positive Checks

- Logo use is consistent with the approved identity. The header uses `public/brand/tb-mark.svg`, the footer uses `public/brand/tb-mark-reversed.svg`, and `app/layout.tsx:13-16` points the favicon to the matching `public/favicon.svg`.
- The logo images are correctly treated as decorative inside links that also contain the visible `THREVELONBASE` wordmark (`app/page.tsx:130-133`, `app/page.tsx:372`).
- The hero image has explicit dimensions, `fetchPriority="high"`, and a useful alternative text (`app/page.tsx:177-183`).
- The primary content has one `h1`, followed by `h2` section headings and `h3` card/process headings without an obvious skipped heading level (`app/page.tsx:160`, `app/page.tsx:193-376`).
- Native buttons, links, selects, inputs, and textarea are used instead of click handlers on generic elements. The menu button exposes its current state (`app/page.tsx:144-152`).
- The page declares `lang="en"` (`app/layout.tsx:24`) and provides a labeled primary navigation (`app/page.tsx:135`).
- Typography has a clear display/body pairing, with packaged Fraunces for large headings and Manrope for body and interface text (`app/layout.tsx:1-4`, `app/globals.css:19`, `app/globals.css:52`, `app/globals.css:85`). The section rhythm and shell spacing are consistent in the source, subject to the unrun browser checks below.
- The reduced-motion rule disables smooth scrolling and reduces animation and transition durations (`app/globals.css:311-314`). This covers the reveal animations, image hover transform, card hover transform, and button transitions.
- The narrow CSS breakpoint avoids horizontal multi-column grids and makes primary actions full width. The form's native controls and the 56px submit button are appropriate starting points for touch use (`app/globals.css:267-309`).

## Tests and Configuration Reviewed

- `tests/rendered-html.test.mjs:7-33` checks only that the built worker returns HTML and includes development-preview metadata. It does not assert headings, landmark names, image alternatives, labels, focus styles, link names, or responsive behavior.
- `package.json:13-16` defines build plus one rendered-HTML test and a lint command. No axe, Lighthouse, Playwright, visual snapshot, or viewport-matrix test is configured.
- `eslint.config.mjs:1-16` enables Next core-web-vitals and TypeScript presets. No dedicated JSX accessibility rule set is configured in the repository.
- The supplied image asset is a non-transparent 1448x1086 PNG (`public/images/threvelonbase-repair-hero.png`). The CSS applies `object-fit: cover` at changing aspect ratios, so the subject should be checked visually at narrow widths even though the image has a useful alternative text.
- Starter assets `public/window.svg`, `public/globe.svg`, and `public/file.svg` are not referenced by the rendered application and do not affect this page's visible identity.

## Tests Not Run

- `npm test` was not run.
- `npm run lint` was not run.
- `npm run build` and `npm run validate:artifact` were not run.
- Browser viewport checks, keyboard-only checks, screen-reader checks, and automated axe/Lighthouse checks were not run.

The worktree did not contain installed `eslint` or `vinext` binaries, and Chromium/Playwright were unavailable. The repository README also states that its install/build helpers target Linux, while this audit environment is macOS. No application or configuration file was changed as part of the audit.

## Remaining Risks

- Actual text wrapping, image crop, fixed-button overlap, sticky-header behavior, and intermediate-width overflow remain unverified until rendered in a browser.
- Contrast over the photographic hero image and academy gradients needs pixel-level inspection; source colors alone cannot validate every background location.
- Native focus rendering differs by browser and operating system, especially in forced-colors/high-contrast modes and at 200% to 400% text zoom.
- The WhatsApp handoff depends on browser popup policy, installed WhatsApp behavior, and the destination service; those outcomes are not covered by the current test.
- The audit does not establish full WCAG conformance. It identifies source-level risks and confirmed color-ratio failures that should be addressed before a final conformance pass.
