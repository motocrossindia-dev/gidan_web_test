


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      
      state.currentUser = action.payload.user;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.loading = false;
      state.error = null;
    },
    signInFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
    },
    signOutUserFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    verifyTokenStart: (state) => {
      state.loading = true;
    },
    verifyTokenSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    verifyTokenFail: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.access;
    },
    refreshTokenFail: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFail,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFail,
  verifyTokenStart,
  verifyTokenSuccess,
  verifyTokenFail,
  refreshTokenSuccess,
  refreshTokenFail,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;

// Selector specifically for accessToken
export default authSlice.reducer;
