# Foundation Hardening Baseline

**Phase:** 0 — evidence freeze and acceptance gates
**Recorded:** 13 August 2026
**Scope:** repository and public-site foundation only; this document does not authorize product-code changes, deployment, full digitization, analytics activation, or unverified trust claims.

## Repository baseline

- Worktree: `/Users/davidolumide/Desktop/Downloads/threvelonbase-foundation-hardening`
- Branch: `agent/foundation-hardening`
- Working tree at baseline: clean
- `HEAD`: `a5eec66c91da4aba24622f7e63d75a8957d95f64`
- `origin/main`: `a5eec66c91da4aba24622f7e63d75a8957d95f64`
- Divergence from `origin/main`: 0 ahead, 0 behind

All later comparisons must use this commit as the before-state. A clean baseline does not prove production quality; it only proves that the source snapshot is reproducible and unmodified at the start of hardening.

## Required verification matrix

Unless a narrower criterion is stated for a non-visual check, regression verification must cover all six required viewport/theme combinations:

| Class | Viewport | Themes |
| --- | --- | --- |
| Mobile | 375 × 812 | light and dark |
| Tablet | 768 × 1024 | light and dark |
| Desktop | 1440 × 900 | light and dark |

The 1280 × 720 observation is not part of this required matrix. It remains a separate reproduction-only observation documented below.

## Evidence classification

### Confirmed defects

#### Production dependency vulnerabilities

`npm audit --omit=dev` reported three high-severity production dependency packages:

- direct: `next`
- transitive: `postcss`
- transitive: `sharp`

This is a confirmed dependency-maintenance defect. Advisory applicability may vary with the features in use, but that does not reclassify known vulnerable production packages as safe.

**Acceptance criteria**

- Upgrade to supported patched versions without suppressing advisories.
- `npm audit --omit=dev` reports zero high- or critical-severity findings.
- The lockfile resolves the intended patched versions.
- Lint, type-check, production build, contract tests, and Playwright tests all pass after the upgrade.
- No change is deployed until the diff and release evidence are reviewed.

#### HTTP security-header gaps

The production response was captured with:

```sh
curl -sSI https://threvelonbase.netlify.app/
```

Recorded relevant output:

```text
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
x-powered-by: Next.js
```

No `content-security-policy`, `x-frame-options`, `referrer-policy`, or `permissions-policy` field appeared in the captured response. Header absence is based on that completed production request, not on an assumption from repository configuration.

The production response therefore currently includes:

- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`

The inspected response did not include:

- Content Security Policy, including an anti-framing `frame-ancestors` directive
- `Referrer-Policy`
- `Permissions-Policy`

It also exposes `X-Powered-By: Next.js`.

This is a confirmed hardening gap, not evidence of a current compromise. Existing HSTS and `nosniff` protections must be retained.

**Acceptance criteria**

- Production responses retain HSTS and `nosniff`.
- Production responses no longer expose `X-Powered-By`.
- A tested CSP is present and permits only the resources the current site actually needs; framing is denied through `frame-ancestors` unless a documented requirement says otherwise.
- `Referrer-Policy` and a least-privilege `Permissions-Policy` are present.
- The homepage, privacy page, theme bootstrap, structured data, local images, WhatsApp links, Instagram links, and existing lazy-loaded map continue to work without browser console CSP violations.
- Verification is performed against the deployed response, not inferred only from configuration source.

#### Accessible-name and visible-label mismatches

Existing local production artifacts served at `http://127.0.0.1:4174` were inspected in Chromium using browser-computed accessibility names paired with rendered visible text. The captured footer results were:

| Link | Rendered visible text | Browser-computed accessible name |
| --- | --- | --- |
| Full workshop address | `Shop 12A, Cash Hold Shopping Complex, Arakale Road, Akure, Ondo State` | `Open workshop location in Maps (opens in a new tab)` |
| Map action | `Open in Maps` | `Open workshop location in Maps (opens in a new tab)` |
| Compact map pin | `Shop 12A · Arakale Road` | `Open workshop location in Maps (opens in a new tab)` |

