import PropTypes from 'prop-types';
import { Delete } from '@mui/icons-material';
import DeleteConfirmationModal from '../../modal/DeleteConfirmationModal';
import { useState } from 'react';
import { deleteModeratorAccount } from '../../../services/api';

const ModeratorSearchCard = ({ index, user, removeModerator }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteModeratorAccount(user?.id);
      removeModerator(user?.id);
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
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-card p-3 shadow-md transition sm:gap-0"
    >
      <div className="flex items-center gap-3 transition duration-150 min-[410px]:gap-4">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-4 border-gray-300 bg-blue-500 dark:border-gray-700 min-[410px]:h-12 min-[410px]:w-12">
          {index + 1}
        </div>
        <div>
          <p className="text-md break-words font-semibold text-slate-900 md:text-lg">
            {user?.email}
          </p>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            @{user?.username}
          </p>
        </div>
      </div>

      <p className="whitespace-nowrap text-xs text-muted-foreground dark:text-muted-foreground">
        Created At: {new Date(user?.createdAt).toLocaleDateString()}
      </p>

      <div className="flex gap-1 min-[410px]:gap-2">
        <button
          onClick={openDeleteModal}
          className="flex transform items-center gap-2 rounded-full bg-red-500 px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-600 min-[410px]:px-4"
        >
          <Delete className="h-5 w-5" />
          <span className="hidden md:inline">Delete</span>
        </button>
      </div>
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

ModeratorSearchCard.propTypes = {
  index: PropTypes.number.isRequired,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  removeModerator: PropTypes.func.isRequired,
};

export default ModeratorSearchCard;
