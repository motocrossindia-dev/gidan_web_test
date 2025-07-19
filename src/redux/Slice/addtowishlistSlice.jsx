// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array to store cart items
};

const addtowishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addtowishlist: (state, action) => {
      state.items.push(action.payload); // Add item to cart
    },
  },
});

export const { addtowishlist } = addtowishlistSlice.actions;
export default addtowishlistSlice.reducer;
