import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse } from "@/app/actions/auth/types";

export interface AuthSlice {
  auth: AuthResponse | null;
}

const initialState: AuthSlice = {
  auth: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<AuthResponse | null>) => {
      state.auth = action.payload;
    },
    clear: (state) => {
      state.auth = null;
    },
  },
});

export const { set, clear } = authSlice.actions;

export default authSlice.reducer;
