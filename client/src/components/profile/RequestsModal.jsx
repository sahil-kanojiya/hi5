import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import axiosInstance from '../../services/axios.config';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';

const RequestsModal = ({ isOpen, closeModal, type }) => {
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

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      if (type === 'SENT') {
        const response = await axiosInstance.get('/user/follow/sent/requests', {
          params: {
            page,
            size: 10,
          },
        });
        console.log(response.data);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setRequests((prevRequests) => [...prevRequests, ...response.data]);
        }
      } else if (type === 'RECEIVED') {
        const response = await axiosInstance.get('/user/follow/received/requests', {
          params: {
            page,
            size: 10,
          },
        });
        console.log(response.data);
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setRequests((prevRequests) => [...prevRequests, ...response.data]);
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
      setRequests([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, page, fetchRequests, type]);

  const loadMoreRequests = useCallback(() => {
    console.log('load more requests');
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore, setPage]);

  if (!isOpen) return null;

  const cancelRequestHandler = async (userId) => {
    console.log('user id allow' + userId);
    try {
      const response = await axiosInstance.delete(`/user/follow/cancel/${userId}`);
      console.log(response.data);
      if (response.status === 200) {
        toast.success('Follow request canceled successfully!');
        setRequests((prevRequests) => prevRequests.filter((req) => req.id !== userId));
      } else {
        toast.warn('Request processed, but check the response.');
      }
    } catch {
      toast.error('Something went wrong! Please try again.');
    }
  };

  const handleAllowClick = async (userId) => {
    console.log('user id allow' + userId);
    try {
      const response = await axiosInstance.post('/user/follow/allow', {
        userId,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success('Follow request accepted successfully!');
        setRequests((prevRequests) => prevRequests.filter((req) => req.id !== userId));
      } else {
        toast.warn('Request processed, but check the response.');
      }
    } catch {
      toast.error('Something went wrong! Please try again.');
    }
  };

  const handleDenyClick = async (userId) => {
    console.log('user id deny' + userId);
    try {
      const response = await axiosInstance.post('/user/follow/deny', {
        userId,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success('Follow request denied successfully.');
        setRequests((prevRequests) => prevRequests.filter((req) => req.id !== userId));
      } else {
        toast.warn('Request processed, but check the response.');
      }
    } catch {
      toast.error('Something went wrong! Please try again.');
    }
  };

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
            {type === 'SENT' && <h3 className="font-semibold">Sent Requests</h3>}
            {type === 'RECEIVED' && <h3 className="font-semibold">Received Requests</h3>}

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
              dataLength={requests.length}
              next={loadMoreRequests}
              hasMore={hasMore}
              loader={<></>}
              endMessage={<p className="text-center">No more requests</p>}
            >
              {requests.map((user) => (
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

                  {type === 'SENT' && (
                    <div className="ml-auto flex items-center justify-center gap-2">
                      <button
                        className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 sm:text-base"
                        onClick={() => {
                          cancelRequestHandler(user?.id);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {type === 'RECEIVED' && (
                    <div className="ml-auto flex items-center justify-center gap-2">
                      <button
                        className="rounded-md bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600 sm:text-base"
                        onClick={() => {
                          handleAllowClick(user?.id);
                        }}
                      >
                        Allow
                      </button>
                      <button
                        className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 sm:text-base"
                        onClick={() => {
                          handleDenyClick(user?.id);
                        }}
                      >
                        Deny
                      </button>
                    </div>
                  )}
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

RequestsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default RequestsModal;
