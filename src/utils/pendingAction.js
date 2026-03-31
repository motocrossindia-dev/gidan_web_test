// Utility for saving pending cart/wishlist items before login redirect.
// Uses localStorage so it survives page navigation instantly.

const CART_KEY = "pendingCartAction";
const WISHLIST_KEY = "pendingWishlistAction";

/**
 * @param {object} payload - The product payload to add to guest cart.
 *   e.g. { prod_id: 5, quantity: 1, name: "Lily", price: 399, image: "..." }
 */
export const savePendingCartItem = (payload) => {
  if (typeof window === "undefined" || !payload) return;
  
  try {
    const existing = localStorage.getItem(CART_KEY);
    let cart = existing ? JSON.parse(existing) : [];
    if (!Array.isArray(cart)) cart = [];

    // Check if item already exists to update quantity instead of duplicate
    const id = payload.prod_id || payload.main_prod_id || payload.id;
    const index = cart.findIndex(item => (item.prod_id || item.main_prod_id || item.id) === id);

    if (index > -1) {
      cart[index].quantity = (cart[index].quantity || 1) + (payload.quantity || 1);
    } else {
      cart.push(payload);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Error saving to guest cart", e);
  }
};

export const savePendingWishlistItem = (payload) => {
  if (typeof window === "undefined" || !payload) return;
  
  try {
    const existing = localStorage.getItem(WISHLIST_KEY);
    let wishlist = existing ? JSON.parse(existing) : [];
    if (!Array.isArray(wishlist)) wishlist = [];

    const id = payload.prod_id || payload.main_prod_id || payload.id;
    if (!wishlist.find(item => (item.prod_id || item.main_prod_id || item.id) === id)) {
      wishlist.push(payload);
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.error("Error saving to guest wishlist", e);
  }
};

export const getPendingCartItem = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : (data ? [data] : []);
  } catch { return []; }
};

export const getPendingWishlistItem = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : (data ? [data] : []);
  } catch { return []; }
};

export const removeGuestCartItem = (id) => {
  if (typeof window === "undefined") return;
  try {
    const cart = getPendingCartItem();
    const updated = cart.filter(item => (item.prod_id || item.main_prod_id || item.id) !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
  } catch {}
};

export const clearPendingCartItem = () => {
  if (typeof window !== "undefined") localStorage.removeItem(CART_KEY);
};

export const clearPendingWishlistItem = () => {
  if (typeof window !== "undefined") localStorage.removeItem(WISHLIST_KEY);
};
