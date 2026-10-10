import { PersonAdd, CheckCircle, HourglassEmpty, Email } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { follow, unfollow } from '../../services/api';
import PropTypes from 'prop-types';

const UserSearchCard = ({ user }) => {
  const myId = useSelector((state) => state?.user?.profile?.id);

  const [followStatus, setFollowStatus] = useState(user?.followStatus);

  const followStatusClickHandler = async () => {
    console.log(followStatus);
    if (followStatus === 'FOLLOWED') {
      try {
        const response = await unfollow(user?.id);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === 'NOT_FOLLOWED') {
      try {
        const response = await follow(user?.id);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === 'REQUEST_SENT') {
      console.log('already request sent');
    } else {
      console.log('Invalid Status');
    }
  };

  return (
    <>
      <div
        key={user?.id}
        className="flex items-center justify-between gap-5 rounded-lg bg-white p-3 shadow-md transition dark:bg-black dark:shadow-gray-900 sm:gap-0"
      >
        <div className="flex items-center gap-1 transition duration-150 min-[410px]:gap-4">
          <Link to={`/profile/${user?.id}`}>
            <div className="h-10 w-10 overflow-hidden rounded-full min-[410px]:h-12 min-[410px]:w-12">
              <img
                src={user?.profilePictureUrl}
                alt={`${user?.fullname}'s profile`}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
          <div>
            <p className="min-[410px]:text-md whitespace-nowrap break-normal text-sm font-semibold md:text-lg">
              {user?.fullname}
            </p>
            <p className="whitespace-nowrap break-normal text-sm text-gray-400">
              @{user?.username}
            </p>
          </div>
        </div>
        {user?.id != myId && (
          <div className="flex gap-1 min-[410px]:gap-2">
            <button
              onClick={followStatusClickHandler}
              className={`flex transform items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 min-[410px]:px-4 ${
                followStatus === 'FOLLOWED' ? 'bg-green-500 hover:bg-green-600' : ''
              } ${followStatus === 'NOT_FOLLOWED' ? 'bg-blue-500 hover:bg-blue-600' : ''} ${
                followStatus === 'REQUEST_SENT' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
              } `}
            >
              {followStatus === 'FOLLOWED' && (
                <>
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="hidden md:inline">Following</span>
                </>
              )}
              {followStatus === 'NOT_FOLLOWED' && (
                <>
                  <PersonAdd className="h-5 w-5 text-white" />
                  <span className="hidden md:inline">Follow</span>
                </>
              )}
              {followStatus === 'REQUEST_SENT' && (
                <>
                  <HourglassEmpty className="h-5 w-5 text-white" />
                  <span className="hidden md:inline">Requested</span>
                </>
              )}
            </button>

            <Link
              to={`/chat/${user?.id}`}
              className="shadow-mdflex flex transform items-center gap-2 rounded-full bg-gray-800 px-2 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-gray-900 min-[410px]:px-4"
            >
              <Email />
              <span className="hidden md:inline">Message</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

UserSearchCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string,
    followStatus: PropTypes.oneOf(['FOLLOWED', 'NOT_FOLLOWED', 'REQUEST_SENT']),
  }).isRequired,
};

export default UserSearchCard;
