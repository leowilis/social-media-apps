import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// State

interface LikesState {
  // List of post IDs liked by the current user.
  likedPostIds: number[];
}

// Persistence

const STORAGE_KEY = 'liked_post_ids';

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

// Saves the list of liked post IDs to localStorage. Fails silently if unavailable.
function saveToStorage(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

// Slice

const likesSlice = createSlice({
  name: 'likes',
  initialState: (): LikesState => ({ likedPostIds: [] }),
  reducers: {
    /**
     * Hydrates likes state from localStorage.
     * Call once on app mount (client-side only).
     */
    hydrateLikes(state) {
      state.likedPostIds = loadFromStorage();
    },

    /**
     * Adds a post ID to the liked list.
     * No-op if the post is already liked.
     */
    addLike(state, action: PayloadAction<number>) {
      if (!state.likedPostIds.includes(action.payload)) {
        state.likedPostIds.push(action.payload);
        saveToStorage(state.likedPostIds);
      }
    },

    /**
     * Removes a post ID from the liked list.
     */
    removeLike(state, action: PayloadAction<number>) {
      state.likedPostIds = state.likedPostIds.filter(
        (id) => id !== action.payload,
      );
      saveToStorage(state.likedPostIds);
    },
  },
});

export const { hydrateLikes, addLike, removeLike } = likesSlice.actions;
export default likesSlice.reducer;
