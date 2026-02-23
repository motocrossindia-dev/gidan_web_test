import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
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

  // Turbopack resolve aliases (mirror of webpack aliases below)
  turbopack: {
    resolveAlias: {
      "react-helmet": "./src/lib/helmet-shim.js",
      "react-helmet-async": "./src/lib/helmet-shim.js",
    },
  },

  // Image optimization domains
  images: {
    qualities: [75, 80],
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
      {
        source: "/category/:id",
        destination: "/:id",
        permanent: true,
      },
      {
        source: "/category/subcategory/:id/:subcategory",
        destination: "/:id/:subcategory",
        permanent: true,
      },
    ];
  },

  // Rewrites (backend sitemap proxy removed — using local sitemap.ts with clean URLs)
  async rewrites() {
    return [];
  },

  // Shim react-helmet / react-helmet-async (not compatible with React 19 / Next.js App Router)
  webpack(config) {
    const shimPath = path.resolve(
      __dirname,
      "src/lib/helmet-shim.js"
    );
    config.resolve.alias["react-helmet"] = shimPath;
    config.resolve.alias["react-helmet-async"] = shimPath;
    return config;
  },

  // Transpile MUI packages
  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/system",
  ],
};

export default nextConfig;
