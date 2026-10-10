import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import TimeAgo from '../common/TimeAgo';
import {
  FavoriteSharp as LikedIcon,
  FavoriteBorderSharp as UnlikedIcon,
  Report as ReportedIcon,
  ReportGmailerrorred as ReportIcon,
  DeleteOutlineOutlined as DeleteIcon,
} from '@mui/icons-material';
import { deleteComment, likeEntity, reportEntity, unlikeEntity } from '../../services/api';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';
import ReportConfirmationModal from '../modal/ReportConfirmationModal';
import { Link } from 'react-router-dom';

const Comment = ({ comment, removeComment, isMyProfileEntity }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      console.log('comment deleted: ' + comment.id);
      removeComment(comment.id);
    } catch (error) {
      console.error('Error deleting post: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [isLiked, setIsLiked] = useState(comment.likeStatus === 'LIKED');

  const likeClickHandler = async () => {
    if (isLiked) {
      unlikeEntity({
        relevantId: comment.id,
        type: 'COMMENT',
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log('unliked' + comment.id);
    } else {
      likeEntity({
        relevantId: comment.id,
        type: 'COMMENT',
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log('liked' + comment.id);
    }
  };

  const [isReported, setIsReported] = useState(comment.reportStatus === 'REPORTED');
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => setIsReportModal(true);
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = async (reportReason) => {
    setIsReporting(true);
    try {
      await reportEntity({
        relevantId: comment.id,
        reason: reportReason,
        type: 'COMMENT',
      });
      console.log('Comment reported: ' + comment.id + '  reason: ' + reportReason);
      // removePost(post.id);
    } catch (error) {
      console.error('Error reporting comment: ', error);
    } finally {
      setIsReporting(false);
      setIsReported(true);
      closeReportModal();
    }
  };

  const user = useSelector((state) => state.user.profile);
  const isMyComment = comment.userId === user.id;

  return (
    <div className="mb-6 flex flex-col items-start justify-between border-b border-gray-200 p-3 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <Link to={`/profile/${comment.userId}`}>
          <img
            src={comment.profilePictureUrl}
            alt={`${comment.fullname}'s profile`}
            className="h-12 w-12 rounded-full object-cover"
          />
        </Link>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{comment.fullname}</p>
          <p className="flex items-center space-x-1 text-sm text-gray-500">
            <span>@{comment.username}</span>
            <span className="hidden sm:inline">•</span>
            <TimeAgo date={comment.createdAt} className="text-xs font-medium sm:text-sm" />
          </p>
        </div>
      </div>

      <div className="px-3 py-2 leading-relaxed text-gray-800 dark:text-gray-400">
        {comment.content}
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5">
        <button
          className="group flex items-center space-x-2 transition duration-200 hover:scale-105"
          onClick={likeClickHandler}
        >
          {isLiked ? (
            <LikedIcon className="h-5 w-5 text-red-600 transition-colors duration-200" />
          ) : (
            <UnlikedIcon className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-600" />
          )}
          <span className="text-sm font-medium group-hover:text-red-500">{likesCount}</span>
        </button>

        {(isMyComment || isMyProfileEntity) && (
          <button
            className="flex items-center transition duration-200 hover:scale-105 hover:text-red-500"
            onClick={openDeleteModal}
          >
            <DeleteIcon className="cursor-pointer text-gray-500 hover:text-red-500" />
          </button>
        )}

        {!isMyComment &&
          (isReported ? (
            <ReportedIcon
              className="transform cursor-not-allowed text-red-500 transition duration-200"
              title="This comment has already been reported"
            />
          ) : (
            <ReportIcon
              className="transform cursor-pointer text-gray-500 transition duration-200 hover:scale-105 hover:text-red-500"
              onClick={openReportModal}
              title="Report this comment"
            />
          ))}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="COMMENT"
      />
      <ReportConfirmationModal
        isOpen={isReportModalOpen}
        closeModal={closeReportModal}
        report={confirmReport}
        isReporting={isReporting}
        type="COMMENT"
      />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    likeStatus: PropTypes.string,
    reportStatus: PropTypes.string,
  }).isRequired,
  removeComment: PropTypes.func.isRequired,
  isMyProfileEntity: PropTypes.bool.isRequired,
};

export default Comment;
