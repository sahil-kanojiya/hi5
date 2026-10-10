import MobileNavbar from './common/navbar/MobileNavbar';
import PropTypes from 'prop-types';
import Sidebar from './common/sidebar/Sidebar';
import MobileHeader from './common/header/MobileHeader';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center bg-gray-100 dark:bg-gray-900">
      <MobileHeader />
      <Sidebar />
      {children}
      <MobileNavbar />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
