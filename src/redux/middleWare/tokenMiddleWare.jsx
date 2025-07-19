
import { refreshToken } from "../Auth/authThunks";

export const tokenMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  const state = getState();
  
  const { accessToken, refreshToken: refreshTokenValue } = state.auth; // Renamed for clarity

  let isAccessTokenExpired = false;

  if (accessToken) {
    try {
      // Split the JWT into its parts
      const tokenParts = accessToken.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      // Decode the payload (second part of the JWT)
      const decodedPayload = JSON.parse(atob(tokenParts[1]));

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      isAccessTokenExpired = decodedPayload.exp <= currentTime;
    } catch (error) {
      console.error("Error decoding access token:", error);
      isAccessTokenExpired = true; // Consider the token expired if there's an error
    }
  }

  if (isAccessTokenExpired && refreshTokenValue) {
    // Dispatch the action to refresh the token
    dispatch(refreshToken(refreshTokenValue));
  }

  return next(action);
};




