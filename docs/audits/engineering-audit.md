# Engineering Audit

## Scope

This read-only audit covers commit `53b8e8c` (`audit/engineering`), including the app router surface, styles, tests, scripts, package and TypeScript configuration, Vinext/Cloudflare Worker wiring, optional D1/Drizzle scaffolding, public assets, and the three-commit history from `4a58f24` through `53b8e8c`.

The worktree was clean at the starting commit. No application, test, configuration, deployment, or database files were changed during the audit. `node_modules/` and `dist/` were absent, so conclusions are based on source inspection and repository metadata; runtime tests and builds were not run.

## Executive Assessment

The repository is a coherent small Vinext starter with a clear anonymous marketing-page flow, a locked dependency graph, strict TypeScript mode, bounded Linux-oriented Sites scripts, and intentionally optional D1/R2 bindings. The principal risks are the image path, thin verification, and a very large client boundary. The application is not yet a well-tested production storefront: the repair journey depends on opening an external WhatsApp URL, and the only test does not exercise that behavior.

No critical security defect was found in the reviewed code. External links use `rel="noreferrer"`, generated WhatsApp messages are URI encoded, and the ChatGPT return-path helper rejects external and reserved paths. The main security and reliability gaps appear when optional example API code is enabled.

## Findings

### ENG-01: Large hero image bypasses the Vinext image pipeline

**Severity: High**
**Location:** `app/page.tsx:177-183`; `worker/index.ts:32-40`; `public/images/threvelonbase-repair-hero.png`

The above-the-fold image is a 1448 x 1086, 2.1 MB PNG rendered with a plain `<img>`. The previous commit used `next/image`; commit `53b8e8c` replaced it with `<img>`, while the Worker still contains a Vinext image-optimization endpoint. The current markup has no responsive source set, `sizes`, or format negotiation. `fetchPriority="high"` correctly signals LCP importance but also prioritizes the full 2.1 MB payload.

This can materially increase LCP and mobile data use. It also means the image-optimization path is present but unused by the main page.

**Minimal safe improvement:** keep the explicit dimensions and alt text, but either restore a Vinext-compatible optimized image component after verifying its binding requirements, or generate smaller WebP/AVIF and mobile variants and use a responsive `<picture>`/`srcset`. Do not configure D1 or R2 for this; image optimization requires its own platform capability and should be treated separately.

### ENG-02: Exposed image endpoint assumes an unconfigured `IMAGES` binding

**Severity: Medium**
**Location:** `worker/index.ts:5-14`, `worker/index.ts:32-40`; `vite.config.ts:14-33`; `.openai/hosting.json:2-4`

The Worker handles `/_vinext/image` and calls `env.IMAGES.input(...)`, but `IMAGES` is not declared in `.openai/hosting.json` or the local binding configuration. The current page avoids the failure because it uses plain `<img>`, but any future `next/image` usage or direct request to `/_vinext/image` can fail at runtime when the binding is absent. The `Env` interface marks the binding as present, so TypeScript does not make this configuration mismatch visible.

**Minimal safe improvement:** make the image route conditional on a configured image binding, or return a clear 503 response when it is unavailable. Add a deployment smoke test for the route only when the platform provides the binding. Keep the existing `d1: null` and `r2: null` values unchanged.

### ENG-03: Repair form validation and failure handling stop at native `required`

**Severity: Medium**
**Location:** `app/page.tsx:94-117`, `app/page.tsx:262-284`

The form requires a non-empty name and phone field, but it does not validate phone format, trim values, cap input lengths, or identify the selected values with stable field names. The submit handler interpolates all values into a WhatsApp message and calls `window.open` without checking for a blocked popup or displaying success/failure state. A user can receive no feedback when the browser blocks the new tab, and an unusually large details field can create an impractical external URL.

The message is URI encoded, so the reviewed code does not expose an obvious URL-injection issue. However, name, phone number, and device details are placed in the WhatsApp URL query string, which creates a privacy and URL-length boundary that should be explicit.

**Minimal safe improvement:** trim and length-limit fields, validate the phone input with a project-appropriate Nigerian/international format, and show an inline status with a fallback to a normal anchor or displayed WhatsApp link when `window.open` fails. Add a short privacy note explaining that the entered details are transferred to WhatsApp before submission.

### ENG-04: Automated coverage validates only preview metadata

