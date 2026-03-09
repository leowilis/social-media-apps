import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "AUTH_SLICE",
  initialState: initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setToken, setIsLoggedIn } = authSlice.actions;
