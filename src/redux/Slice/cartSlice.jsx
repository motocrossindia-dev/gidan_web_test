'use client';

// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array to store cart items
  pendingCartItem: null, // Item saved before login, added to cart after login
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload); // Add item to cart
    },
    setPendingCartItem: (state, action) => {
      state.pendingCartItem = action.payload;
    },
    clearPendingCartItem: (state) => {
      state.pendingCartItem = null;
    },
    setCartItems: (state, action) => {
      state.items = action.payload || [];
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload && item.main_prod_id !== action.payload);
    },
  },
});

export const { addToCart, setPendingCartItem, clearPendingCartItem, setCartItems, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
