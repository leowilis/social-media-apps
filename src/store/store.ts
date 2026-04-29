import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

/**
 * Global Redux store configuration.
 * Combines all feature reducers and applies default middleware.
 * Serializable check is disabled to allow non-serializable values if needed.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

/**
 * Root state type inferred from the store.
 * Use this for typed selectors.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Dispatch type for the store.
 * Use this for typed dispatch (e.g., in hooks like useDispatch).
 */
export type AppDispatch = typeof store.dispatch;