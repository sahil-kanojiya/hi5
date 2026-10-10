import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Preloader from '../components/preloader/Preloader';

const GuestGuard = ({ children }) => {
  console.log('GuestGuard');

  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.user.profile);

  console.log('GuestGuard isAuthenticated :' + isAuthenticated);
  console.log('GuestGuard isInitializing :' + isInitializing);
  console.log('GuestGuard user :' + JSON.stringify(user));

  if (isInitializing) return <Preloader />;

  console.log(user?.role);

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      console.log('redirecting to: /admin');
      return <Navigate to="/admin" />;
    } else if (user?.role === 'USER') {
      console.log('redirecting to: /home');
      return <Navigate to="/home" />;
    } else if (user?.role === 'MODERATOR') {
      console.log('redirecting to: /moderator');
      return <Navigate to="/moderator" />;
    } else {
      console.log('redirecting to: /*');
      return <Navigate to="/*" />;
    }
  }

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestGuard;
