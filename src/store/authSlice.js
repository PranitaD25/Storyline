import { createSlice, isAction } from "@reduxjs/toolkit";

const initialState = {
  status: false, //is user currently authenticated or not};
  userData: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    //accepts object of userData
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

//exporting for components to directly use methods
export const { login, logout } = authSlice.actions;

//exporting for store to use reducer
export default authSlice.reducer;
