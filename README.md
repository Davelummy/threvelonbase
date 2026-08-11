# Threvelonbase

Threvelonbase is a repair-first electronics site for phones, laptops and
everyday devices in Akure. The homepage also routes enquiries for devices,
accessories, technical training and business services to WhatsApp.

## Stack and Lifecycle

- Node.js `>=22.13.0`
- Vite with [Vinext](https://github.com/cloudflare/vinext) and the Cloudflare
  Vite plugin
- Cloudflare Sites deployment through the checked-in `package-lock.json`

The Sites lifecycle installs dependencies before a checkout is returned. Edit
the source under `app/` and checkpoint coherent changes; the remote builder runs
`npm run build` against the pushed commit. This project does not use
`wrangler.jsonc`.

Useful commands:

- `npm run dev`: run the local Vite/Vinext server
- `npm run start`: serve the built Vinext application
- `npm run build`: build and validate the Sites artifact
- `npm test`: build, validate, and test rendered HTML contracts
- `npm run validate:artifact`: validate an existing build artifact

`npm run install:ci` is a bounded, non-retrying `npm ci`. The install and build
helpers target the Linux Sites environment and require `flock`, `curl`,
`sha256sum`, and GNU `timeout`; they are not native macOS install/build scripts.
Project-scoped HOME, npm cache, XDG, temporary files and Wrangler logs are
provided by `scripts/sites-env.sh`. `.sites-runtime/` is disposable.

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
