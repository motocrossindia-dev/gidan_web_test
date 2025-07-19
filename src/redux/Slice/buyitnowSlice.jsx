// redux/buyitnowSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array to store cart items
};

const buyitnowSlice = createSlice({
  name: 'buyitnow',
  initialState,
  reducers: {
    buyitnow: (state, action) => {
      state.items.push(action.payload); // Add item to cart
    },
  },
});

export const { buyitnow } = buyitnowSlice.actions;
export default buyitnowSlice.reducer;
