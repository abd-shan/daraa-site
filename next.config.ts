import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";
import { defaultLocale } from "./src/i18n";

const nextConfig: NextConfig = {
  // SEC-002. Hides the framework name, not the version — Next stays
  // fingerprintable from /_next/ paths. Noise reduction, not protection.
  poweredByHeader: false,

  // Cloudflare Workers cannot run Next's sharp-based optimiser, and routing
  // /_next/image through Cloudflare Images is a paid add-on. Serving the
  // files as they are keeps the free plan and keeps the images working —
  // which is why every photograph is resized and compressed before it is
  // committed rather than at request time. See public/brand/README.md.
  images: { unoptimized: true },

  // `/` has no page — everything lives under /[locale].
  // Not permanent: browsers cache 308s hard, and this destination changes the
  // day we add Accept-Language negotiation.
  redirects: async () => [
    { source: "/", destination: `/${defaultLocale}`, permanent: false },
  ],
};

export default nextConfig;

// Makes Cloudflare bindings reachable from `next dev`. It is a no-op in
// `next build`, so it does not affect the production bundle.
initOpenNextCloudflareForDev();
