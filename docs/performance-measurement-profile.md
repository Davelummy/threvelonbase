# Performance Measurement Profile

**Phase:** 3 — freeze a reproducible measurement profile  
**Recorded:** 13 August 2026  
**Machine:** Myne-MacBook-Pro.local  
**Worktree:** `/Users/davidolumide/Desktop/Downloads/threvelonbase-foundation-hardening`  
**Source snapshot at freeze:** `86b572bb8957016a5240134de38b6d382b21dd87` (`agent/foundation-hardening`)

This document is the required blocker-removal for performance implementation. It does **not** authorize a score target, a layout change for 1280×720, or a product change. Numeric Lighthouse scores and business performance thresholds remain **TBD**.

All later before/after candidates must use this exact profile. If any frozen value changes, record a new profile revision and do not compare runs across revisions.

## Frozen environment

| Item | Discovered value |
| --- | --- |
| OS | macOS 15.7.2 (Build 24G325) |
| Architecture | x86_64 |
| CPU | Intel(R) Core(TM) i5-8257U CPU @ 1.40GHz |
| Memory | 8589934592 bytes (8 GiB) |
| Node binary | `/Users/davidolumide/.hermes/node/bin/node` (also linked as `/Users/davidolumide/.local/bin/node`) |
| Node | v22.23.1 |
| npm | 10.9.8 |
| Chrome executable | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| Chrome version | Google Chrome 151.0.7922.137 |
| Lighthouse CLI | 13.4.1 via `npx --no-install lighthouse` (package cache `/Users/davidolumide/.npm/_npx/0f94ee7615faf582/node_modules/lighthouse`) |
| Playwright (visual matrix only) | 1.62.1 from this worktree |
| Next.js in this worktree | 16.3.0 |

## Test route

- URL: `http://127.0.0.1:4175/`
- Path: `/` only
- Host and port are fixed. Do not compare against production, Deploy Preview, or `next dev`.
- `NEXT_PUBLIC_SITE_URL` must be unset. Before `npm run build`, run `env | grep '^NEXT_PUBLIC_SITE_URL='` and expect no output. A present value is a profile mismatch; do not compare that build to this freeze.

## Local production-build and start procedure

From the worktree, with no other process bound to port 4175.

Terminal A (leave this process running):

```sh
cd /Users/davidolumide/Desktop/Downloads/threvelonbase-foundation-hardening
env | grep '^NEXT_PUBLIC_SITE_URL=' || true
npm run build
npx --no-install next start -H 127.0.0.1 -p 4175
```

Wait until that terminal prints that it is ready on `http://127.0.0.1:4175`. Then, in Terminal B:

```sh
mkdir -p /tmp/tb-perf
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4175/
```

Expected: `200`.

Keep the Terminal A server running for the entire before-set or after-set. Restart it only between a before series and an after series, after a fresh `npm run build`.

Port 4175 is reserved for this profile so it does not collide with Playwright’s `4173`.

## Run mode and categories

- Headless Chrome: `--chrome-flags="--headless=new"`
- Categories: `--only-categories=performance`
- Output: `--output=json --output=html --save-assets`
- Quiet CLI: `--quiet`
- Channel: Lighthouse Node CLI, not DevTools UI and not PageSpeed Insights
- Do not add extra Chrome extensions. Use the frozen Chrome binary above.

## Exact Lighthouse commands

Lighthouse 13.4.1 default mobile settings (from `lighthouse/core/config/constants.js` and lantern `throttling.mobileSlow4G`):

- form factor: `mobile`
- screen: 412 × 823, `deviceScaleFactor` 1.75, `mobile: true`
- throttling method: `simulate`
- `rttMs`: 150
- `throughputKbps`: 1638.4
- `requestLatencyMs`: 562.5
- `downloadThroughputKbps`: 1474.56
- `uploadThroughputKbps`: 675
- `cpuSlowdownMultiplier`: 4
- `disableStorageReset`: `false` (cold cache)

Desktop uses `--preset=desktop`, which this Lighthouse version maps to:

- form factor: `desktop`
- screen: 1350 × 940, `deviceScaleFactor` 1, `mobile: false`
- `throttling.desktopDense4G`: `rttMs` 40, `throughputKbps` 10240, `cpuSlowdownMultiplier` 1
- `disableStorageReset`: `false` (cold cache)

These Lighthouse viewports are **not** the visual-regression matrix. Visual checks stay at 375×812, 768×1024, and 1440×900.

Default emulated user agents in this Lighthouse 13.4.1 install:

- mobile: `Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36`
- desktop: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36`

### Mobile cold run

```sh
npx --no-install lighthouse \
  http://127.0.0.1:4175/ \
  --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags="--headless=new" \
  --only-categories=performance \
  --output=json \
  --output=html \
  --save-assets \
  --quiet \
  --output-path=/tmp/tb-perf/<label>-mobile-cold-<n>
```

`<n>` is `1`, `2`, or `3`. `<label>` is `baseline` or a candidate name.

### Desktop cold run

```sh
npx --no-install lighthouse \
  http://127.0.0.1:4175/ \
  --preset=desktop \
  --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags="--headless=new" \
  --only-categories=performance \
  --output=json \
  --output=html \
  --save-assets \
  --quiet \
  --output-path=/tmp/tb-perf/<label>-desktop-cold-<n>
