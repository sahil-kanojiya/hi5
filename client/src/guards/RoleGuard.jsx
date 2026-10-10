import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoleGuard = ({ requiredRole, children }) => {
  console.log('RoleGuard');

  const user = useSelector((state) => state.user.profile);

  console.log('RoleGuard user :' + JSON.stringify(user));
  console.log('RoleGuard requiredRole :' + requiredRole);

  console.log('user role:' + user.role);
  const hasRequiredRole = user.role === requiredRole;

  console.log(user.role + ':==:' + requiredRole);

  if (!hasRequiredRole) {
    console.log('not have requiredRole redirecting to: /*');
    return <Navigate to="/*" />;
  }

  return children;
};

RoleGuard.propTypes = {
  requiredRole: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default RoleGuard;
