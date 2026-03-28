import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (!state.userInfo.wishlist) state.userInfo.wishlist = [];
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    updateWishlist: (state, action) => {
      if (state.userInfo) {
         state.userInfo.wishlist = action.payload;
         localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, updateWishlist, logout } = authSlice.actions;
export default authSlice.reducer;
