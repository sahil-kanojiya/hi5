import MobileNavItem from './MobileNavItem';
import { useSelector } from 'react-redux';
import {
  AddCircleRounded,
  DashboardRounded,
  HomeRounded,
  MessageRounded,
  NotificationsRounded,
  SearchRounded,
  Report,
  PeopleRounded,
  SupervisorAccountRounded,
} from '@mui/icons-material';

const MobileNavbar = () => {
  const user = useSelector((state) => state.user.profile);

  return (
    <>
      {user?.role === 'USER' && (
        <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between bg-card p-3 shadow-inner md:hidden">
          <div className="flex w-full items-center justify-around">
            <MobileNavItem
              icon={<HomeRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/home"
            />
            <MobileNavItem
              icon={<SearchRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/search"
            />
            <MobileNavItem
              icon={<AddCircleRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/reels"
            />
            <MobileNavItem
              icon={<MessageRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/chat"
            />
            <MobileNavItem
              icon={<NotificationsRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/notifications"
            />
          </div>
        </div>
      )}

      {(user?.role === 'MODERATOR' || user?.role === 'ADMIN') && (
        <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between bg-card p-3 shadow-inner md:hidden">
          <div className="flex w-full items-center justify-around">
            <MobileNavItem
              icon={<Report sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/moderator/moderate/content"
            />
            <MobileNavItem
              icon={<PeopleRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/moderator/moderate/user"
            />
          </div>
        </div>
      )}

      {user?.role === 'ADMIN' && (
        <div className="fixed bottom-0 left-0 z-10 flex w-full justify-between bg-card p-3 shadow-inner md:hidden">
          <div className="flex w-full items-center justify-around">
            <MobileNavItem
              icon={<DashboardRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/admin/dashboard"
            />
            <MobileNavItem
              icon={<Report sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/admin/moderate/content"
            />
            <MobileNavItem
              icon={<PeopleRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/admin/moderate/user"
            />
            <MobileNavItem
              icon={<SupervisorAccountRounded sx={{ fontSize: { xs: 25, sm: 30 } }} />}
              link="/admin/moderators"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
