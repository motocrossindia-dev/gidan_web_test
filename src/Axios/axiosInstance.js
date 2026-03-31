'use client';


import axios from "axios";
import store from "../redux/store";
import { selectAccessToken } from "../redux/User/verificationSlice";
import { removeToken } from "../Services/Services/LocalStorageServices";
import { logout } from "../redux/Slice/userSlice";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = selectAccessToken(state);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Provide a temporary token for guests to prevent "credentials not provided" errors
      if (typeof window !== 'undefined') {
        let guestToken = localStorage.getItem('guest_token');
        if (!guestToken) {
          guestToken = `guest_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
          localStorage.setItem('guest_token', guestToken);
        }
        config.headers.Authorization = `Bearer ${guestToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const state = store.getState();
      const token = selectAccessToken(state);
      
      // ONLY redirect if we were previously logged in (token existed)
      // Otherwise, allow the guest to continue with their temporary session
      if (token) {
        console.warn("Unauthorized session! Logging out...");
        removeToken();
        store.dispatch(logout());
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;



