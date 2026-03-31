'use client';





// Required imports
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

import userReducer from "./Slice/userSlice";
import authReducer from "./Auth/authSlice";
import verificationReducer from "./User/verificationSlice";
import cartReducer from "./Slice/cartSlice";
import buyitnowSlicereducer from "./Slice/buyitnowSlice";
import wishlistSlicereducer from "./Slice/addtowishlistSlice";
import { tokenMiddleware } from "./middleWare/tokenMiddleWare";
import newUserdataSlice from "./newUserData/newUserdataSlice";

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
  ], 
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
