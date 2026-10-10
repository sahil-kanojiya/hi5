import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SidebarItem = ({ icon, label, link }) => (
  <Link
    to={link}
    className="flex cursor-pointer items-center justify-center rounded p-2 hover:bg-muted dark:hover:bg-gray-800 lg:justify-start"
  >
    <div className="flex items-center justify-center text-xl">
      <span className="lg:mr-2">{icon}</span>
      <span className="hidden lg:block">{label}</span>
    </div>
  </Link>
);

SidebarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default SidebarItem;
