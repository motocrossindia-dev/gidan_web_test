



// Required imports
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web

import userReducer from "../redux/Slice/userSlice";
import authReducer from "../redux/Auth/authSlice";
import verificationReducer from "../redux/User/verificationSlice";
import cartReducer from "../redux/Slice/cartSlice";
import buyitnowSlicereducer from "../redux/Slice/buyitnowSlice";
import wishlistSlicereducer from "../redux/Slice/addtowishlistSlice";
import { tokenMiddleware } from "../redux/middleWare/tokenMiddleWare";
import newUserdataSlice from "../redux/newUserData/newUserdataSlice";

// Persistence configuration
const persistConfig = {
  key: "root", // Root key for the persisted state
  storage,
  whitelist: [
    "user",
    "auth",
    "cart",
    "wishlist",
    "verification",
    "newUsersdata",
  ], // Specify which slices to persist
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  verification: verificationReducer,
  cart: cartReducer,
  buyitnow: buyitnowSlicereducer,
  wishlist: wishlistSlicereducer,
  newUsersdata: newUserdataSlice,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer and middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serialization checks for redux-persist
    }).concat(tokenMiddleware),
});

// Export persistor to be used in the application
export const persistor = persistStore(store);

export default store;
