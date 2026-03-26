export const notifyCartUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event("cartUpdated"));
    // Also trigger storage to sync across tabs
    localStorage.setItem('lastCartUpdate', Date.now().toString());
  }
};

export const notifyWishlistUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event("wishlistUpdated"));
    // Also trigger storage to sync across tabs
    localStorage.setItem('lastWishlistUpdate', Date.now().toString());
  }
};
