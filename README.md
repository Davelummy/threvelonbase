# Threvelonbase

Threvelonbase is a repair-first electronics site for phones, laptops and
everyday devices in Akure. The homepage also routes enquiries for devices,
accessories, technical training and business services to WhatsApp.

## Stack and Lifecycle

- Node.js `>=22.13.0`
- App Router under `app/` (shared source for both hosts)
- Local/ChatGPT Sites: Vite with [Vinext](https://github.com/cloudflare/vinext)
  and the Cloudflare Vite plugin
- Production host: **Netlify** (standard `next build` + OpenNext adapter)

This project does not use `wrangler.jsonc`. Cloudflare D1/R2 remain unconfigured.

### Netlify (primary production)

1. Connect the GitHub repo in Netlify.
2. Build command: `npm run build:netlify` (already set in `netlify.toml`).
3. Node version: `22.13.0` (set in `netlify.toml`).
4. In **Site settings → Environment variables**, set:

   | Variable | Example |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-site.netlify.app` or your custom domain |

   Use the final public origin only (scheme + host, no path). Without it the
   site still deploys; absolute canonical/OG/sitemap/JSON-LD URLs stay omitted
   by design.

5. Deploy. Netlify’s Next.js runtime handles SSR/static assets automatically.

Useful Netlify commands locally (optional CLI):

- `npm run build:netlify` then `npm run start:next`

### Sites / Vinext (local + optional ChatGPT Sites)

The Sites lifecycle may install dependencies before a checkout is returned and
run `npm run build` / `npm run build:sites` against the pushed commit.

`npm run install:ci` is a bounded, non-retrying `npm ci`. The install and build
helpers target the Linux Sites environment and require `flock`, `curl`,
`sha256sum`, and GNU `timeout`; they are not native macOS install/build scripts.
Project-scoped HOME, npm cache, XDG, temporary files and Wrangler logs are
provided by `scripts/sites-env.sh`. `.sites-runtime/` is disposable.

Useful commands:

- `npm run dev`: run the local Vite/Vinext server
- `npm run start`: serve the built Vinext application
- `npm run build` / `npm run build:sites`: build and validate the Sites artifact
- `npm run build:netlify`: production Next.js build for Netlify
- `npm test`: Sites build + rendered HTML / repair enquiry contract tests
- `npm run validate:artifact`: validate an existing Sites build artifact

## ChatGPT Sites Auth

`app/chatgpt-auth.ts` provides optional dispatch-owned Sign in with ChatGPT
helpers. Use `getChatGPTUser()` for optional identity and
`requireChatGPTUser(returnTo)` for protected server-rendered pages. Use the path
helpers for sign-in/sign-out links and pass only same-origin relative return
paths. Protected pages must be dynamic because identity comes from request
headers.

The hosting platform owns `/signin-with-chatgpt`, `/signout-with-chatgpt`,
`/callback`, OAuth cookies and identity injection. SIWC establishes identity, not
workspace membership; use Sites access policies or an explicit membership check
when a page needs restriction. Public marketing content remains anonymous.

## Persistence Boundary

Cloudflare D1 and R2 are intentionally unconfigured: `.openai/hosting.json`
keeps both `d1` and `r2` set to `null`, and the root schema is empty. The D1
example and Drizzle tooling are opt-in scaffolding only. Do not add production
repair tracking, migrations, uploads or payment persistence until data models,
privacy, access controls and real bindings are approved and configured.