**Severity: High**
**Location:** `package.json:8-16`; `tests/rendered-html.test.mjs:4-33`; `scripts/validate-artifact.sh:10-35`

The test suite contains one test. It imports the built Worker, requests `/`, checks status and content type, and asserts the `codex-preview=development` meta tag. It does not test menu state, navigation anchors, form validation, WhatsApp URL construction, popup failure behavior, external-link attributes, responsive markup, image optimization, the Worker image route, ChatGPT auth helpers, or the optional D1 route. Artifact validation only checks that a manifest parses and that `dist/server/index.js` exposes `default.fetch`.

The build is part of `npm test`, which is useful, but a successful build does not establish runtime behavior for the main user journey. There is no browser or component test dependency in `package.json`.

**Minimal safe improvement:** add focused tests for the pure WhatsApp URL/message builder and ChatGPT return-path helpers first. Add one browser-level smoke test for mobile navigation and repair submission, and add a Worker request test for the image route's configured and unconfigured cases. Keep D1 tests opt-in until a real binding exists.

### ENG-05: The entire page is one client component

**Severity: Medium**
**Location:** `app/page.tsx:1-3`, `app/page.tsx:94-382`

`"use client"` applies to the complete 382-line page, including all static copy, icons, navigation, service cards, commerce sections, contact details, and footer. Only the mobile menu and repair form require client state. This increases the hydration and JavaScript surface and makes every section part of one change-sensitive component. It also makes future server-side ChatGPT identity or data work harder to introduce safely.

**Minimal safe improvement:** preserve the current page structure, but move the interactive menu and form into small client components and leave static sections as server-rendered components. Extract repeated local primitives such as `ServiceCard`, `ExternalActionLink`, and `RepairForm` only as part of that boundary split; avoid introducing a broad design-system layer for this small site.

### ENG-06: Optional D1 example lacks runtime input validation and can leak database errors

**Severity: Medium if enabled; Low in the current anonymous site**
**Location:** `examples/d1/app/api/notes/route.ts:5-16`, `examples/d1/app/api/notes/route.ts:36-56`; `examples/d1/db/schema.ts:4-9`; `.openai/hosting.json:2`

Strict TypeScript is enabled in `tsconfig.json:5-15`, but `allowJs` is also enabled and the API boundary relies on a type assertion rather than a runtime schema. Invalid JSON, a non-object payload, oversized strings, and non-string values can reach the error path or database call. The fallback error path returns the underlying error message to the caller. If the example is activated as a route, POST also has no authentication, authorization, rate limiting, or explicit body-size policy.

This is not a current application path: the production schema is intentionally empty, D1 is explicitly unconfigured, and the example is documented as opt-in. It should not be treated as a reason to configure D1/R2 now.

**Minimal safe improvement when the example is adopted:** validate JSON and string bounds at the request boundary, return stable generic 4xx/5xx messages, and apply the site's intended access policy before allowing writes. Keep the example schema separate or make the Drizzle configuration switch explicit so `db:generate` cannot silently target the wrong schema.

### ENG-07: Contact and service data have avoidable duplication

**Severity: Low**
**Location:** `app/page.tsx:30-39`, `app/page.tsx:52-88`, `app/page.tsx:295-302`, `app/page.tsx:324`, `app/page.tsx:341`, `app/page.tsx:362-374`

The WhatsApp number and primary phone number are constants, but the same WhatsApp messages and service destinations are repeated in the service-card data and commerce/academy links. Contact display values and secondary phone details are also hard-coded separately. The long JSX body repeats the same button/link patterns and makes copy or destination changes easy to apply inconsistently.

**Minimal safe improvement:** centralize contact data and message constants, add an explicit `external` field to service data instead of inferring it with `startsWith("http")`, and extract only the repeated card/action patterns. This is a maintainability change, not a reason to add a new dependency.

### ENG-08: Local build verification is Linux-specific and has no repository CI

**Severity: Medium**
**Location:** `README.md:7-20`, `package.json:8-17`, `scripts/install-ci.sh:10-25`, `scripts/build-verified.sh:10-18`

The repository correctly documents that install/build helpers require Linux `flock`, GNU `timeout`, `curl`, and `sha256sum`. That matches the stated Sites lifecycle, but it prevents native macOS build verification and no `.github` workflow or other CI definition is present in the tracked repository. With `node_modules/` and `dist/` absent, this checkout has no locally executable build artifact to validate.

