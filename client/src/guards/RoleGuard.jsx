import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoleGuard = ({ requiredRole, children }) => {
  const user = useSelector((state) => state.user.profile);
  const hasRequiredRole = user.role === requiredRole;

  if (!hasRequiredRole) {
    return <Navigate to="/*" />;
  }

  return children;
};

RoleGuard.propTypes = {
  requiredRole: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default RoleGuard;
