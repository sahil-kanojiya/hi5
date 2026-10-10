import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import Preloader from '../components/preloader/Preloader';

const AuthGuard = ({ children }) => {
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isInitializing) return <Preloader />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;
