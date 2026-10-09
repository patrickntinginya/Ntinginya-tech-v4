/**
 * Supabase Storage host, so next/image can resize and compress CMS images.
 * Derived from the existing NEXT_PUBLIC_SUPABASE_URL variable; no new variable is needed.
 * If it is unset or invalid, CMS images simply fall back to a plain <img>.
 */
function supabaseImagePatterns() {
  try {
    const { hostname } = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
    return hostname ? [{ protocol: "https", hostname, pathname: "/storage/v1/object/public/**" }] : [];
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseImagePatterns(),
    // Phones first: fewer, smaller candidate widths means fewer wasted bytes on 4G.
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    // Canonical URLs, sitemap and Open Graph. Falls back to the URL Netlify provides at build time.
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "",
  },
  async redirects() {
    return [
      // R&D lives at /r-and-d; earlier versions used /research. Keep old links working.
      { source: "/research", destination: "/r-and-d", permanent: true },
      // The sign-in page lives at /login; /admin/login is a convenience alias.
      { source: "/admin/login", destination: "/login", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
      {
        // Private areas: never cached by shared caches, never indexed.
        source: "/(admin|login)(.*)",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
