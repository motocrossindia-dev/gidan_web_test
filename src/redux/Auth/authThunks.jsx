import axios from "axios";
import {
  verifyTokenStart,
  verifyTokenSuccess,
  verifyTokenFail,
  refreshTokenSuccess,
  refreshTokenFail,
} from "./authSlice";

const API_URL = `${process.env.REACT_APP_API_URL}/api/token/`;

export const verifyToken = (token) => async (dispatch) => {
  dispatch(verifyTokenStart());
  try {
    await axios.post(`${API_URL}/verify/`, { token });
    dispatch(verifyTokenSuccess());
  } catch (error) {
    dispatch(verifyTokenFail(error.response?.data?.detail || "Token verification failed"));
  }
};

export const refreshToken = (refreshToken) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/refresh/`, { refresh: refreshToken });
    dispatch(refreshTokenSuccess(response.data));
  } catch (error) {
    dispatch(refreshTokenFail(error.response?.data?.detail || "Token refresh failed"));
  }
};
