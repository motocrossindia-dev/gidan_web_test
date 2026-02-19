import type { NextConfig } from "next";

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

  // Turbopack root — force to this project dir, not parent CRA dir
  turbopack: {
    root: "/Users/hawk/Biotechmaali_ecommerce_mohan/biotechmaali-next",
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

  // Transpile MUI packages
  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/system",
  ],
};

export default nextConfig;
