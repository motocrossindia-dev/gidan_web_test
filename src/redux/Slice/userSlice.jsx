  

import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false, // Tracks whether the user is logged in
    username: 'Guest', // Default value for username
  },
  reducers: {
    setUsername: (state, action) => {
      console.log('State in component:', state, action.payload);
      state.username = action.payload; // Action updates the username
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = 'Guest'; // Reset username to Guest on logout
      state.isAuthenticated = false;
    },
  },
});

export const { setUsername, logout } = userSlice.actions;
export default userSlice.reducer;
