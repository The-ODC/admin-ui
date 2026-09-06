import { createSlice } from "@reduxjs/toolkit";
import { adminSignInThunk } from "../../thunkServices/auth";
import { cookies } from "TheOdcMfUI/utility";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
const currentTheme = cookies.getCookie("theODC_admin_theme") || "dark";
const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userSignIn: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      cookies.setCookie("admin_auth_token", action.payload.token, {
        maxAgeDays: 1,
        path: "/",
        sameSite: "Lax",
      });
      cookies.setCookie("admin_id", action.payload.admin.id, {
        maxAgeDays: 1,
        path: "/",
        sameSite: "Lax",
      });
      cookies.setCookie("theODC_admin_theme", currentTheme, {
        maxAgeDays: 1,
        path: "/",
      });
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminSignInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignInThunk.fulfilled, (state, action) => {
        console.log("User signed in:", action);
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(adminSignInThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { userSignIn } = authSlice.actions;

export default authSlice.reducer;