The capture method used Chromium's accessibility representation for the computed name and the rendered link text for the visible label; it did not infer the result only from `aria-label` source text. Source inspection additionally identifies the same overriding-label pattern on Instagram and the homepage workshop-location link, but the three rows above are the browser-confirmed mismatch set preserved by Phase 0.

This is a confirmed WCAG 2.5.3 Label in Name defect. It does not justify removing labels from icon-only controls.

**Acceptance criteria**

- Every visible-text control has a computed accessible name containing its visible label in the same order, preferably starting with it.
- Visible-text links use native text naming unless an additional ARIA name is demonstrably necessary.
- Icon-only controls retain concise accessible names.
- New-tab guidance, when present, supplements rather than replaces the visible label.
- Runtime accessibility assertions cover the affected Maps, Instagram, WhatsApp, and address links.
- Automated checks and keyboard/screen-reader spot checks pass at the supported viewport set.

#### Essential content is hidden when client JavaScript fails

Source inspection confirms that essential server-rendered content is assigned `.gs-hidden { opacity: 0; }` and becomes visible when client-side GSAP callbacks remove that class. The `@media (scripting: none)` fallback only covers scripting being disabled; it does not cover scripting being enabled while client JavaScript fails to load or run.

The failure path was reproduced against existing local production artifacts served at `http://127.0.0.1:4174` in Chromium with scripting enabled while the browser route `**/*.js` was aborted. This blocked **all client JavaScript requests**, not an isolated GSAP or animation-chunk request. Computed-style capture used the equivalent of:

```js
[...document.querySelectorAll(".gs-hidden")].map((element) => ({
  selector: element.getAttribute("data-gs"),
  opacity: getComputedStyle(element).opacity,
}));
```

Recorded result: sampled essential `.gs-hidden` content, including hero, section, repair-request, and contact content, remained at computed `opacity: "0"`. No unrecorded element count or timing value is asserted here. This confirms that essential content remains hidden when client JavaScript requests fail while scripting is enabled. It does not isolate GSAP as the failed dependency, and it is distinct from the existing `@media (scripting: none)` and reduced-motion fallbacks.

Reduced-motion support already exists in both JavaScript and CSS. It must be preserved and should not be reported as absent. The reproduced defect is the client-JavaScript failure path. Separately, source inspection confirms reversal behavior that can hide previously revealed content.

**Acceptance criteria**

- Essential headings, navigation, repair form, contact information, service content, FAQ content, and calls to action render visible by default.
- Blocking all client JavaScript requests, as in the Phase 0 reproduction, does not hide essential content.
- JavaScript-disabled rendering remains readable and operable.
- `prefers-reduced-motion: reduce` produces visible content without non-essential translation, scale, marquee, or entrance motion.
- A reduced-motion preference change while the page is open is handled without stale hidden or transformed state.
- Scrolling down and back up does not make previously revealed essential content disappear.
- Animation cleanup is scoped to animations owned by the component and does not kill unrelated triggers globally.
- Playwright covers normal motion, reduced motion, JavaScript disabled, client-JavaScript request failure, and scroll-return visibility.

#### Non-responsive image delivery

The current Next.js configuration globally sets images to `unoptimized`. Rendered image behavior therefore does not provide the responsive `srcset` selection expected from the Next.js image optimizer. This is confirmed from source and rendered behavior; it is independent of the disputed Lighthouse score.

Source evidence:

```ts
images: {
  unoptimized: true,
  formats: ["image/webp", "image/avif"],
}
```

Chromium capture against existing local production artifacts served at `http://127.0.0.1:4174` inspected each content image's `currentSrc`, `srcset`, and `sizes` using the equivalent of:

```js
[...document.images].map(({ currentSrc, srcset, sizes }) => ({
  currentSrc,
  srcset,
  sizes,
}));
```

Recorded behavior: the current image files were served directly and responsive `srcset` was empty, even where a `sizes` attribute was present. The affected content-image paths preserved by source/rendered inspection are:

- `/images/threvelonbase-repair-hero.webp`
- `/images/threvelonbase-repair-featured.webp`
- `/images/threvelonbase-devices-wall.webp`
- `/images/threvelonbase-accessories-wall.webp`
- `/images/threvelonbase-academy-hands-on.webp`

This proves the current delivery behavior. It does not by itself quantify an LCP saving.

