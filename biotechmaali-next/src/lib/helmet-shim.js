'use client';
// No-op shim for react-helmet and react-helmet-async
// Next.js App Router handles metadata via the `metadata` export in page/layout files.
// This shim prevents build errors from legacy CRA-style Helmet usage.

export function Helmet() {
  return null;
}

export function HelmetProvider({ children }) {
  return children;
}

export default { Helmet, HelmetProvider };
