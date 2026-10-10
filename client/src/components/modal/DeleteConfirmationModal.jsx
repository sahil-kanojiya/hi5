import { useEffect } from 'react';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const DeleteConfirmationModal = ({ isOpen, closeModal, confirmDelete, isDeleting, type }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isDeleting ? 'pointer-events-none' : ''
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`w-full max-w-xs transform rounded-lg border border-gray-500 bg-white p-6 shadow-lg transition-transform duration-300 dark:bg-black sm:max-w-sm md:max-w-md lg:max-w-lg ${
              isDeleting ? 'pointer-events-none scale-95' : 'scale-100'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                Confirm Deletion
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400"
                disabled={isDeleting}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                  className="text-gray-500 transition duration-200 hover:text-red-500"
                />
              </button>
            </div>
            {type === 'POST' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this post?
              </p>
            )}
            {type === 'REEL' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this reel?
              </p>
            )}
            {type === 'STORY' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this story?
              </p>
            )}
            {type === 'COMMENT' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this comment?
              </p>
            )}
            {type === 'MESSAGES' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete all messages?
              </p>
            )}
            {type === 'NOTIFICATIONS' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete all notifications?
              </p>
            )}
            {type === 'USER_ACCOUNT' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this account?
              </p>
            )}
            {type === 'REPORTS' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete all reports?
              </p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`bg-gray-300 dark:bg-gray-600 ${
                  isDeleting
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-400 dark:hover:bg-gray-500'
                } rounded-lg px-4 py-2 text-black transition-all duration-200 ease-in-out dark:text-white`}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`bg-red-500 dark:bg-red-600 ${
                  isDeleting
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-red-600 dark:hover:bg-red-700'
                } rounded-lg px-4 py-2 text-white transition-all duration-200 ease-in-out`}
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
