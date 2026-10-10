import PropTypes from 'prop-types';
import TimeAgo from '../../common/TimeAgo';
import {
  Block,
  CommentOutlined,
  CommentsDisabled,
  DeleteOutlineOutlined,
  FavoriteBorderSharp,
  ReportGmailerrorred,
} from '@mui/icons-material';
import { useState } from 'react';
import ReportDetailsModel from './ReportDetailsModel';
import DeleteConfirmationModal from '../../modal/DeleteConfirmationModal';
import { banUserAccount, deleteEntity, unbanUserAccount } from '../../../services/api';
import UnbanConfirmationModal from '../modal/UnbanConfirmationModal';
import BanConfirmationModal from '../modal/BanConfirmationModal';
import toast from 'react-hot-toast';

const ReportedComment = ({ comment, removeComment, updateBanUntill }) => {
  const [isReportDetailsOpen, setIsReportDetailsOpen] = useState(false);
  const openReportDetailsModel = () => setIsReportDetailsOpen(true);
  const closeReportDetailsModel = () => setIsReportDetailsOpen(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEntity(comment.id, 'COMMENT');
      console.log('comment deleted: ' + comment.id);
      removeComment(comment.id);
    } catch (error) {
      console.error('Error deleting comment: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const isBanned = new Date(comment?.banUntil) > new Date();

  const getRemainingBanDays = () => {
    const banUntilDate = new Date(comment?.banUntil);
    const currentDate = new Date();
    const remainingTime = banUntilDate - currentDate;
    const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24));
    return remainingDays > 0 ? remainingDays : 0;
  };

  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const openBanModel = () => setIsBanModalOpen(true);
  const closeBanModal = () => setIsBanModalOpen(false);
  const confirmBan = async (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      toast.error('The ban date cannot be in the past. Please choose a future date.');
      return;
    }
    setIsBanning(true);
    try {
      await banUserAccount(comment?.userId, new Date(date).toISOString());
      console.log('Account ban: ' + comment?.userId);
      updateBanUntill(comment.userId, selectedDate.toISOString());
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      console.error('Error ban : ', error);
    } finally {
      setIsBanning(false);
      closeBanModal();
    }
  };

  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);
  const openUnbanModel = () => setIsUnbanModalOpen(true);
  const closeUnbanModal = () => setIsUnbanModalOpen(false);
  const confirmUnban = async () => {
    setIsUnbanning(true);
    try {
      await unbanUserAccount(comment?.userId);
      console.log('Account Unban: ' + comment?.userId);
      updateBanUntill(comment.userId, new Date(new Date() - 1).toISOString());
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      console.error('Error ban : ', error);
    } finally {
      setIsUnbanning(false);
      closeUnbanModal();
    }
  };

  return (
    <>
      <div className="mx-auto mb-6 flex w-full max-w-xl flex-col gap-2 rounded-lg bg-gray-100 p-3 shadow-md dark:bg-gray-900 sm:p-4">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={comment.profilePictureUrl}
                alt={`${comment.fullname}'s profile`}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-md font-semibold sm:text-lg">{comment.fullname}</p>
                <p className="flex flex-col items-start space-x-1 whitespace-nowrap text-sm text-gray-500 sm:flex-row sm:items-center">
                  <span>@{comment.username}</span>
                  <span className="hidden sm:block">•</span>
                  <TimeAgo
                    date={comment.createdAt}
                    className="sm:text-md whitespace-nowrap pt-1 text-xs font-medium sm:pt-0"
                  />
                </p>
              </div>
            </div>
            <button
              className="flex transform items-center space-x-1 transition duration-200 hover:scale-110 hover:text-red-500"
              onClick={openDeleteModal}
            >
              <DeleteOutlineOutlined className="cursor-pointer text-gray-600 hover:text-red-500" />
            </button>
          </div>
          <div className="mb-4 w-full">
            <p className="w-full whitespace-pre-wrap break-words px-2 text-sm text-gray-800 dark:text-gray-200 sm:text-base">
              {comment.content}
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 text-gray-500">
            <div className="ml-2 flex w-full items-center space-x-5">
              <button className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110">
                <FavoriteBorderSharp className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-600" />

                <span className="text-sm font-medium group-hover:text-red-500">
                  {comment.likesCount}
                </span>
              </button>

              <button
                className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
                onClick={openReportDetailsModel}
              >
                <ReportGmailerrorred className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-500" />
                <span className="text-sm font-medium group-hover:text-red-500">
                  {comment.totalReportsCount}
                </span>
              </button>
            </div>

            {!isBanned ? (
              <div className="flex w-full items-center justify-end">
                <button
                  onClick={openBanModel}
                  className="flex transform items-center gap-2 rounded-full bg-yellow-500 px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600 min-[410px]:px-4"
                >
                  <Block className="h-5 w-5" />
                  <span className="inline">Ban</span>
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <p className="mt-1 whitespace-nowrap text-sm text-gray-500">
                  {getRemainingBanDays()} days remaining.
                </p>
                <button
                  onClick={openUnbanModel}
                  className="flex transform items-center gap-2 rounded-full bg-yellow-500 px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600 min-[410px]:px-4"
                >
                  <Block className="h-5 w-5" />
                  <span className="inline">Unban</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto flex w-full justify-center rounded-lg bg-gray-200 p-1 text-gray-600 shadow-md dark:bg-gray-800 dark:text-gray-400 sm:p-2">
          {comment?.postResponse && <p>Post</p>}
          {comment?.reelResponse && <p>Reel</p>}
        </div>

        {/* post and reel */}
        <div>
          {comment?.postResponse && (
            <div className="mx-auto rounded-lg bg-gray-200 p-1 shadow-md dark:bg-gray-800 sm:p-2">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.postResponse.profilePictureUrl}
                    alt={`${comment.postResponse.fullname}'s profile`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-md font-semibold sm:text-lg">
                      {comment.postResponse.fullname}
                    </p>
                    <p className="flex flex-col items-start space-x-1 whitespace-nowrap text-sm text-gray-500 sm:flex-row sm:items-center">
                      <span>@{comment.postResponse.username}</span>
                      <span className="hidden sm:block">•</span>
                      <TimeAgo
                        date={comment.postResponse.createdAt}
                        className="sm:text-md whitespace-nowrap pt-1 text-xs font-medium sm:pt-0"
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4 w-full">
                <p className="w-full whitespace-pre-wrap break-words px-2 text-sm text-gray-800 dark:text-gray-200 sm:text-base">
                  {comment.postResponse.content}
                </p>
              </div>
              {comment.postResponse.imageUrl && (
                <div className="mb-4 h-full w-full">
                  <img
                    src={comment.postResponse.imageUrl}
                    alt="Post content"
                    className="h-auto max-h-[90dvh] w-full rounded-md object-contain"
                  />
                </div>
              )}
              {comment.postResponse.videoUrl && (
                <div className="mb-4 h-full w-full">
                  <video
                    src={comment.postResponse.videoUrl}
                    controls
                    className="h-auto max-h-[90dvh] w-full rounded-md object-contain"
                  />
                </div>
              )}
              <div className="flex items-center justify-between text-gray-500">
                <div className="ml-2 flex w-full items-center space-x-5">
                  <button className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110">
                    <FavoriteBorderSharp className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-600" />

                    <span className="text-sm font-medium group-hover:text-red-500">
                      {comment.postResponse.likesCount}
                    </span>
                  </button>
                  {comment.postResponse?.isCommentsDisabled === true ? (
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
                    <button className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110">
                      <CommentOutlined className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-500" />
                      <span className="text-sm font-medium group-hover:text-blue-500">
                        {comment.postResponse.commentsCount}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {comment?.reelResponse && (
            <div className="mx-auto rounded-lg bg-gray-200 p-1 shadow-md dark:bg-gray-800 sm:p-2">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.reelResponse.profilePictureUrl}
                    alt={`${comment.reelResponse.fullname}'s profile`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-md font-semibold sm:text-lg">
                      {comment.reelResponse.fullname}
                    </p>
                    <p className="flex flex-col items-start space-x-1 whitespace-nowrap text-sm text-gray-500 sm:flex-row sm:items-center">
                      <span>@{comment.reelResponse.username}</span>
                      <span className="hidden sm:block">•</span>
                      <TimeAgo
                        date={comment.reelResponse.createdAt}
                        className="sm:text-md whitespace-nowrap pt-1 text-xs font-medium sm:pt-0"
                      />
                    </p>
                  </div>
                </div>
              </div>
              {comment.reelResponse?.videoUrl && (
                <div className="mb-4 h-full w-full">
                  <video
                    src={comment.reelResponse?.videoUrl}
                    controls
                    className="h-auto max-h-[65dvh] w-full rounded-md object-contain"
                  />
                </div>
              )}
              <div className="mb-4 w-full">
                <p className="w-full whitespace-pre-wrap break-words px-2 text-sm text-gray-800 dark:text-gray-200 sm:text-base">
                  {comment.reelResponse.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <div className="ml-2 flex w-full items-center space-x-5">
                  <button className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110">
                    <FavoriteBorderSharp className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-600" />

                    <span className="text-sm font-medium group-hover:text-red-500">
                      {comment.reelResponse.likesCount}
                    </span>
                  </button>
                  {comment.reelResponse?.isCommentsDisabled === true ? (
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
                    <button className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110">
                      <CommentOutlined className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-blue-500" />
                      <span className="text-sm font-medium group-hover:text-blue-500">
                        {comment.reelResponse.commentsCount}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {isReportDetailsOpen && (
          <ReportDetailsModel
            isOpen={isReportDetailsOpen}
            onClose={closeReportDetailsModel}
            type="COMMENT"
            relevantId={comment.id}
          />
        )}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          closeModal={closeDeleteModal}
          confirmDelete={confirmDelete}
          isDeleting={isDeleting}
          type="COMMENT"
        />
        {isBanned && (
          <UnbanConfirmationModal
            isOpen={isUnbanModalOpen}
            closeModal={closeUnbanModal}
            confirmUnban={confirmUnban}
            isUnbanning={isUnbanning}
          />
        )}
        {!isBanned && (
          <BanConfirmationModal
            isOpen={isBanModalOpen}
            closeModal={closeBanModal}
            confirmBan={confirmBan}
            isBanning={isBanning}
          />
        )}
      </div>
    </>
  );
};

ReportedComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    relevantId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    postResponse: PropTypes.shape({
      id: PropTypes.string.isRequired,
      postId: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      videoUrl: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      likesCount: PropTypes.number.isRequired,
      commentsCount: PropTypes.number.isRequired,
      isPrivate: PropTypes.bool,
      isCommentsDisabled: PropTypes.bool,
      username: PropTypes.string.isRequired,
      fullname: PropTypes.string.isRequired,
      profilePictureUrl: PropTypes.string.isRequired,
    }),
    reelResponse: PropTypes.shape({
      id: PropTypes.string.isRequired,
      reelId: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      videoUrl: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      likesCount: PropTypes.number.isRequired,
      commentsCount: PropTypes.number.isRequired,
      isPrivate: PropTypes.bool,
      isCommentsDisabled: PropTypes.bool,
      username: PropTypes.string.isRequired,
      fullname: PropTypes.string.isRequired,
      profilePictureUrl: PropTypes.string.isRequired,
    }),
    totalReportsCount: PropTypes.number.isRequired,
    banUntil: PropTypes.string.isRequired,
  }).isRequired,
  removeComment: PropTypes.func.isRequired,
  updateBanUntill: PropTypes.func.isRequired,
};

export default ReportedComment;
