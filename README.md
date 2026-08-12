# Threvelonbase

Threvelonbase is a repair-first electronics site for phones, laptops and
everyday devices in Akure. The homepage routes enquiries for devices,
accessories, technical training and business services to WhatsApp.

## Stack and lifecycle

- Node.js `>=22.13.0`
- App Router under `app/` (shared source for both hosts)
- Local / Sites development: Vite with [Vinext](https://github.com/cloudflare/vinext)
  and the Cloudflare Vite plugin
- Production host: **Netlify** (`next build` + OpenNext adapter)

This project does not use `wrangler.jsonc`. Cloudflare D1 and R2 remain
unconfigured until a persistence design is approved.

### Netlify (production)

1. Connect the GitHub repository in Netlify.
2. Prefer **build settings from `netlify.toml`** (clear UI overrides if the
   dashboard forced `command` / `publish` earlier). Safe UI values if needed:
   - **Build command:** `npm run build` (detects Netlify and runs `next build`)
   - **Publish directory:** leave default / `.next` (OpenNext plugin)
   - **Node:** `22.13.0`
3. In **Site settings → Environment variables**, set:

   | Variable | Example |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-site.netlify.app` or your custom domain |

   Use the final public origin only (scheme + host, no path). Without it the
   site still deploys; absolute canonical, Open Graph, sitemap and JSON-LD
   URLs stay omitted by design.

4. Deploy. Netlify’s Next.js runtime handles SSR and static assets.

Local Netlify-style build:

- `npm run build:netlify`, then `npm run start:next`

### Sites / Vinext (local and optional Sites hosting)

The Sites lifecycle may install dependencies before a checkout is returned and
run `npm run build` / `npm run build:sites` against the pushed commit.

`npm run install:ci` is a bounded, non-retrying `npm ci`. Install and build
helpers target the Linux Sites environment and require `flock`, `curl`,
`sha256sum`, and GNU `timeout`. Project-scoped HOME, npm cache, XDG, temporary
files and Wrangler logs are provided by `scripts/sites-env.sh`.
`.sites-runtime/` is disposable.

Useful commands:

- `npm run dev` — local Vite/Vinext server
- `npm run start` — serve the built Vinext application
- `npm run build` / `npm run build:sites` — build and validate the Sites artifact
- `npm run build:netlify` — production Next.js build for Netlify
- `npm test` — Sites build plus HTML, enquiry and theme contract tests
- `npm run validate:artifact` — validate an existing Sites build artifact

## Sites authentication helpers

`app/chatgpt-auth.ts` provides optional dispatch-owned Sign in with ChatGPT
helpers for protected server-rendered pages. Public marketing content does not
require them.

- `getChatGPTUser()` — optional identity
- `requireChatGPTUser(returnTo)` — redirect unauthenticated users
- Path helpers accept only same-origin relative return paths

The hosting platform owns `/signin-with-chatgpt`, `/signout-with-chatgpt`,
`/callback`, OAuth cookies and identity injection. Protected pages must be
dynamic because identity comes from request headers.

## Persistence boundary

Cloudflare D1 and R2 are intentionally unconfigured (`.openai/hosting.json`
keeps `d1` and `r2` as `null`). The root Drizzle schema is empty. Do not add
production repair tracking, migrations, uploads or payment persistence until
data models, privacy, access controls and real bindings are approved.

See `docs/repair-tracker-architecture.md` for a design-only future tracker
outline.
