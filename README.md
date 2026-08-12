# Threvelonbase

Threvelonbase is a repair-first electronics site for phones, laptops and
everyday devices in Akure. The homepage routes enquiries for devices,
accessories, technical training and business services to WhatsApp.

## Stack

- Node.js `>=22.13.0`
- Next.js App Router under `app/`
- Production host: **Netlify** (`next build` + `@netlify/plugin-nextjs`)

Production site: https://threvelonbase.netlify.app

## Local development

```bash
npm ci
npm run dev
```

Other commands:

- `npm run build` — production Next.js build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
- `npm test` — production build plus contract tests
- `npm run test:e2e` — Playwright smoke tests (requires a prior `npm run build`)
- `npm run build:netlify` — alias for the Netlify production build

When `NEXT_PUBLIC_SITE_URL` is set to the public origin (scheme + host only),
the app emits matching absolute URLs for:

- HTML canonical / `metadataBase`
- Open Graph `og:url`
- LocalBusiness JSON-LD `url`
- `sitemap.xml` homepage entry
- `robots.txt` sitemap reference

Do not invent a site origin in code when the variable is unset.

## Netlify deployment

1. Connect the GitHub repository in Netlify.
2. Prefer **build settings from `netlify.toml`** (clear UI overrides if the
   dashboard forced `command` / `publish` earlier). Safe UI values if needed:
   - **Build command:** `npm run build`
   - **Publish directory:** leave default / `.next` (OpenNext plugin)
   - **Node:** `22.13.0`
3. Optional environment variable:

   | Variable | Example |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://threvelonbase.netlify.app` or your custom domain |

   Use the final public origin only (scheme + host, no path). Without it the
   site still deploys; absolute canonical, Open Graph, sitemap and JSON-LD
   URLs stay omitted by design.

4. Deploy. Netlify’s Next.js runtime handles SSR and static assets.

## Persistence boundary

The public site does not include a database or authenticated customer area.
Enquiries hand off to WhatsApp. See `docs/repair-tracker-architecture.md` for
a design-only outline of a possible future internal repair tracker.
