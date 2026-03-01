import { toAbsoluteUrl } from './urlHelper';

/**
 * Normalize static image imports for Next.js compatibility.
 * In CRA, `import img from './img.webp'` returns a URL string.
 * In Next.js, it returns `{ src, width, height }`.
 * This helper returns the absolute URL string in both cases.
 */
export function imgSrc(imported) {
  if (!imported) return '';
  let url = '';
  if (typeof imported === 'string') {
    url = imported;
  } else if (typeof imported === 'object' && imported.src) {
    url = imported.src;
  } else if (typeof imported === 'object' && imported.default) {
    url = typeof imported.default === 'string' ? imported.default : imported.default.src || '';
  } else {
    url = String(imported);
  }

  // Prepend base URL for local paths
  if (url && (url.startsWith('/') && !url.startsWith('//'))) {
    return toAbsoluteUrl(url);
  }

  return url;
}
