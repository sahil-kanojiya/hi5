import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setToken } from '../../utils/localStorage';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/slices/authSlice';

const LoginOAuth2Handler = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log('AuthToken: ' + token);
    if (token) {
      setToken(token);
      dispatch(
        setAuth({
          isAuthenticated: false,
          isInitializing: false,
          token,
        })
      );
    } else {
      navigate('/login');
    }
  });

  return null;
};

export default LoginOAuth2Handler;
