import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/images/logo/hi5.svg';
import SidebarItem from './SidebarItem';
import useLogout from '../../../../hooks/useLogout';
import { useDispatch, useSelector } from 'react-redux';
import {
  AddCircleRounded,
  DashboardRounded,
  HomeRounded,
  MessageRounded,
  MoreVertRounded,
  NotificationsRounded,
  PeopleRounded,
  SearchRounded,
  Report,
  SupervisorAccountRounded,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { toggleTheme } from '../../../../redux/slices/themeSlice';

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const logout = useLogout();

  const user = useSelector((state) => state.user.profile);

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const changeThemeClickHandler = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      {user?.role === 'USER' && (
        <div className="fixed left-0 top-0 z-10 hidden h-full flex-col justify-between bg-card p-4 md:flex md:w-20 md:items-center lg:w-52 lg:items-start xl:w-64">
          <Link to="/" className="mx-2 mb-8 mt-3 flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-10" />
            <p className="font-lobster text-4xl md:hidden lg:block">Hi5</p>
          </Link>

          <div className="w-full space-y-4 md:mt-3 lg:mt-7">
            <SidebarItem
              icon={
                <HomeRounded
                  sx={{
                    fontSize: { xs: 20, sm: 30, md: 35 },
                  }}
                />
              }
              label="Home"
              link="/home"
            />
            <SidebarItem
              icon={
                <SearchRounded
                  sx={{
                    fontSize: { xs: 20, sm: 30, md: 35 },
                  }}
                />
              }
              label="Search"
              link="/search"
            />
            <SidebarItem
              icon={
                <AddCircleRounded
                  sx={{
                    fontSize: { xs: 20, sm: 30, md: 35 },
                  }}
                />
              }
              label="Reels"
              link="/reels"
            />
            <SidebarItem
              icon={
                <MessageRounded
                  sx={{
                    fontSize: { xs: 20, sm: 30, md: 35 },
                  }}
                />
              }
              label="Messages"
              link="/chat"
            />
            <SidebarItem
              icon={
                <NotificationsRounded
                  sx={{
                    fontSize: { xs: 20, sm: 30, md: 35 },
                  }}
                />
              }
              label="Notifications"
              link="/notifications"
            />
          </div>

          <div className="relative my-4 mt-auto flex w-full items-center justify-between space-x-2 rounded-xl p-2 hover:bg-muted dark:hover:bg-gray-800">
            <div className="flex items-center justify-center lg:gap-2">
              <Link to={`/profile/${user.id}`}>
                <img
                  src={user.profilePictureUrl}
                  alt={`${user.username}'s profile image`}
                  className="h-8 w-8 rounded-full lg:h-10 lg:w-10"
                />
              </Link>
              <div className="flex flex-col gap-1">
                <span className="hidden w-20 truncate text-xs lg:block xl:w-32">
                  {user.fullname}
                </span>
                <span className="hidden w-20 truncate text-sm text-muted-foreground lg:block xl:w-32">
                  @{user.username}
                </span>
              </div>
            </div>
            <span className="hidden cursor-pointer text-2xl lg:block" onClick={toggleModal}>
              <MoreVertRounded />
            </span>

            {isModalOpen && (
              <div className="absolute bottom-11 z-50 hidden w-40 rounded-md bg-card p-2 shadow-lg lg:left-36 lg:block xl:left-48">
                <div className="flex flex-col">
                  <Link to="/settings">
                    <div className="cursor-pointer rounded-md p-2 hover:bg-muted dark:hover:bg-gray-800">
                      Settings
                    </div>
                  </Link>

                  <div
                    className="cursor-pointer rounded-md p-2 hover:bg-muted dark:hover:bg-gray-800"
                    onClick={logout}
                  >
                    <p>Logout</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {user?.role === 'MODERATOR' && (
        <div className="fixed left-0 top-0 z-10 hidden h-full flex-col justify-between bg-card p-4 md:flex md:w-20 md:items-center lg:w-52 lg:items-start xl:w-64">
          <Link to="/" className="mx-2 mb-8 mt-3 flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-10" />
            <p className="font-lobster text-4xl md:hidden lg:block">Hi5</p>
          </Link>
          <div className="w-full space-y-4 md:mt-3 lg:mt-7">
            <SidebarItem
              icon={<Report sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Reports"
              link="/moderator/moderate/content"
            />
            <SidebarItem
              icon={<PeopleRounded sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Users"
              link="/moderator/moderate/user"
            />
          </div>
          <div className="relative my-4 mt-auto flex w-full items-center justify-between space-x-2 rounded-xl p-2 hover:bg-muted dark:hover:bg-gray-800">
            <div className="hidden flex-col gap-1 pl-2 lg:flex">
              <span className="hidden w-20 truncate text-sm text-foreground lg:block xl:w-32">
                Moderator
              </span>
            </div>
            <span className="hidden cursor-pointer text-2xl md:block" onClick={toggleModal}>
              <MoreVertRounded />
            </span>
            {isModalOpen && (
              <div
                className="absolute bottom-11 z-50 hidden w-40 rounded-md bg-card p-2 shadow-lg md:block lg:left-36 xl:left-48"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md p-2 hover:bg-muted dark:hover:bg-gray-800"
                  onClick={changeThemeClickHandler}
                  aria-label="Toggle theme"
                >
                  <p>Theme</p>
                  {theme === 'dark' ? (
                    <LightMode className="block text-gray-200 transition-all duration-300" />
                  ) : (
                    <DarkMode className="block transition-all duration-300 dark:text-foreground" />
                  )}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted dark:hover:bg-gray-800"
                  onClick={logout}
                >
                  <p>Logout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {user?.role === 'ADMIN' && (
        <div className="fixed left-0 top-0 z-10 hidden h-full flex-col justify-between bg-card p-4 md:flex md:w-20 md:items-center lg:w-52 lg:items-start xl:w-64">
          <Link to="/" className="mx-2 mb-8 mt-3 flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-10" />
            <p className="font-lobster text-4xl md:hidden lg:block">Hi5</p>
          </Link>

          <div className="w-full space-y-4 md:mt-3 lg:mt-7">
            <SidebarItem
              icon={<DashboardRounded sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Dashboard"
              link="/admin/dashboard"
            />
            <SidebarItem
              icon={<Report sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Reports"
              link="/admin/moderate/content"
            />
            <SidebarItem
              icon={<PeopleRounded sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Users"
              link="/admin/moderate/user"
            />
            <SidebarItem
              icon={<SupervisorAccountRounded sx={{ fontSize: { xs: 20, sm: 30, md: 35 } }} />}
              label="Moderators"
              link="/admin/moderators"
            />
          </div>

          <div className="relative my-4 mt-auto flex w-full items-center justify-between space-x-2 rounded-xl p-2 hover:bg-muted dark:hover:bg-gray-800">
            <div className="hidden flex-col gap-1 pl-2 lg:flex">
              <span className="hidden w-20 truncate text-sm text-foreground lg:block xl:w-32">
                Admin
              </span>
            </div>
            <span className="hidden cursor-pointer text-2xl md:block" onClick={toggleModal}>
              <MoreVertRounded />
            </span>
            {isModalOpen && (
              <div
                className="absolute bottom-11 z-50 hidden w-40 rounded-md bg-card p-2 shadow-lg md:block lg:left-36 xl:left-48"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md p-2 hover:bg-muted dark:hover:bg-gray-800"
                  onClick={changeThemeClickHandler}
                  aria-label="Toggle theme"
                >
                  <p>Theme</p>
                  {theme === 'dark' ? (
                    <LightMode className="block text-gray-200 transition-all duration-300" />
                  ) : (
                    <DarkMode className="block transition-all duration-300 dark:text-foreground" />
                  )}
                </div>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-muted dark:hover:bg-gray-800"
                  onClick={logout}
                >
                  <p>Logout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
