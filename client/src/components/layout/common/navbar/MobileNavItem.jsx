import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MobileNavItem = ({ icon, link }) => (
  <Link to={link}>
    <div className="flex cursor-pointer items-center text-2xl hover:text-muted-foreground">
      {icon}
    </div>
  </Link>
);

MobileNavItem.propTypes = {
  icon: PropTypes.element.isRequired,
  link: PropTypes.string.isRequired,
};

export default MobileNavItem;
