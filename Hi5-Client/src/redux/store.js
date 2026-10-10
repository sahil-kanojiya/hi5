import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

const loggerMiddleware = (store) => (next) => (action) => {
  console.log('dispatching', action);
  console.log('previous state', store.getState());

  const result = next(action);

  console.log('next state', store.getState());
  return result;
};

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export default store;
