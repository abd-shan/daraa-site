import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import incrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Every page here is prerendered at build time — no ISR, no revalidation,
 * no Server Action, no Route Handler.
 *
 * An incremental cache is still required: OpenNext serves prerendered HTML
 * *through* the cache, so with none configured the worker finds nothing and
 * every page 404s while /_next/static and /brand keep working. That failure
 * looks like broken routing and is not.
 *
 * This override reads the prerendered pages straight from the Workers static
 * assets already being uploaded, so it needs no R2 bucket, KV namespace or
 * D1 database. It cannot revalidate — which is exactly right for a site that
 * only ever serves what the build produced.
 */
export default defineCloudflareConfig({ incrementalCache });
