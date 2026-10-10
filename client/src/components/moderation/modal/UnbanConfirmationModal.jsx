import { useEffect } from 'react';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const UnbanConfirmationModal = ({ isOpen, closeModal, confirmUnban, isUnbanning }) => {
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
            isUnbanning ? 'pointer-events-none' : ''
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`w-full max-w-xs transform rounded-lg border border-gray-500 bg-white p-6 shadow-lg transition-transform duration-300 dark:bg-black sm:w-2/3 sm:max-w-sm sm:p-8 md:w-1/2 md:max-w-md lg:w-1/3 lg:max-w-lg xl:w-1/4 xl:max-w-xl ${
              isUnbanning ? 'pointer-events-none scale-95' : 'scale-100'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                Confirm Unban
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400"
                disabled={isUnbanning}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                />
              </button>
            </div>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to unban this account?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`bg-gray-300 dark:bg-gray-600 ${
                  isUnbanning
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-400 dark:hover:bg-gray-500'
                } rounded-lg px-4 py-2 text-black transition-all duration-200 ease-in-out dark:text-white`}
                disabled={isUnbanning}
              >
                Cancel
              </button>
              <button
                onClick={confirmUnban}
                className={`bg-yellow-500 dark:bg-yellow-600 ${
                  isUnbanning
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-yellow-600 dark:hover:bg-yellow-700'
                } rounded-lg px-4 py-2 text-white transition-all duration-200 ease-in-out`}
                disabled={isUnbanning}
              >
                Unban
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

UnbanConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  confirmUnban: PropTypes.func.isRequired,
  isUnbanning: PropTypes.bool.isRequired,
};

export default UnbanConfirmationModal;
