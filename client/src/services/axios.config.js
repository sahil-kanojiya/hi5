import axios from 'axios';
import { getToken, removeToken } from '../utils/localStorage';
import { removeAuth } from '../redux/slices/authSlice';
import store from '../redux/store';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: Number(import.meta.env.VITE_HI5_API_REQUEST_TIMEOUT),
  timeoutErrorMessage: 'The request timed out, please try again.',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getToken();
    if (accessToken && !config.url.startsWith('/auth')) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      const accessToken = getToken();

      if (!accessToken) {
        store.dispatch(removeAuth());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      removeToken();
      store.dispatch(removeAuth());
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (response?.status === 403 && response?.data?.error === 'Access Denied') {
      try {
        if (response?.data?.banUntil) {
          if (store.getState().auth.isAuthenticated) {
            removeToken();
            store.dispatch(removeAuth());
            window.location.href = '/login';
          } else {
            const banData = JSON.stringify({
              isBanned: true,
              banUntil: response.data.banUntil,
            });
            sessionStorage.setItem('banData', banData);
            window.location.href = '/banned';
          }
        } else {
          console.error(response?.data?.message || 'Access Denied.');
        }
      } catch (err) {
        console.error('Failed to process error data:', err);
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