```

Do not pass extra `--form-factor`, `--throttling`, or `--screenEmulation` flags. The installed CLI defaults and `--preset=desktop` already encode the values above.

## Cache procedure

- **Comparison runs are cold.** Each Lighthouse invocation uses the default `disableStorageReset: false`, which clears browser cache and listed storage before that run.
- Close other Chrome debugging sessions against port 4175.
- Do not click around the local site between comparison runs.
- Warm-cache (`--disable-storage-reset`) is **diagnostic only** and must not be mixed into a before/after comparison.

## Background-load preparation

Before the first run of a series:

1. Quit unnecessary browsers and heavy local apps if they were started after the previous series.
2. Do not start `next dev` in this worktree.
3. Do not run Playwright against 4175 at the same time.
4. Leave the machine on AC power if available; do not start a series on a thermal-throttle warning if one is visible.
5. Wait 30 seconds after `next start` is ready before the first Lighthouse launch.

This is a laptop (i5-8257U, 8 GiB). Treat large run-to-run spread as expected machine noise, not as a product defect, unless the same spread is absent after repeating the series.

## Series length and median

- Minimum **three** successful runs per profile (mobile cold, desktop cold).
- If a run fails to complete or write JSON, discard it and repeat that slot. Do not keep a partial file as a numbered run.
- Median: sort the three numeric values and take the middle one.
- Always publish all three values plus the median. Do not publish only the best run.

Record these fields from `<label>-<profile>-cold-<n>.report.json`:

- LCP (ms): `audits['largest-contentful-paint'].numericValue`
- FCP (ms): `audits['first-contentful-paint'].numericValue`
- CLS: `audits['cumulative-layout-shift'].numericValue`
- Total blocking time (ms): `audits['total-blocking-time'].numericValue`
- Main-thread time (ms): `audits['mainthread-work-breakdown'].numericValue`
- Long tasks: `audits['long-tasks']` when present (this Lighthouse 13.4.1 build does not provide `long-tasks-insight`)
- JavaScript transfer bytes: the `script` row of `audits['resource-summary'].details.items` (`transferSize`)
- Image transfer bytes: the `image` row of the same `resource-summary` list
- Image request URLs: `audits['network-requests'].details.items` where `resourceType` is `Image`

Those transfer totals include third-party requests such as Google Maps. Do not switch to a custom sum of `network-requests` mid-comparison.

After the same `npm run build` that served the series, record the GSAP-bearing chunk with:

```sh
rg -l "ScrollTrigger" .next/static/chunks -g '*.js'
wc -c .next/static/chunks/<chunk-from-rg>.js
gzip -c .next/static/chunks/<chunk-from-rg>.js | wc -c
```

Report both the raw byte count and the gzip byte count. This is on-disk build evidence, not a Lighthouse transfer figure.

`--save-assets` writes, next to the chosen `--output-path` prefix:

- `<prefix>.report.json`
- `<prefix>.report.html`
- `<prefix>-0.trace.json`
- `<prefix>-0.devtoolslog.json`

It does not write `artifacts.json`. Do not look there for `srcset`. For rendered `srcset` / `currentSrc`, use a separate Chromium snippet against `http://127.0.0.1:4175/` after the series, the same way Phase 0 did, and store that snippet output under `/tmp/tb-perf/`.

## Trace capture

`--save-assets` writes a trace next to the JSON/HTML outputs. Keep those traces with the run label.

For main-thread attribution, inspect the saved trace / Lighthouse `audits['mainthread-work-breakdown']`, `audits['long-tasks']` / `audits['long-tasks-insight']` if present, and the network records for image and script URLs. Do not attribute work to GSAP unless the trace or the named JS chunk content shows it.

## Raw evidence location

Store large artifacts **outside Git**:

```text
/tmp/tb-perf/
```

Commit only a concise summary under `docs/performance-results.md`. Do not add traces, HTML reports, or screenshots from Lighthouse into the repository.

## Required visual matrix (separate from Lighthouse emulation)

After any product-code candidate, and for the final hardening pass, exercise the site at:

| Viewport | Themes |
| --- | --- |
| 375 × 812 | light and dark |
| 768 × 1024 | light and dark |
| 1440 × 900 | light and dark |

The 1280 × 720 fold remains reproduction-only. It is not an authorized layout requirement in this profile.

## Comparison rules for a performance candidate

A candidate may be committed only when all of the following are true:

1. Before and after used this same frozen profile (same commands, port, Chrome, Lighthouse, cache mode).
2. Each side has three successful runs; the published figure is the median.
3. Apply rule 4 to every metric used to justify the candidate. For LCP, FCP, TBT, main-thread time, JavaScript transfer, and image transfer, lower is better. For CLS, lower is better.
4. A metric counts as improved only if **either**:
   - `|after_median − before_median| > (before_max − before_min)` and the sign is an improvement, **or**
   - the after closed interval `[after_min, after_max]` and the before closed interval `[before_min, before_max]` do not overlap, and every after value is better than every before value.
   If neither holds, classify that metric as **not distinguished from machine noise**.
5. Transfer or main-thread reductions are traceable to the files actually changed.
6. Median LCP and CLS pass the no-regression check `after_median <= before_median + (before_max − before_min)`. Equality at that bound is a pass.
7. Accessibility and existing behaviour still pass `npm run verify:release`.
8. Crops, alt text, and the six visual-matrix states remain intact for any image candidate.

No absolute Lighthouse performance score is a pass/fail gate.

## Classification vocabulary

Every recorded finding must use one of:

- Confirmed defect
- Measurable but low-impact
- Environment-specific
- Not reproduced
- Inconclusive

## Out of scope for this profile

- Production or Deploy Preview measurement
- Invented score targets
- Dependabot, analytics, or hosting changes
- 1280 × 720 layout edits
- Removing GSAP only because the library is present
