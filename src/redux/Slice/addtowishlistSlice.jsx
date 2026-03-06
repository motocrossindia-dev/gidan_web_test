'use client';

// redux/addtowishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array to store wishlist items
  pendingWishlistItem: null, // Item saved before login, added to wishlist after login
};

const addtowishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addtowishlist: (state, action) => {
      state.items.push(action.payload);
    },
    setPendingWishlistItem: (state, action) => {
      state.pendingWishlistItem = action.payload;
    },
    clearPendingWishlistItem: (state) => {
      state.pendingWishlistItem = null;
    },
  },
});

export const { addtowishlist, setPendingWishlistItem, clearPendingWishlistItem } = addtowishlistSlice.actions;
export default addtowishlistSlice.reducer;
