import type { NextConfig } from "next";
import path from "path";
import redirectsData from "./src/lib/redirects.json";
import goneData from "./src/lib/gone.json";

const nextConfig: NextConfig = {
  // Enforce trailing slashes on all URLs (301 redirect for non-slash URLs).
  // This is the correct way — using custom redirects caused infinite redirect loops.
  trailingSlash: true,

  // Map CRA env vars to Next.js NEXT_PUBLIC_ equivalents
  env: {
    REACT_APP_API_URL: process.env.NEXT_PUBLIC_API_URL,
    REACT_APP_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    REACT_APP_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    REACT_APP_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },

  // Allow .js and .jsx files (migrating from CRA)
  pageExtensions: ["ts", "tsx", "js", "jsx"],

  // Explicitly enable compression
  compress: true,

  // Turbopack resolve aliases (mirror of webpack aliases below)
  turbopack: {
    resolveAlias: {
      "react-helmet": "./src/lib/helmet-shim.js",
      "react-helmet-async": "./src/lib/helmet-shim.js",
    },
  },

  // Image optimization domains
  images: {
    qualities: [75, 80, 85],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Backward compatibility redirects for old CRA routes
  async redirects() {
    return [
      ...goneData.map((source) => ({
        source,
        destination: "/api/gone",
        permanent: false,
      })),
      ...redirectsData,
      {
        source: "/category/:id",
        destination: "/:id/",
        permanent: true,
      },
      {
        source: "/category/subcategory/:id/:subcategory",
        destination: "/:id/:subcategory/",
        permanent: true,
      },
    ];
  },


  // Rewrites (backend sitemap proxy removed — using local sitemap.ts with clean URLs)
  async rewrites() {
    return [];
  },

  // Shim react-helmet / react-helmet-async (not compatible with React 19 / Next.js App Router)
  webpack(config, { dev, isServer }) {
    const shimPath = path.resolve(
      __dirname,
      "src/lib/helmet-shim.js"
    );
    config.resolve.alias["react-helmet"] = shimPath;
    config.resolve.alias["react-helmet-async"] = shimPath;

    // Advanced: Minify server-side output in production
    if (!dev) {
      config.optimization.minimize = true;
    }

    return config;
  },

  // Transpile MUI packages
  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/system",
  ],

  // JS Minification & Production Cleanup
  productionBrowserSourceMaps: false,

  compiler: {
    // Remove console logs in production for smaller bundles and cleaner logs
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
};


export default nextConfig;
