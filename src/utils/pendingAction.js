// Utility for saving pending cart/wishlist items before login redirect.
// Uses localStorage so it survives page navigation instantly without any
// redux-persist rehydration timing issues.
// Stores the full API payload so each component controls its own format.

const CART_KEY = "pendingCartAction";
const WISHLIST_KEY = "pendingWishlistAction";

/**
 * @param {object} payload - The exact payload to POST to /order/cart/
 *   e.g. { main_prod_id: 5 } or { prod_id: 5, quantity: 2 }
 */
export const savePendingCartItem = (payload) => {
  if (typeof window !== "undefined" && payload) {
    localStorage.setItem(CART_KEY, JSON.stringify(payload));
  }
};

/**
 * @param {object} payload - The exact payload to POST to /order/wishlist/
 *   e.g. { main_prod_id: 5 } or { prod_id: 5 }
 */
export const savePendingWishlistItem = (payload) => {
  if (typeof window !== "undefined" && payload) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(payload));
  }
};

export const getPendingCartItem = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const getPendingWishlistItem = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const clearPendingCartItem = () => {
  if (typeof window !== "undefined") localStorage.removeItem(CART_KEY);
};

export const clearPendingWishlistItem = () => {
  if (typeof window !== "undefined") localStorage.removeItem(WISHLIST_KEY);
};
