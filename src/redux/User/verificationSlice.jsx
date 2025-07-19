
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // The entire user data, including tokens, will be stored here
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setVerifiedUser: (state, action) => {
      // Combine user data and tokens within a single `user` object
      state.user = {
        ...action?.payload?.data?.user,
        ...action?.payload?.data?.token, // Include tokens inside the user object
      };
    },
    resetVerification: (state) => {
      state.user = null; // Reset user to null when verification is reset
    },
  },
});

export const { setVerifiedUser, resetVerification } = verificationSlice.actions;
export const selectAccessToken = (state) => state.verification.user?.access || null;
export const selectRefreshToken =(state) => state?.verification?.user?.refresh||null

export default verificationSlice.reducer;
