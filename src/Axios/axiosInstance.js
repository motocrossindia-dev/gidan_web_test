
import axios from "axios";
import store from "../../src/redux/store";
import { selectAccessToken } from "../redux/User/verificationSlice";
import { removeToken } from "../Services/Services/LocalStorageServices";
import { logout } from "../redux/Slice/userSlice";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add access token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = selectAccessToken(state);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple 401 handler (optional logout)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
      removeToken();
      store.dispatch(logout());
      window.location.href = "/"; // Optional: redirect to home/login
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
