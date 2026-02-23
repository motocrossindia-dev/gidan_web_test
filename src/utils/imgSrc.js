/**
 * Normalize static image imports for Next.js compatibility.
 * In CRA, `import img from './img.webp'` returns a URL string.
 * In Next.js, it returns `{ src, width, height }`.
 * This helper returns the URL string in both cases.
 */
export function imgSrc(imported) {
  if (!imported) return '';
  if (typeof imported === 'string') return imported;
  if (typeof imported === 'object' && imported.src) return imported.src;
  if (typeof imported === 'object' && imported.default) {
    return typeof imported.default === 'string' ? imported.default : imported.default.src || '';
  }
  return String(imported);
}