**Minimal safe improvement:** keep the remote Sites contract unchanged, but provide a CI job or documented container that runs the same Linux scripts on every change. Add a separate portable static/type/lint check if local macOS verification is a requirement.

## Compatibility Review

### Vinext and Cloudflare Sites

The deployment shape is internally consistent: Vite composes Vinext, the Sites plugin, and the Cloudflare plugin (`vite.config.ts:1-4`, `vite.config.ts:54-61`); the Worker exports an object with `fetch` (`worker/index.ts:28-47`); and the build plugin packages hosting metadata and the `drizzle/` directory (`build/sites-vite-plugin.ts:17-43`). The lockfile pins the Vinext tarball with integrity data, and the install helper verifies that tarball before `npm ci` (`scripts/install-ci.sh:81-169`).

The main compatibility concern is the image mismatch in ENG-01 and ENG-02. `next.config.ts` is empty, so image behavior is governed by the custom Worker/Vinext path rather than an explicit application image policy. The `codex-preview=development` metadata is always emitted (`app/layout.tsx:10-12`) and is hard-coded into the only test. That appears intentional for the preview workflow, but it needs an environment-specific decision before a production deployment.

### ChatGPT Sites and authentication

The current page is anonymous-compatible because it does not import or call `headers()` or the ChatGPT auth helpers. This is appropriate for public marketing content. `app/chatgpt-auth.ts:47-77` safely restricts return paths to same-origin relative paths and excludes dispatch-owned auth routes. If user-specific pages or write actions are added, the README's requirement to use `force-dynamic` for header-dependent pages must be followed (`README.md:64-89`). No auth behavior is currently exercised by tests.

## Database and Deployment Scaffolding

`.openai/hosting.json` deliberately has `d1: null` and `r2: null`. `db/schema.ts` is intentionally empty, and `db/index.ts` fails with a useful message if a caller tries to use an absent D1 binding. The D1 notes example has its own schema and route, but it is not wired into the production app or the root Drizzle schema. This is a sensible opt-in scaffold. No database migration or binding change is recommended in this audit.

## Security and Reliability Checks

- External `target="_blank"` links use `rel="noreferrer"`; the form's `window.open` uses `noopener,noreferrer`. The destinations are constants or fixed site URLs, not user-controlled values, so no obvious reverse-tabnabbing or open-redirect issue was found.
- `app/chatgpt-auth.ts` rejects `//` paths, cross-origin URLs, malformed URLs, and reserved auth paths before encoding return destinations.
- Form values are passed through `encodeURIComponent`, but the external transfer, length limits, consent text, and popup fallback described in ENG-03 remain unresolved.
- There is no application error boundary or explicit Worker error response for image-transform failures. The static page has no server fetch path, so the immediate blast radius is limited, but future dynamic features would need explicit failure UI.
- Focus styling is defined for form controls (`app/globals.css:137-141`), but there is no consistent visible focus treatment for the navigation, buttons, or external links. This is a lower-priority keyboard usability gap.

## Prioritized Minimal Improvements

1. Reduce and responsively serve the hero asset without assuming D1/R2; separately guard the unconfigured `IMAGES` route.
2. Add focused unit tests for URL/message construction and ChatGPT path safety, then one browser smoke test for the repair journey.
3. Add bounded phone/details validation, popup fallback, inline status, and a privacy notice to the repair form.
4. Split only the menu/form into client islands and centralize contact/message constants.
5. Harden the opt-in D1 example before activation and add Linux CI for the existing Sites scripts.

## Verification Status

Tests and builds were not run. The checkout had no `node_modules/` or `dist/`, and the documented build/install scripts require Linux tooling that is not available through this macOS-only audit path. No application files were modified.

## Remaining Risks

- Actual Vinext build output, hydration behavior, and Cloudflare binding behavior remain unverified until a Linux/Sites environment runs the locked install and build.
- Mobile LCP and real image transfer size remain unmeasured; the 2.1 MB source is a static asset inspection, not a field performance result.
- WhatsApp handoff success, popup blocking, URL length limits, and privacy behavior remain untested in a browser.
- The `codex-preview=development` metadata may be inappropriate for a production deployment unless the Sites platform explicitly requires it.
- Enabling the D1 example without adding auth, validation, and generic error handling would expose a writable and diagnostically verbose API surface.
