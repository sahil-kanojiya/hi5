import PropTypes from 'prop-types';
import { useState } from 'react';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ShareSharpIcon from '@mui/icons-material/ShareSharp';
import BookmarkSharpIcon from '@mui/icons-material/BookmarkSharp';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ReportIcon from '@mui/icons-material/Report';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';
import ReportConfirmationModal from '../modal/ReportConfirmationModal';
import TimeAgo from '../common/TimeAgo';
import CommentModal from '../comment/CommentModal';
import {
  deletePost,
  likeEntity,
  reportEntity,
  save,
  unlikeEntity,
  unsave,
} from '../../services/api';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CommentsDisabled, PersonOutline } from '@mui/icons-material';
import ViewLikedUsersModal from '../profile/ViewLikedUsersModal';

const Post = ({ post, removePost, isMyProfilePosts }) => {
  const user = useSelector((state) => state.user.profile);
  const isMyPost = post.userId === user.id;
  console.log(post.userId + '   ' + user.id);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };
  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      console.log('Post deleted: ' + post.id);
      removePost(post.id);
    } catch (error) {
      console.error('Error deleting post: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const [isReported, setIsReported] = useState(post.reportStatus === 'REPORTED');
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => setIsReportModal(true);
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = async (reportReason) => {
    setIsReporting(true);
    try {
      await reportEntity({
        relevantId: post.id,
        reason: reportReason,
        type: 'POST',
      });
      console.log('Post reported: ' + post.id + '  reason: ' + reportReason);
      // removePost(post.id);
    } catch (error) {
      console.error('Error reporting post: ', error);
    } finally {
      setIsReporting(false);
      setIsReported(true);
      closeReportModal();
    }
  };

  const [isLiked, setIsLiked] = useState(post.likeStatus === 'LIKED');
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const likeClickHandler = async () => {
    if (isLiked) {
      unlikeEntity({
        relevantId: post.id,
        type: 'POST',
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log('unliked' + post.id);
    } else {
      likeEntity({
        relevantId: post.id,
        type: 'POST',
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log('liked' + post.id);
    }
  };

  const [commentCount, setCommentCount] = useState(post.commentsCount);

  const [isSaved, setIsSaved] = useState(post.saveStatus === 'SAVED');
  const saveClickHandler = () => {
    if (isSaved) {
      unsave({
        relevantId: post.id,
        type: 'POST',
      });
      setIsSaved(false);
      console.log('unsaved' + post.id);
    } else {
      save({
        relevantId: post.id,
        type: 'POST',
      });
      setIsSaved(true);
      console.log('saved' + post.id);
    }
  };

  const shareClickHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this post!',
          text: 'This is an interesting post I found.',
          url: 'http://localhost:3000/share/post/' + post.id,
        })
        .then(() => console.log('Share successful'))
        .catch((error) => console.error('Share failed:', error));
    } else {
      alert('Web Share API not supported in this browser.');
    }
  };

  const [isViewLikedUsersModalOpen, setIsViewLikedUsersModalOpen] = useState(false);
  const viewLikedUsersButtonClickHandler = () => {
    setIsViewLikedUsersModalOpen(true);
  };
  const closeViewLikedUsersModal = () => {
    setIsViewLikedUsersModalOpen(false);
  };

  return (
    <div className="mx-auto mb-6 w-full max-w-xl rounded-lg bg-white p-3 shadow-md dark:bg-black sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.userId}`}>
            <img
              src={post.profilePictureUrl}
              alt={`${post.fullname}'s profile`}
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <p className="text-md font-semibold sm:text-lg">{post.fullname}</p>
            <p className="flex flex-col items-start space-x-1 whitespace-nowrap text-sm text-gray-500 sm:flex-row sm:items-center">
              <span>@{post.username}</span>
              <span className="hidden sm:block">•</span>
              <TimeAgo
                date={post.createdAt}
                className="sm:text-md whitespace-nowrap pt-1 text-xs font-medium sm:pt-0"
              />
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isMyProfilePosts && (
            <button
              className="flex transform items-center space-x-1 transition duration-200 hover:scale-110 hover:text-red-500"
              onClick={openDeleteModal}
            >
              <DeleteOutlineOutlinedIcon className="cursor-pointer text-gray-600 hover:text-red-500" />
            </button>
          )}

          {!isMyPost &&
            (isReported ? (
              <ReportIcon
                className="transform cursor-not-allowed text-red-500 transition duration-200"
                title="This post has already been reported"
              />
            ) : (
              <ReportGmailerrorredIcon
                className="transform cursor-pointer text-gray-600 transition duration-200 hover:scale-110 hover:text-red-500"
                onClick={openReportModal}
                title="Report this post"
              />
            ))}

          {isSaved ? (
            <BookmarkSharpIcon
              className="transform cursor-pointer text-yellow-600 transition duration-200 hover:scale-110"
              onClick={saveClickHandler}
              title="Unsave this post"
            />
          ) : (
            <BookmarkBorderOutlinedIcon
              className="transform cursor-pointer text-gray-600 transition duration-200 hover:scale-110 hover:text-yellow-600"
              onClick={saveClickHandler}
              title="Save this post"
            />
          )}
        </div>
      </div>

      <div className="mb-4 w-full">
        <p className="w-full whitespace-pre-wrap break-words px-2 text-sm text-gray-800 dark:text-gray-200 sm:text-base">
          {post.content}
        </p>
      </div>

      {post.imageUrl && (
        <div className="mb-4 h-full w-full">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="h-auto max-h-[90dvh] w-full rounded-md object-contain"
          />
        </div>
      )}
      {post.videoUrl && (
        <div className="mb-4 h-full w-full">
          <video
            src={post.videoUrl}
            controls
            className="h-auto max-h-[90dvh] w-full rounded-md object-contain"
          />
        </div>
      )}

      <div className="flex items-center justify-between text-gray-500">
        <div className="ml-2 flex w-full items-center space-x-5">
          <button
            className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
            onClick={likeClickHandler}
          >
            {isLiked ? (
              <FavoriteSharpIcon className="h-5 w-5 text-red-600 transition-colors duration-200" />
            ) : (
              <FavoriteBorderSharpIcon className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-600" />
            )}
            <span className="text-sm font-medium group-hover:text-red-500">{likesCount}</span>
          </button>

          {isMyProfilePosts && (
            <button
              className="group relative flex transform items-center space-x-2 transition duration-200 hover:scale-110"
              onClick={viewLikedUsersButtonClickHandler}
            >
              <PersonOutline className="h-5 w-5 scale-110 transition-colors duration-200 group-hover:text-blue-600" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition duration-200 group-hover:opacity-100">
                View Liked Users
              </span>
            </button>
          )}

          {post?.isCommentsDisabled === true ? (
            <button className="flex cursor-not-allowed items-center space-x-2">
              <CommentsDisabled
                sx={{
                  fontSize: { xs: 21, sm: 23, md: 25 },
                }}
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
              <span className="text-xs font-medium sm:text-sm">0</span>
            </button>
          ) : (
            <button
              className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
              onClick={openCommentModal}
            >
              <CommentOutlinedIcon className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-500" />
              <span className="text-sm font-medium group-hover:text-blue-500">{commentCount}</span>
            </button>
          )}

          {post?.isPrivate === false && (
            <button
              className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
              onClick={shareClickHandler}
            >
              <ShareSharpIcon className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-green-500" />
              <span className="text-xs group-hover:text-green-500">Share</span>
            </button>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="POST"
      />
      <ReportConfirmationModal
        isOpen={isReportModalOpen}
        closeModal={closeReportModal}
        report={confirmReport}
        isReporting={isReporting}
        type="POST"
      />
      {isMyProfilePosts && (
        <ViewLikedUsersModal
          isOpen={isViewLikedUsersModalOpen}
          closeModal={closeViewLikedUsersModal}
          relevantId={post?.id}
          type="POST"
        />
      )}

      {post?.isCommentsDisabled !== true && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={closeCommentModal}
          type={'POST'}
          relevantId={post.id}
          updateCommentCount={setCommentCount}
          commentCount={commentCount}
          isMyProfileEntity={isMyProfilePosts}
        />
      )}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    videoUrl: PropTypes.string,
    likeStatus: PropTypes.string.isRequired,
    reportStatus: PropTypes.string.isRequired,
    saveStatus: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    isCommentsDisabled: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  removePost: PropTypes.func.isRequired,
  isMyProfilePosts: PropTypes.bool.isRequired,
};

export default Post;
