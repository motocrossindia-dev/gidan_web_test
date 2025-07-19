import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const newUserdataSlice = createSlice({
  name: "newUsersdata",
  initialState,
  reducers: {
    storenewData: (state, action) => {
      state.data = action.payload;
    },
    clearnewData: (state) => {
      state.data = null;
    },
  },
});

export const { storenewData, clearnewData } = newUserdataSlice.actions;

export default newUserdataSlice.reducer;
