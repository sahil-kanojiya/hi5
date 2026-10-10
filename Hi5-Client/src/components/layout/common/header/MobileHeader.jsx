import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../../assets/images/logo/Hi5.svg';
import { Link } from 'react-router-dom';
import { toggleTheme } from '../../../../redux/slices/themeSlice';
import { DarkMode, LightMode } from '@mui/icons-material';
import useLogout from '../../../../hooks/useLogout';

const MobileHeader = () => {
  const user = useSelector((state) => state.user.profile);

  const logout = useLogout();

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const changeThemeClickHandler = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-10 w-full bg-white shadow-md dark:bg-black md:hidden">
        <header className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Hi5 Logo" className="h-10 w-10" />
            <h1 className="font-lobster text-2xl">Hi5</h1>
          </div>
          {user?.role === 'USER' && (
            <div className="mr-1 flex items-center justify-center">
              <Link to={`/profile/${user.id}`}>
                <img src={user.profilePictureUrl} alt="Profile" className="h-8 w-8 rounded-full" />
              </Link>
            </div>
          )}
          {(user?.role === 'MODERATOR' || user?.role === 'ADMIN') && (
            <div className="flex gap-2">
              <button
                className="flex cursor-pointer items-center justify-center rounded-md bg-gray-200 p-2 transition-all duration-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={changeThemeClickHandler}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <LightMode className="text-gray-200 transition-all duration-300" />
                ) : (
                  <DarkMode className="text-gray-800 transition-all duration-300 dark:text-gray-200" />
                )}
              </button>

              <button
                className="rounded-md bg-red-500 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </header>
      </div>
    </>
  );
};

export default MobileHeader;
