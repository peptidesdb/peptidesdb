import type { NextConfig } from "next";

/* =========================================================
   Next.js config

   redirects(): Permanent 308 redirect from the Vercel-assigned
   preview/deploy host (peptidedb-topaz.vercel.app) to the
   canonical brand domain (peptidesdb.org). Closes a SEO
   split-identity leak — search engines and LLM crawlers should
   only ever index one host.
   ========================================================= */

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "peptidedb-topaz.vercel.app",
          },
        ],
        destination: "https://peptidesdb.org/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.peptidesdb.org",
          },
        ],
        destination: "https://peptidesdb.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
