import PropTypes from 'prop-types';
import { Toaster, toast as t } from 'react-hot-toast';
import { useEffect } from 'react';
import { useWebSocket } from '../../socket/WebSocketProvider';
import { useSelector } from 'react-redux';
import {
  Favorite,
  PostAdd,
  PlayCircle,
  Collections,
  Image,
  ChatBubble,
  CheckCircle,
  PersonAdd,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const ToastProvider = ({ children }) => {
  const userId = useSelector((state) => state?.user?.profile?.id);
  const role = useSelector((state) => state?.user?.profile?.role);
  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      if (role !== 'USER') {
        return;
      }
      let notificationSubscription;
      let chatSubscription;
      try {
        notificationSubscription = subscribeTopic(`/notification/${userId}`, (message) => {
          const msg = JSON.parse(message);
          const pathname = window.location.pathname;
          if (pathname == '/notifications') {
            return;
          }
          const type = msg?.type;
          switch (type) {
            case 'NETWORK_NEW_POST':
            case 'NETWORK_NEW_REEL':
            case 'NETWORK_NEW_STORY':
              return NewContentNotification(type, msg?.username);
            case 'LIKE_POST':
            case 'LIKE_REEL':
            case 'LIKE_STORY':
            case 'LIKE_COMMENT':
              return LikeNotification(type, msg?.username);
            case 'COMMENT_POST':
            case 'COMMENT_REEL':
              return CommentNotification(type, msg?.username);
            case 'FOLLOW':
            case 'FOLLOW_REQUEST':
            case 'FOLLOW_REQUEST_ACCEPT':
              return FollowNotification(type, msg?.username);
          }
        });
        chatSubscription = subscribeTopic(`/chat/${userId}`, (message) => {
          const msg = JSON.parse(message);
          const pathname = window.location.pathname;
          if (pathname != `/chat/${msg.senderUserId}`) {
            MessageToast(msg);
          }
        });
      } catch (e) {
        console.log('error:' + e);
      }
      return () => {
        if (role !== 'USER') {
          return;
        }
        unsubscribeTopic(notificationSubscription);
        unsubscribeTopic(chatSubscription);
      };
    }
  }, [userId, role, isConnected, subscribeTopic, unsubscribeTopic]);

  return (
    <>
      {children}
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const GeneralToast = (data) => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
      } pointer-events-auto flex w-max rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
    >
      <div className="w- flex-1 p-4">
        <p className="text-center text-sm font-medium text-gray-900 dark:text-gray-100">{data}</p>
      </div>
    </div>
  ));
};

export const PostCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
      } pointer-events-auto flex w-max items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
    >
      <CheckCircle className="text-green-500 dark:text-green-400" />
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Post Created Successfully!
      </p>
    </div>
  ));
};

export const ReelCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
      } pointer-events-auto flex w-max items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
    >
      <CheckCircle className="text-blue-500 dark:text-blue-400" />
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Reel Created Successfully!
      </p>
    </div>
  ));
};

export const StoryCreatedToast = () => {
  t.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
      } pointer-events-auto flex w-max items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
    >
      <CheckCircle className="text-purple-500 dark:text-purple-400" />
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Story Added Successfully!
      </p>
    </div>
  ));
};