**Acceptance criteria**

- Content images have appropriate intrinsic dimensions and responsive candidates or an explicitly documented, measured exception.
- Responsive images expose correct `srcset` and `sizes` behavior at mobile, tablet, and desktop widths.
- The hero/LCP image has an intentional loading and fetch-priority strategy; below-the-fold images remain lazy where appropriate.
- Image changes preserve crop, aspect ratio, alt-text behavior, light/dark presentation, and no-horizontal-overflow guarantees.
- Before/after transfer size and LCP evidence are captured using the same reproducible measurement profile.

### Inconclusive evidence

#### Performance score and root cause

The initial audit's single-run Lighthouse results were environment-sensitive. Repeated Phase 0 median runs and a complete trace/root-cause analysis have not been produced. The current evidence is therefore insufficient to publish a stable performance rating or attribute the result conclusively to GSAP, images, hosting, the test machine, or any single bundle.

Performance remains acceptance-gated because the known responsive-image defect and animation architecture warrant measurement, but the prior numeric score must not be presented as a confirmed field result.

**Phase status: BLOCKED.** No performance-motivated product-code change is permitted until a version-controlled measurement profile is added to the repository and reviewed. That future profile must freeze all of the following before the first before-measurement is taken:

- exact route under test;
- exact Chrome version;
- exact Lighthouse version;
- complete invocation and configuration, including every non-default flag or config file;
- mobile viewport and throttling settings;
- desktop viewport and throttling settings;
- whether each profile uses cold cache, warm cache, or both, and the exact reset/warm-up procedure;
- run mode, including local artifacts or deployed production and headless or headed execution;
- the same named test machine and materially equivalent background-load conditions for before/after comparisons; and
- three equivalent runs per profile with the median used for comparison while retaining all individual results.

No current browser version, Lighthouse version, throttling value, cache procedure, or invocation is asserted because Phase 0 did not preserve them. The profile must record future real values rather than retroactively reconstructing them.

Phase 0 does preserve static bundle-size evidence from the existing `.next` artifacts. These completed commands produced:

```sh
find .next/static/chunks -type f -name '*.js' -print0 | xargs -0 wc -c | tail -n 1
#   788399 total

rg -l "ScrollTrigger" .next/static/chunks -g '*.js'
# .next/static/chunks/14jsy1~r9n3mr.js

wc -c .next/static/chunks/14jsy1~r9n3mr.js
#   120993 .next/static/chunks/14jsy1~r9n3mr.js

gzip -c .next/static/chunks/14jsy1~r9n3mr.js | wc -c
#    45990
```

Therefore the preserved artifact set contains 788,399 raw JavaScript bytes in total, and the chunk containing `ScrollTrigger` is 120,993 raw bytes and 45,990 bytes under the recorded gzip command. These are confirmed artifact facts, not proof that GSAP alone caused a particular runtime score or main-thread duration.

**Incomplete measurement record**

- No complete same-profile multi-run median is recorded in this worktree.
- No accepted trace breakdown identifying the dominant main-thread tasks is recorded.
- No production field-data sample is available.
- No independent normal-device reproduction is complete.
- The Phase 0 build command, exit status, and build log were not preserved. The presence of `.next` artifacts is not evidence of a clean Phase 0 build, so the build result remains **inconclusive** rather than passed or failed.

**Acceptance criteria before making a performance claim**

- Record at least three equivalent production runs for the agreed mobile profile and at least three equivalent production runs for the agreed desktop profile, holding browser version, viewport, throttling, cache state, and test route constant within each comparison.
- Report mobile and desktop medians, individual runs, benchmark/environment information, and material variance; do not report only the best run.
- Preserve trace evidence sufficient to attribute dominant main-thread work, including long tasks, JavaScript execution, forced layout, LCP element/discovery, and resource waterfalls.
- Compare the hardened build to its before-state under the same profiles and demonstrate reduced transferred bytes for the resources changed by the optimization.
- Demonstrate no regression in median LCP or CLS in either profile.
- Numeric scores and absolute performance thresholds are **TBD** because none were frozen in the approved plan; do not invent them retroactively.
- Do not call performance fixed until the approved median comparison passes, the trace explains the material main-thread work, transfer is reduced, and no required visual or functional regression is introduced.

