import type { NextConfig } from "next";
import path from "path";
import redirectsData from "./src/lib/redirects.json";
import goneData from "./src/lib/gone.json";

const nextConfig: NextConfig = {
  // Enforce trailing slashes on all URLs (301 redirect for non-slash URLs).
  // This is the correct way — using custom redirects caused infinite redirect loops.
  trailingSlash: true,

  // Use absolute URLs for static assets (managed by assetPrefix)
  // assetPrefix: process.env.NODE_ENV === "production" ? (process.env.NEXT_PUBLIC_BASE_URL || undefined) : undefined,


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

  // Inline critical CSS and defer non-critical — fixes render-blocking CSS chunks
  experimental: {
    optimizeCss: true,
    // Tree-shake react-icons barrel files — strips unused icon code from all 13 icon sets
    optimizePackageImports: [
      'react-icons/ai', 'react-icons/bs', 'react-icons/ci',
      'react-icons/fa', 'react-icons/fa6', 'react-icons/fi',
      'react-icons/go', 'react-icons/io', 'react-icons/io5',
      'react-icons/md', 'react-icons/ri', 'react-icons/sl',
      'react-icons/tb', 'lucide-react',
    ],
  },

  // Turbopack resolve aliases (mirror of webpack aliases below)
  turbopack: {
    resolveAlias: {
      "react-helmet": "./src/lib/helmet-shim.js",
      "react-helmet-async": "./src/lib/helmet-shim.js",
    },
  },

  // Image optimization domains
  images: {
    qualities: [70, 75, 80],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days — maximize cache hits
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: process.env.NODE_ENV !== "production",
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
        source: "/blogcomponent",
        destination: "/blogs",
        permanent: true,
      },
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
