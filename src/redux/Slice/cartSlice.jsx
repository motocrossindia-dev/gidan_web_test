// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array to store cart items
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload); // Add item to cart
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
