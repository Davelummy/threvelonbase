# Performance Results

**Profile:** `docs/performance-measurement-profile.md`  
**Recorded:** 13 August 2026  
**Build used for baseline:** `npm run build` at commit `2aabe92` with `NEXT_PUBLIC_SITE_URL` unset  
**Local server:** `npx --no-install next start -H 127.0.0.1 -p 4175`  
**Raw artifacts:** `/tmp/tb-perf/` (not in Git)

Numeric Lighthouse *scores* are shown only as environment context. They are not a pass/fail gate.

## Build-time JS evidence (same baseline build)

| Item | Bytes |
| --- | --- |
| GSAP/ScrollTrigger chunk `.next/static/chunks/2sphohg1m4pl5.js` | 120738 raw, 46082 gzip |
| Dominant runtime chunk `.next/static/chunks/153_-eleo6ea7.js` | 228844 raw (contains `next`/`react`, no `ScrollTrigger`) |

On-disk content images:

| File | Bytes |
| --- | --- |
| `threvelonbase-repair-hero.webp` | 64858 |
| `threvelonbase-repair-featured.webp` | 73510 |
| `threvelonbase-devices-wall.webp` | 79040 |
| `threvelonbase-accessories-wall.webp` | 98524 |
| `threvelonbase-academy-hands-on.webp` | 62344 |

SSR HTML at the baseline (optimizer off) had empty `srcset` on all five photos. Wordmarks are SVGs and stay unoptimized.

## Baseline series (optimizer off)

Mobile cold (`simulate` Slow 4G, 412×823):

| Metric | Run 1 | Run 2 | Run 3 | Median | Range |
| --- | --- | --- | --- | --- | --- |
| LCP (ms) | 4154 | 3758 | 3411 | **3758** | 743 |
| FCP (ms) | 1568 | 1524 | 1564 | **1564** | 44 |
| CLS | 0 | 0 | 0 | **0** | 0 |
| TBT (ms) | 901 | 805 | 278 | **805** | 624 |
| Main-thread (ms) | 4563 | 5125 | 3815 | **4563** | 1310 |
| JS transfer (B) | 199220 | 199220 | 199220 | **199220** | 0 |
| Image transfer (B) | 139800 | 139800 | 139800 | **139800** | 0 |

Desktop cold (`--preset=desktop`):

| Metric | Run 1 | Run 2 | Run 3 | Median | Range |
| --- | --- | --- | --- | --- | --- |
| LCP (ms) | 807 | 746 | 702 | **746** | 105 |
| FCP (ms) | 395 | 391 | 380 | **391** | 14 |
| CLS | 0.02 | 0.02 | 0.02 | **0.02** | 0 |
| TBT (ms) | 52 | 66 | 47 | **52** | 19 |
| Main-thread (ms) | 812 | 1123 | 1141 | **1123** | 329 |
| JS transfer (B) | 199220 | 199220 | 199220 | **199220** | 0 |
| Image transfer (B) | 139800 | 139800 | 139800 | **139800** | 0 |

Lighthouse performance *scores* on this laptop: mobile 0.55 / 0.69 / 0.85; desktop 0.97 / 0.99 / 1.00. That spread is why scores stay TBD.

Baseline image requests (same on mobile and desktop):

- `200` `image/webp` `/images/threvelonbase-repair-hero.webp` 65140
- `200` `image/svg+xml` `/brand/tb-mark-reversed.svg` 867
- `200` `image/webp` `/images/threvelonbase-repair-featured.webp` 73793

Below-the-fold devices/accessories/academy files were not requested during these gathers.

## Classification

| Finding | Class | Notes |
| --- | --- | --- |
| Empty responsive `srcset` while `images.unoptimized` is true | Confirmed defect | HTML capture + Lighthouse requested the full 1200-wide WebPs |
| Mobile LCP ~3.4–4.2 s | Environment-specific / inconclusive as a product rating | 743 ms range on three cold runs |
| Mobile TBT 278–901 ms | Environment-specific | 624 ms range; not a stable field number |
| Long tasks on `153_-eleo6ea7.js` (Next/React runtime) | Measurable but not a GSAP rewrite trigger | Six of ten mobile long tasks attributed to that chunk |
| GSAP chunk `2sphohg1m4pl5.js` | Measurable but low-impact | 177 ms scripting vs 1654 ms on the Next chunk; unused-JS estimate 21 KiB |
| Desktop LCP ~0.7–0.8 s | Measurable but low-impact | Already inside a small band; no product change justified from LCP alone |

No GSAP removal or extra motion rewrite is justified by this trace.

## Image-optimizer candidate

Change tested: remove global `images.unoptimized: true` so Next 16.3 emits `srcSet` and `/_next/image`. Wordmark SVGs remain `unoptimized` at the component. Hero still uses only `preload`.

Local checks:

- Hero `srcSet` lists 384–3840 widths.
- `GET /_next/image?url=...&w=640&q=75` with `Accept: image/avif,image/webp` returned `200` `image/avif` 13635 bytes.
- Playwright `currentSrc` after the candidate: mobile `w=384`, tablet `w=828`, desktop `w=640`.

After series (same profile, same port, cold):

| Metric | Mobile after median | Mobile gate | Desktop after median | Desktop gate |
| --- | --- | --- | --- | --- |
| Image transfer | **41327** (was 139800) | Improved beyond noise | **33375** (was 139800) | Improved beyond noise |
| LCP | 3173 (was 3758) | Inside noise; no-reg pass | 715 (was 746) | Inside noise; no-reg pass |
| CLS | 0 | No-reg pass | 0.02 | No-reg pass |
| FCP | 1533 | Inside noise | 395 | Inside noise |
| TBT | 522 | Inside mobile noise | 170 (was 52) | Worse; not a justification metric |
| Main-thread | 4619 | Inside mobile noise | 1564 (was 1123) | Worse; not a justification metric |

After mobile image requests used `image/avif` `w=750` for hero (17513) and featured (22949). Desktop used `w=640` (14076 and 18432). Transfer reduction is traceable to those optimizer URLs.

Desktop TBT/main-thread rose on this laptop. The profile only requires LCP/CLS not to regress outside the before spread. Those hold. The candidate is kept for the repeatable image-transfer reduction and restored `srcSet`, not for a Lighthouse score claim.

Six viewport/theme first-fold screenshots were inspected at 375×812, 768×1024, and 1440×900 in light and dark. Hero crop, header, and tablet first-fold CTA remained intact.

## Decision

- Ship the Next image-optimizer config change.
- Do not change GSAP further for performance.
- Do not publish a performance score.
