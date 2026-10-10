import { Link } from 'react-router-dom';
import {
  Favorite,
  ChatBubble,
  PersonAdd,
  Email,
  Public,
  Notifications,
  DeleteOutline,
} from '@mui/icons-material';
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
        return <Favorite fontSize="small" className="text-red-500" />;

      case 'COMMENT_POST':
      case 'COMMENT_REEL':
        return <ChatBubble fontSize="small" className="text-blue-500" />;

      case 'FOLLOW':
      case 'FOLLOW_REQUEST':
      case 'FOLLOW_REQUEST_ACCEPT':
        return <PersonAdd fontSize="small" className="text-green-500" />;

      case 'NETWORK_NEW_POST':
      case 'NETWORK_NEW_REEL':
      case 'NETWORK_NEW_STORY':
        return <Public fontSize="small" className="text-purple-500" />;

      case 'MESSAGE':
        return <Email fontSize="small" className="text-yellow-500" />;

      default:
        return <Notifications fontSize="small" className="text-primary" />;
    }
  };

  const getMsg = (type, username) => {
    switch (type) {
      case 'LIKE_POST':
      case 'LIKE_REEL':
      case 'LIKE_STORY':
      case 'LIKE_COMMENT':
        return (
          <span>
            <span className="font-semibold text-foreground">@{username}</span> liked your{' '}
            {type.replace('LIKE_', '').toLowerCase()}
          </span>
        );

      case 'COMMENT_POST':
      case 'COMMENT_REEL':
        return (
          <span>
            <span className="font-semibold text-foreground">@{username}</span> commented on your{' '}
            {type.replace('COMMENT_', '').toLowerCase()}
          </span>
        );

      case 'FOLLOW':
        return (
          <span>
            <span className="font-semibold text-foreground">@{username}</span> started following you
          </span>
        );

      case 'FOLLOW_REQUEST':
        return (
          <span>
            <span className="font-semibold text-foreground">@{username}</span> sent you a follow
            request
          </span>
        );

      case 'FOLLOW_REQUEST_ACCEPT':
        return (
          <span>
            <span className="font-semibold text-foreground">@{username}</span> accepted your follow
            request
          </span>
        );

      case 'NETWORK_NEW_POST':
      case 'NETWORK_NEW_REEL':
      case 'NETWORK_NEW_STORY':
        return (
          <span>
            <span className="font-semibold text-foreground">@{username}</span> posted a new{' '}
            {type.replace('NETWORK_NEW_', '').toLowerCase()}
          </span>
        );

      default:
        return <span>You have a new notification</span>;
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto flex h-full w-full justify-center bg-background pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-2xl justify-center">
          <div className="my-0 flex w-full flex-col rounded-xl border-x border-border bg-card shadow-sm md:my-4 md:min-h-[auto] md:border-y">
            <div className="sticky top-0 z-10 rounded-t-xl border-b border-border bg-card/80 p-4 backdrop-blur-md md:p-6">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold tracking-tight text-foreground">Notifications</p>
                <button
                  className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground active:scale-95"
                  onClick={openDeleteModal}
                >
                  <DeleteOutline fontSize="small" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </div>
            </div>

            <div className="hide-scrollbar mb-10 flex flex-1 flex-col overflow-y-auto bg-card sm:mb-0">
              {!isLoading && notifications.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="rounded-full bg-muted p-4">
                    <Notifications fontSize="large" />
                  </div>
                  <p className="font-medium">You&apos;re all caught up!</p>
                  <p className="text-sm">No new notifications</p>
                </div>
              )}

              {!isLoading && notifications.length > 0 && (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification?.id}
                      className="group flex flex-col items-start justify-between p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="flex w-full items-start gap-3 sm:w-auto sm:gap-4">
                        <Link
                          to={`/profile/${notification?.userId}`}
                          className="relative h-12 w-12 shrink-0 rounded-full"
                        >
                          <img
                            src={notification.profilePictureUrl}
                            alt="Profile"
                            className="h-full w-full rounded-full border border-border object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                            {getIcon(notification.type)}
                          </div>
                        </Link>

                        <div className="flex flex-col pt-1">
                          <p className="text-sm leading-snug text-foreground/90">
                            {getMsg(notification.type, notification.username)}
                          </p>
                          <p className="mt-1 text-xs font-medium text-muted-foreground">
                            <TimeAgo date={notification.createdAt} />
                          </p>
                        </div>
                      </div>

                      {notification.type === 'FOLLOW_REQUEST' && (
                        <div className="ml-14 mt-3 flex gap-2 sm:ml-auto sm:mt-0">
                          <button
                            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                            onClick={() => handleAllowClick(notification?.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="rounded-md border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-muted"
                            onClick={() => handleDenyClick(notification?.id)}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {!isLoading && error === null && (
                    <div ref={loaderRef} className="flex h-12 items-center justify-center">
                      {hasMore && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      )}
                    </div>
                  )}

                  {!isLoading && error !== null && (
                    <div
                      ref={loaderRef}
                      className="flex h-16 items-center justify-center text-sm text-destructive"
                    >
                      Failed to load notifications.
                    </div>
                  )}
                </div>
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
