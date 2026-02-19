'use client';

  

import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false, // Tracks whether the user is logged in
    username: 'Guest', // Default value for username
    gst: '',
  },
  reducers: {
    setUsername: (state, action) => {
      console.log('State in component:', state, action.payload);
      state.username = action.payload; // Action updates the username
      state.isAuthenticated = true;
    },
    setGst: (state, action) => {
      state.gst = action.payload; // ✅ GST setter
    },
    logout: (state) => {
      state.username = 'Guest'; // Reset username to Guest on logout
      state.isAuthenticated = false;
       state.gst = ''; // ✅ Clear GST on logout
    },
  },
});

export const { setUsername, setGst, logout } = userSlice.actions;
export default userSlice.reducer;
