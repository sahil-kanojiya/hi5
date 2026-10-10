import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { removeAuth } from '../redux/slices/authSlice';
import { removeUser } from '../redux/slices/userSlice';
import { removeToken } from '../utils/localStorage';

const useLogout = () => {
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    removeToken();

    dispatch(removeAuth());
    dispatch(removeUser());
  }, [dispatch]);

  return logout;
};

export default useLogout;
