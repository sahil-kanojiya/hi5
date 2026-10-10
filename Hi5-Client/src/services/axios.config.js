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

    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    console.log('Request Headers:', config.headers);
    console.log('Request Data:', config.data);

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response Data:', response.data);
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    return response;
  },
  async (error) => {
    const { response } = error;

    console.error('Error Response Data:', response?.data);
    console.error('Error Response Status:', response?.status);

    if (response && response.status === 401) {
      const accessToken = getToken();

      if (!accessToken) {
        console.log('Access token is missing.');
        store.dispatch(removeAuth());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      console.error('Token expired.');
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
