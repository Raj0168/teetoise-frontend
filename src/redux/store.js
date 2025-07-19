// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productSlice";

// Configuration for persisting the user slice
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "token", "refreshToken"], // Persist these fields
};

// Create a persisted reducer for the user slice
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Persisted user reducer
    products: productsReducer, // Non-persisted products reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