export const MessageToast = (messageData) => {
  t.custom((t) => (
    <Link to={`/chat/${messageData?.senderUserId}`}>
      <div
        className={`${
          t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
        } pointer-events-auto flex w-[320px] max-w-xs flex-col rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
      >
        <div className="flex items-center space-x-2 sm:hidden">
          <ChatBubble fontSize="small" className="text-blue-500" />
          <p className="text-sm text-gray-900 dark:text-gray-100">
            New message from <span className="font-semibold">@{messageData?.senderUsername}</span>
          </p>
        </div>

        <div className="hidden w-full sm:block">
          <div className="flex items-center space-x-3">
            <img
              src={messageData?.senderProfileImageUrl}
              alt={`${messageData?.senderFullname}'s profile`}
              className="h-10 w-10 rounded-full border"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {messageData?.senderFullname}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{messageData?.senderUsername}
              </p>
            </div>
          </div>

          <div className="mt-2">
            <p className="truncate text-sm text-gray-900 dark:text-gray-100">
              {messageData?.message.length > 50
                ? `${messageData?.message.substring(0, 50)}...`
                : messageData?.message}
            </p>
          </div>

          {(messageData?.imageUrl || messageData?.videoUrl) && (
            <div className="hidden sm:block">
              <div className="mt-2 flex items-center space-x-2">
                {messageData?.imageUrl && (
                  <div className="flex items-center space-x-1 text-blue-500">
                    <Image fontSize="small" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Image</span>
                  </div>
                )}
                {messageData?.videoUrl && (
                  <div className="flex items-center space-x-1 text-red-500">
                    <PlayCircle fontSize="small" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Video</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  ));
};

export const LikeNotification = (type, username) => {
  t.custom((t) => (
    <Link to={'/notifications'}>
      <div
        className={`${
          t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
        } pointer-events-auto flex w-max items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
      >
        <Favorite className="text-red-500 dark:text-red-400" />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {username} {getLikeMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getLikeMessage = (type) => {
  switch (type) {
    case 'LIKE_POST':
      return 'liked your post.';
    case 'LIKE_REEL':
      return 'liked your reel.';
    case 'LIKE_STORY':
      return 'liked your story.';
    case 'LIKE_COMMENT':
      return 'liked your comment.';
    default:
      return '';
  }
};

export const CommentNotification = (type, username) => {
  t.custom((t) => (
    <Link to={'/notifications'}>
      <div
        className={`${
          t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
        } pointer-events-auto flex w-max items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
      >
        <ChatBubble className="text-blue-500 dark:text-blue-400" />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {username} {getCommentMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getCommentMessage = (type) => {
  switch (type) {
    case 'COMMENT_POST':
      return 'commented on your post.';
    case 'COMMENT_REEL':
      return 'commented on your reel.';
    default:
      return '';
  }
};

export const FollowNotification = (type, username) => {
  t.custom((t) => (
    <Link to={'/notifications'}>
      <div
        className={`${
          t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
        } pointer-events-auto flex w-max items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
      >
        <PersonAdd className="text-green-500 dark:text-green-400" />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {username} {getFollowMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getFollowMessage = (type) => {
  switch (type) {
    case 'FOLLOW':
      return 'started following you.';
    case 'FOLLOW_REQUEST':
      return 'sent you a follow request.';
    case 'FOLLOW_REQUEST_ACCEPT':
      return 'accepted your follow request.';
    default:
      return '';
  }
};

export const NewContentNotification = (type, username) => {
  t.custom((t) => (
    <Link to={'/notifications'}>
      <div
        className={`${
          t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
        } pointer-events-auto flex w-max items-center gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black dark:ring-white`}
      >
        {getIcon(type)}
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {username} {getContentMessage(type)}
        </p>
      </div>
    </Link>
  ));
};

const getIcon = (type) => {
  switch (type) {
    case 'NETWORK_NEW_POST':
      return <PostAdd className="text-gray-500 dark:text-gray-400" />;
    case 'NETWORK_NEW_REEL':
      return <PlayCircle className="text-teal-500 dark:text-teal-400" />;
    case 'NETWORK_NEW_STORY':
      return <Collections className="text-pink-500 dark:text-pink-400" />;
    default:
      return null;
  }
};

const getContentMessage = (type) => {
  switch (type) {
    case 'NETWORK_NEW_POST':
      return 'posted a new post.';
    case 'NETWORK_NEW_REEL':
      return 'uploaded a new reel.';
    case 'NETWORK_NEW_STORY':
      return 'shared a new story.';
    default:
      return '';
  }
};
