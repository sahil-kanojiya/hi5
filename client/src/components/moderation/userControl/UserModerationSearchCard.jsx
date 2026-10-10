import PropTypes from 'prop-types';
import { Block, Delete } from '@mui/icons-material';
import DeleteConfirmationModal from '../../modal/DeleteConfirmationModal';
import { useState } from 'react';
import { banUserAccount, deleteUserAccount, unbanUserAccount } from '../../../services/api';
import toast from 'react-hot-toast';
import BanConfirmationModal from '../modal/BanConfirmationModal';
import UnbanConfirmationModal from '../modal/UnbanConfirmationModal';

const UserModerationSearchCard = ({ user, changeUserBanUntill }) => {
  const isBanned = new Date(user?.banUntil) > new Date();

  const getRemainingBanDays = () => {
    const banUntilDate = new Date(user?.banUntil);
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
      await banUserAccount(user?.id, new Date(date).toISOString());
      console.log('Account ban: ' + user?.id);
      changeUserBanUntill(user?.id, new Date(date).toISOString());
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
      await unbanUserAccount(user?.id);
      console.log('Account Unban: ' + user?.id);
      changeUserBanUntill(user?.id, new Date(new Date() - 1).toISOString());
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccount(user?.id);
      // remove user from the parent
      console.log('Account deleted: ' + user?.id);
    } catch (error) {
      console.error('Error deleting : ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  return (
    <div
      key={user?.id}
      className="flex flex-wrap items-start justify-between gap-5 rounded-lg bg-card p-3 shadow-md transition sm:items-center sm:gap-0"
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
          <p className="whitespace-nowrap break-normal text-sm text-muted-foreground">
            @{user?.username}
          </p>
        </div>
      </div>

      <div className="w-52">
        {isBanned ? (
          <p className="text-red-500">Banned</p>
        ) : (
          <p className="text-green-500">Not Banned</p>
        )}

        {isBanned && (
          <p className="mt-1 text-sm text-muted-foreground">
            {getRemainingBanDays()} days remaining for unban.
          </p>
        )}
      </div>

      <div className="flex gap-1 min-[410px]:gap-2">
        {!isBanned ? (
          <button
            onClick={openBanModel}
            className="flex transform items-center gap-2 rounded-full bg-yellow-500 px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600 min-[410px]:px-4"
          >
            <Block className="h-5 w-5" />
            <span className="hidden md:inline">Ban</span>
          </button>
        ) : (
          <button
            onClick={openUnbanModel}
            className="flex transform items-center gap-2 rounded-full bg-yellow-500 px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-600 min-[410px]:px-4"
          >
            <Block className="h-5 w-5" />
            <span className="hidden md:inline">Unban</span>
          </button>
        )}
        <button
          onClick={openDeleteModal}
          className="flex transform items-center gap-2 rounded-full bg-red-500 px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-600 min-[410px]:px-4"
        >
          <Delete className="h-5 w-5" />
          <span className="hidden md:inline">Delete</span>
        </button>
      </div>
      {!isBanned && (
        <BanConfirmationModal
          isOpen={isBanModalOpen}
          closeModal={closeBanModal}
          confirmBan={confirmBan}
          isBanning={isBanning}
        />
      )}
      {isBanned && (
        <UnbanConfirmationModal
          isOpen={isUnbanModalOpen}
          closeModal={closeUnbanModal}
          confirmUnban={confirmUnban}
          isUnbanning={isUnbanning}
        />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="USER_ACCOUNT"
      />
    </div>
  );
};

UserModerationSearchCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fullname: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string,
    banUntil: PropTypes.string.isRequired,
  }).isRequired,
  changeUserBanUntill: PropTypes.func.isRequired,
};

export default UserModerationSearchCard;
