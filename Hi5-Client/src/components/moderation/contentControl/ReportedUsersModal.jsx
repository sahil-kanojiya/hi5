import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../../services/axios.config';
import { CloseRounded } from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';

const ReportedUsersModal = ({ isOpen, closeModal, type, relevantId, reason }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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
      const response = await axiosInstance.get('/moderate/report-users', {
        params: {
          reportType: type,
          relevantId,
          reportReason: reason,
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, type, relevantId, reason]);

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
          className={`w-full max-w-md transform rounded-lg border border-gray-500 bg-white p-4 shadow-lg transition-transform duration-300 dark:bg-black sm:w-3/4 md:w-2/3 lg:w-1/2 ${
            isOpen ? 'scale-100' : 'scale-95'
          }`}
        >
          <div className="mb-4 flex items-center justify-between text-xl">
            <h2 className="text-lg font-semibold">Users</h2>
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <CloseRounded
                sx={{
                  fontSize: { xs: 25, sm: 28, md: 30 },
                }}
                className="text-gray-500 transition duration-200 hover:text-red-500"
              />
            </button>
          </div>
          <div className="hide-scrollbar max-h-60 overflow-y-auto rounded-lg">
            <InfiniteScroll
              dataLength={users.length}
              next={loadMoreUsers}
              hasMore={hasMore}
              loader={<></>}
              endMessage={<p className="text-center">No more users</p>}
            >
              {users.map((user) => (
                <div
                  key={user?.id}
                  className="flex items-center justify-between gap-5 rounded-lg bg-white p-3 transition dark:bg-black sm:gap-0"
                >
                  <div className="flex items-center gap-1 transition duration-150 min-[410px]:gap-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full min-[410px]:h-12 min-[410px]:w-12">
                      <img
                        src={user?.profilePictureUrl}
                        alt={`${user?.fullname}'s profile`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="min-[410px]:text-md whitespace-nowrap break-normal text-sm font-semibold md:text-lg">
                        {user?.fullname}
                      </p>
                      <p className="whitespace-nowrap break-normal text-sm text-gray-400">
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

ReportedUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  relevantId: PropTypes.string.isRequired,
  reason: PropTypes.string.isRequired,
};

export default ReportedUsersModal;
