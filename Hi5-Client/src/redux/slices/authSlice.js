import { createSlice } from '@reduxjs/toolkit';
import { getToken } from '../../utils/localStorage';

const initialState = {
  token: getToken() || null,
  isAuthenticated: false,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isInitializing = action.payload.isInitializing;
    },
    removeAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
  },
});

export const { setAuth, removeAuth } = authSlice.actions;

export default authSlice.reducer;
