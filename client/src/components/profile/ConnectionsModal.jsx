import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axiosInstance from '../../services/axios.config';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const ConnectionsModal = ({ isOpen, closeModal, type }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      if (type === 'FOLLOWER') {
        const response = await axiosInstance.get('/user/followers', {
          params: {
            page,
            size: 10,
          },
        });
        console.log(response.data);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...response.data]);
        }
      } else if (type === 'FOLLOWING') {
        const response = await axiosInstance.get('/user/followings', {
          params: {
            page,
            size: 10,
          },
        });
        console.log(response.data);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...response.data]);
        }
      } else {
        throw Error('Not Valid Type.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, type]);

  useEffect(() => {
    if (isOpen) {
      setUsers([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      setIsLoading(true);
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, page, fetchRequests, type]);

  const loadMoreUsers = useCallback(() => {
    console.log('load more requests');
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore, setPage]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleOutsideClick}
      >
        <div
          className={`w-full max-w-md transform rounded-lg border border-gray-500 bg-card p-4 shadow-lg transition-transform duration-300 sm:w-3/4 md:w-2/3 lg:w-1/2 ${
            isOpen ? 'scale-100' : 'scale-95'
          }`}
        >
          <div className="mb-4 flex items-center justify-between text-xl">
            {type === 'FOLLOWER' && <h3 className="font-semibold">Followers</h3>}
            {type === 'FOLLOWING' && <h3 className="font-semibold">Followings</h3>}

            <button
              onClick={closeModal}
              className="text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-gray-100"
            >
              <CloseRoundedIcon
                sx={{
                  fontSize: { xs: 25, sm: 28, md: 30 },
                }}
                className="text-muted-foreground transition duration-200 hover:text-red-500"
              />
            </button>
          </div>
          <div className="hide-scrollbar mb-4 max-h-60 overflow-y-auto rounded-lg px-2 py-1">
            <InfiniteScroll
              dataLength={users.length}
              next={loadMoreUsers}
              hasMore={hasMore}
              loader={<></>}
              endMessage={<p className="text-center">No more requests</p>}
            >
              {users.map((user) => (
                <div
                  key={user?.id}
                  className="flex items-center justify-between gap-5 rounded-lg bg-card p-3 transition sm:gap-0"
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
                      <p className="whitespace-nowrap break-normal text-sm text-muted-foreground">
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
            {!isLoading && error && <p className="text-center text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

ConnectionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ConnectionsModal;
