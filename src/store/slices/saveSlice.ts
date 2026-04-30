import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// State

interface SavesState {
  // List of post IDs saved by the current user
  savedPostIds: number[];
}

// Persistence

const STORAGE_KEY = 'saved_post_ids';

function loadFromStorage(): number[] {
  // SSR-safe loader — returns empty array on server or parse failure.
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

// Persists saved post IDs to localStorage
function saveToStorage(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

// Slice

const savesSlice = createSlice({
  name: 'saves',
  initialState: (): SavesState => ({ savedPostIds: [] }),
  reducers: {
    /**
     * Hydrates saves state from localStorage.
     * Call once on app mount (client-side only).
     */
    hydrateSaves(state) {
      state.savedPostIds = loadFromStorage();
    },

    /**
     * Adds a post ID to the saved list.
     * No-op if the post is already saved.
     */
    addSave(state, action: PayloadAction<number>) {
      if (!state.savedPostIds.includes(action.payload)) {
        state.savedPostIds.push(action.payload);
        saveToStorage(state.savedPostIds);
      }
    },

    /**
     * Removes a post ID from the saved list.
     */
    removeSave(state, action: PayloadAction<number>) {
      state.savedPostIds = state.savedPostIds.filter(
        (id) => id !== action.payload,
      );
      saveToStorage(state.savedPostIds);
    },
  },
});

export const { hydrateSaves, addSave, removeSave } = savesSlice.actions;
export default savesSlice.reducer;
