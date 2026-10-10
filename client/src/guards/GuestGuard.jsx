import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Preloader from '../components/preloader/Preloader';

const GuestGuard = ({ children }) => {
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.user.profile);

  if (isInitializing) return <Preloader />;

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" />;
    } else if (user?.role === 'USER') {
      return <Navigate to="/home" />;
    } else if (user?.role === 'MODERATOR') {
      return <Navigate to="/moderator" />;
    } else {
      return <Navigate to="/*" />;
    }
  }

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestGuard;
