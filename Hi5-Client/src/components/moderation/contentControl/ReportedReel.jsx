import { useState } from 'react';
import TimeAgo from '../../common/TimeAgo';
import {
  Block,
  CommentOutlined,
  CommentsDisabled,
  DeleteOutlineOutlined,
  FavoriteBorderSharp,
  ReportGmailerrorred,
} from '@mui/icons-material';
import ReportDetailsModel from './ReportDetailsModel';
import DeleteConfirmationModal from '../../modal/DeleteConfirmationModal';
import PropTypes from 'prop-types';
import { banUserAccount, deleteEntity, unbanUserAccount } from '../../../services/api';
import toast from 'react-hot-toast';
import UnbanConfirmationModal from '../modal/UnbanConfirmationModal';
import BanConfirmationModal from '../modal/BanConfirmationModal';

const ReportedReel = ({ reel, removeReel, updateBanUntill }) => {
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
      await deleteEntity(reel.id, 'REEL');
      console.log('Reel deleted: ' + reel.id);
      removeReel(reel.id);
    } catch (error) {
      console.error('Error deleting reel: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const isBanned = new Date(reel?.banUntil) > new Date();

  const getRemainingBanDays = () => {
    const banUntilDate = new Date(reel?.banUntil);
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
      await banUserAccount(reel?.userId, new Date(date).toISOString());
      console.log('Account ban: ' + reel?.userId);
      updateBanUntill(reel.userId, selectedDate.toISOString());
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
      await unbanUserAccount(reel?.userId);
      console.log('Account Unban: ' + reel?.userId);
      updateBanUntill(reel.userId, new Date(new Date() - 1).toISOString());
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
    <div className="mx-auto mb-6 w-full max-w-xl rounded-lg bg-gray-100 p-3 shadow-md dark:bg-gray-900 sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={reel.profilePictureUrl}
            alt={`${reel.fullname}'s profile`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-md font-semibold sm:text-lg">{reel.fullname}</p>
            <p className="flex flex-col items-start space-x-1 whitespace-nowrap text-sm text-gray-500 sm:flex-row sm:items-center">
              <span>@{reel.username}</span>
              <span className="hidden sm:block">•</span>
              <TimeAgo
                date={reel.createdAt}
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

      {reel?.videoUrl && (
        <div className="mb-4 h-full w-full">
          <video
            src={reel?.videoUrl}
            controls
            className="h-auto max-h-[65dvh] w-full rounded-md object-contain"
          />
        </div>
      )}

      <div className="mb-4 w-full">
        <p className="w-full whitespace-pre-wrap break-words px-2 text-sm text-gray-800 dark:text-gray-200 sm:text-base">
          {reel.description}
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 text-gray-500">
        <div className="ml-2 flex w-full items-center space-x-5">
          <button className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110">
            <FavoriteBorderSharp className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-600" />

            <span className="text-sm font-medium group-hover:text-red-500">{reel.likesCount}</span>
          </button>
          {reel?.isCommentsDisabled === true ? (
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
                {reel.commentsCount}
              </span>
            </button>
          )}

          <button
            className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
            onClick={openReportDetailsModel}
          >
            <ReportGmailerrorred className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-500" />
            <span className="text-sm font-medium group-hover:text-red-500">
              {reel.totalReportsCount}
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
      {isReportDetailsOpen && (
        <ReportDetailsModel
          isOpen={isReportDetailsOpen}
          onClose={closeReportDetailsModel}
          type="REEL"
          relevantId={reel.id}
        />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="REEL"
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
  );
};

ReportedReel.propTypes = {
  reel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    videoUrl: PropTypes.string,
    description: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
    totalReportsCount: PropTypes.number.isRequired,
    isCommentsDisabled: PropTypes.bool.isRequired,
    banUntil: PropTypes.string.isRequired,
  }).isRequired,
  removeReel: PropTypes.func.isRequired,
  updateBanUntill: PropTypes.func.isRequired,
};

export default ReportedReel;