### Reproduction-only observations

#### Floating WhatsApp safe-area behavior

The header uses a top safe-area inset, while the floating WhatsApp positioning does not currently establish an equivalent bottom inset in the inspected CSS. No device-level overlap has yet been reproduced. This remains a conditional risk, not a confirmed defect.

**Acceptance criteria**

- Reproduce on a device or emulator with a non-zero bottom safe-area inset and at supported mobile orientations.
- If overlap or insufficient spacing is observed, position the control using `env(safe-area-inset-bottom, 0px)` plus the approved visual offset.
- Confirm that default, dragged, resized, orientation-changed, keyboard-open, and reload states remain inside the usable viewport and do not obstruct the repair form's primary action.
- If no failure is reproducible, document the evidence and do not add speculative complexity.

#### 1280 × 720 hero fold

The earlier observation that the hero call to action extends slightly below a 1280 × 720 first viewport has not been established as a cross-browser or product requirement failure. It remains reproduction-only.

No 1280 × 720 layout change is permitted unless the owner first records both the target browser and an explicit first-fold requirement. The required regression matrix remains 375 × 812, 768 × 1024, and 1440 × 900 in light and dark themes.

**Acceptance criteria**

- Obtain the owner's recorded target browser and explicit first-fold requirement before reproduction can authorize a change.
- Reproduce at exactly 1280 × 720 with that recorded browser, default zoom, fresh navigation, loaded fonts, and both themes.
- Compare against the approved first-fold requirement and record element bounds.
- Make a layout change only if the CTA fails that requirement consistently.
- Any correction must preserve the tested mobile, tablet, and 1440 × 900 layouts and must not reduce text readability or tap-target size.

### Preserved current behavior outside the implementation gate

#### Lazy-loaded Google Map

The footer currently renders the Google Maps iframe with `loading="lazy"`. The approved foundation-hardening implementation does not include replacing it with click-to-load consent UI or another map experience.

- Preserve the existing lazy-loaded map during current foundation changes.
- Do not treat a map redesign as a Phase 0 or current implementation acceptance gate.
- Any material map UX or privacy-boundary change requires separate owner approval.
- CSP work may verify that the preserved current map is not accidentally broken, but that regression check does not authorize a redesign.

### Owner-dependent and deliberately deferred work

Full business digitization cannot begin in this hardening phase. The current tracker document remains design-only, and its retention, access, audit, backup, payment, warranty, identity, and workflow decisions require owner approval.

Likewise, authentic trust proof cannot be added until the owner supplies and approves evidence of current work, image provenance, reviews, credentials, repair outcomes, warranties, pricing, or turnaround claims.

The business-wide privacy notice and analytics activation also remain owner/legal decision gates because actual workshop data flows, retention, staff access, vendors, lawful bases, and measurement purposes are not yet confirmed.

**Acceptance criteria**

- Do not invent reviews, case studies, credentials, warranties, prices, turnaround times, repair outcomes, image provenance, privacy practices, retention periods, or lawful bases.
- Do not implement the repair tracker, customer accounts, payment processing, staff workflows, or stored submissions without the separately approved discovery decisions.
- Keep the existing public-site boundary truthful: the form creates a user-reviewed WhatsApp draft and the website does not claim to store it.
- Do not add analytics, advertising tags, session replay, profiling, or tracking storage until purpose, minimum event set, lawful basis/consent, provider, data fields, retention, access, cross-border handling, and notice changes are approved.
- Owner-supplied proof must be verified for accuracy, permission, date, and representation before publication.

## Phase 0 exit gate

Phase 0 is complete only when this baseline is reviewed as an accurate statement of what is confirmed, inconclusive, conditional, and owner-dependent. It does not mark any defect fixed.

Subsequent implementation must:

1. address confirmed foundation defects in small, reviewable changes;
2. add or update tests with each behavior change;
3. preserve the honest WhatsApp-only enquiry boundary;
4. reproduce conditional observations before changing code for them;
5. gather reproducible performance evidence before and after optimization;
6. run the full release gate before proposing a merge; and
7. stop before commit, push, merge, deployment, analytics activation, full digitization, or trust-content publication unless separately authorized.
