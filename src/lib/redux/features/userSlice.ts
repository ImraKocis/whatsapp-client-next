import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/lib/api/user/types";

export interface UserSlice {
  user: User | null;
  deletingSession: boolean;
}

const initialState: UserSlice = {
  user: null,
  deletingSession: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    deleteUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
