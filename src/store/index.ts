import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/slices/authSlice';
import likesReducer from '@/store/slices/likeSlice';
import savesReducer from '@/store/slices/saveSlice';

/**
 * Global Redux store configuration.
 * Combines all feature reducers and uses Redux Toolkit's default middleware.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    likes: likesReducer,
    saves: savesReducer,
  },
});

// Root state type inferred from the store.
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type for the store.
export type AppDispatch = typeof store.dispatch;
