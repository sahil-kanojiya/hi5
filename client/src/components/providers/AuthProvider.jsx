import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, removeAuth } from '../../redux/slices/authSlice';
import PropTypes from 'prop-types';
import { getMe } from '../../services/api';
import { setUser } from '../../redux/slices/userSlice';
import { removeToken } from '../../utils/localStorage';

const AuthContext = ({ children }) => {
  console.log('AuthContext');

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const checkTokenValidity = async () => {
      console.log('Auth:' + token);
      try {
        if (token) {
          const res = await getMe();
          if (res.status === 200) {
            const userData = res.data;
            dispatch(
              setUser({
                id: userData?.id,
                email: userData?.email,
                username: userData?.username,
                role: userData?.role,
                fullname: userData?.fullname,
                profilePictureUrl: userData?.profilePictureUrl,
              })
            );
            dispatch(
              setAuth({
                token,
                isAuthenticated: true,
                isInitializing: false,
              })
            );
          } else {
            throw new Error('Invalid token');
          }
        } else {
          throw new Error('Token not found');
        }
      } catch (e) {
        console.error('Error while checking token validity', e);
        removeToken();
        dispatch(removeAuth());
      }
    };
    checkTokenValidity();
  }, [token, dispatch]);

  return <>{children}</>;
};

AuthContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
