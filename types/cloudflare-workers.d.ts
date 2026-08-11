/**
 * Minimal ambient types so Next.js typechecking can coexist with the
 * Cloudflare/Vinext worker and optional D1 scaffolding. These bindings are
 * only available on the Cloudflare runtime, not on Netlify.
 */
declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
    ASSETS?: Fetcher;
    [key: string]: unknown;
  };
}

interface D1Database {
  prepare(query: string): unknown;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: unknown[]): Promise<T[]>;
  exec(query: string): Promise<unknown>;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}
