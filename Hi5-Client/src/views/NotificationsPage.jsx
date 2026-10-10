import { Link } from 'react-router-dom';
import { Favorite, ChatBubble, PersonAdd, Email, Public, Notifications } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../services/axios.config';
import DeleteConfirmationModal from '../components/modal/DeleteConfirmationModal';
import TimeAgo from '../components/common/TimeAgo';
import { useWebSocket } from '../socket/WebSocketProvider';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const userId = useSelector((state) => state?.user?.profile?.id);

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  useEffect(() => {
    if (isConnected) {
      let notificationSubscription;
      try {
        notificationSubscription = subscribeTopic(`/notification/${userId}`, (message) => {
          const msg = JSON.parse(message);
          setNotifications((prev) => {
            return [msg, ...prev];
          });
        });
      } catch (e) {
        console.log('error:' + e);
      }
      return () => {
        unsubscribeTopic(notificationSubscription);
      };
    }
  }, [userId, isConnected, subscribeTopic, unsubscribeTopic]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/notification', {
        params: {
          page,
          size: 10,
        },
      });
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prevNotifications) => [...prevNotifications, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    setNotifications([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [page, fetchNotifications]);

  const loadMoreComments = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef?.current);
    };
  }, [loadMoreComments]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => {
    if (notifications?.length > 0) {
      setIsDeleteModalOpen(true);
    } else {
      toast.error('No notifications to delete!');
    }
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete('/notification');
      console.log(response);
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting story: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const handleAllowClick = async (notificationId) => {
    try {
      const response = await axiosInstance.post('/user/follow/allow', {
        notificationId,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success('Follow request accepted successfully!');
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== notificationId)
        );
      } else {
        toast.warn('Request processed, but check the response.');
      }
    } catch {
      toast.error('Something went wrong! Please try again.');
    }
  };

  const handleDenyClick = async (notificationId) => {
    try {
      const response = await axiosInstance.post('/user/follow/deny', {
        notificationId,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success('Follow request denied successfully.');
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== notificationId)
        );
      } else {
        toast.warn('Request processed, but check the response.');
      }
    } catch {
      toast.error('Something went wrong! Please try again.');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'LIKE_POST':
      case 'LIKE_REEL':
      case 'LIKE_STORY':
      case 'LIKE_COMMENT':
        return <Favorite className="text-red-500" />;

      case 'COMMENT_POST':
      case 'COMMENT_REEL':
        return <ChatBubble className="text-blue-500" />;

      case 'FOLLOW':
      case 'FOLLOW_REQUEST':
      case 'FOLLOW_REQUEST_ACCEPT':
        return <PersonAdd className="text-green-500" />;

      case 'NETWORK_NEW_POST':
      case 'NETWORK_NEW_REEL':
      case 'NETWORK_NEW_STORY':
        return <Public className="text-purple-500" />;

      case 'MESSAGE':
        return <Email className="text-yellow-500" />;

      default:
        return <Notifications className="text-gray-500" />;
    }
  };

  const getMsg = (type, username) => {
    switch (type) {
      case 'LIKE_POST':
      case 'LIKE_REEL':
      case 'LIKE_STORY':
      case 'LIKE_COMMENT':
        return `@${username} liked your ${type.replace('LIKE_', '').toLowerCase()}`;

      case 'COMMENT_POST':
      case 'COMMENT_REEL':
        return `@${username} commented on your ${type.replace('COMMENT_', '').toLowerCase()}`;

      case 'FOLLOW':
        return `@${username} started following you`;

      case 'FOLLOW_REQUEST':
        return `@${username} sent you a follow request`;

      case 'FOLLOW_REQUEST_ACCEPT':
        return `@${username} accepted your follow request`;

      case 'NETWORK_NEW_POST':
      case 'NETWORK_NEW_REEL':
      case 'NETWORK_NEW_STORY':
        return `@${username} posted a new ${type.replace('NETWORK_NEW_', '').toLowerCase()}`;

      default:
        return 'You have a new notification';
    }
  };

  // const getLink = (type, relevantId, userId) => {
  //   switch (type) {
  //     case "LIKE_POST":
  //     case "COMMENT_POST":
  //     case "NETWORK_NEW_POST":
  //       return (
  //         <Link
  //           to={`/share/post/${relevantId}`}
  //           className="ml-auto text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-500 text-xs sm:text-sm"
  //         >
  //           View
  //         </Link>
  //       );
  //     case "LIKE_REEL":
  //     case "COMMENT_REEL":
  //     case "NETWORK_NEW_REEL":
  //       return (
  //         <Link
  //           to={`/share/reel/${relevantId}`}
  //           className="ml-auto text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-500 text-xs sm:text-sm"
  //         >
  //           View
  //         </Link>
  //       );
  //     case "LIKE_STORY":
  //     case "LIKE_COMMENT":
  //     case "FOLLOW":
  //     case "FOLLOW_REQUEST":
  //     case "FOLLOW_REQUEST_ACCEPT":
  //     case "NETWORK_NEW_STORY":
  //       return (
  //         <Link
  //           to={`/profile/${userId}`}
  //           className="ml-auto text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-500 text-xs sm:text-sm"
  //         >
  //           View
  //         </Link>
  //       );
  //   }
  // };

  return (
    <MainLayout>
      <div className="mx-auto flex h-full w-full justify-center pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-3xl justify-center">
          <div className="my-0 flex w-full flex-col justify-center rounded-lg bg-white px-4 shadow-lg dark:bg-black md:my-4">
            <div className="sticky top-0 z-0 rounded-md p-2 md:p-6">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Notifications
                </p>
                <button
                  className="text-md rounded-md bg-red-500 px-2 py-1 text-white transition hover:bg-red-600 sm:px-3 sm:py-2"
                  onClick={openDeleteModal}
                >
                  Remove All
                </button>
              </div>
            </div>
            <div className="h-1 rounded-lg bg-slate-200 dark:bg-slate-800 sm:mx-3"></div>
            <div className="hide-scrollbar mb-10 mt-0 flex flex-1 flex-col space-y-3 overflow-y-auto pb-4 min-[450px]:p-4 sm:mb-3">
              {!isLoading && notifications.length === 0 && (
                <div className="flex flex-1 items-center justify-center">
                  <p>No Notifications</p>
                </div>
              )}
              {!isLoading && notifications.length > 0 && (
                <>
                  {notifications.map((notification) => (
                    <div
                      key={notification?.id}
                      className="flex flex-col items-start justify-between rounded-lg bg-white p-4 shadow-md transition-colors hover:bg-gray-200 dark:bg-black dark:shadow-gray-900 dark:hover:bg-gray-800 sm:flex-row sm:gap-4"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Link
                          to={`/profile/${notification?.userId}`}
                          className="avatar h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12"
                        >
                          <img
                            src={notification.profilePictureUrl}
                            alt="Profile"
                            className="h-full w-full rounded-full object-cover"
                          />
                        </Link>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="flex flex-col gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 sm:flex-row sm:text-base">
                              <span className="flex items-center gap-2">
                                {getIcon(notification.type)}
                                {notification.fullname}
                              </span>
                              <span className="font-normal text-gray-600 dark:text-gray-400">
                                {getMsg(notification.type, notification.username)}
                              </span>
                            </p>

                            <p className="text-xs text-gray-500 sm:text-sm">
                              <TimeAgo date={notification.createdAt} />
                            </p>
                          </div>
                        </div>
                      </div>
                      {notification.type === 'FOLLOW_REQUEST' ? (
                        <div className="ml-auto flex gap-2">
                          <button
                            className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 sm:text-base"
                            onClick={() => {
                              handleAllowClick(notification?.id);
                            }}
                          >
                            Allow
                          </button>
                          <button
                            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 sm:text-base"
                            onClick={() => {
                              handleDenyClick(notification?.id);
                            }}
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        // <>
                        //   {getLink(
                        //     notification.type,
                        //     notification.relevantId,
                        //     notification?.userId
                        //   )}
                        // </>
                        <></>
                      )}
                    </div>
                  ))}
                  {!isLoading && error === null && (
                    <div ref={loaderRef} className="flex h-11 items-center justify-center"></div>
                  )}
                  {!isLoading && error !== null && (
                    <div
                      ref={loaderRef}
                      className="flex h-16 items-center justify-center text-white"
                    >
                      Something error occured.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="NOTIFICATIONS"
      />
    </MainLayout>
  );
};

export default NotificationsPage;
