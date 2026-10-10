import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const NewModeratorCreateModal = ({
  isOpen,
  closeModal,
  createAccount,
  isCreatingAccount,
  accountCreationError,
}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = () => {
    createAccount({ email, username, password });
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isCreatingAccount ? 'pointer-events-none opacity-50' : ''}`}
          onClick={handleOutsideClick}
        >
          <div
            className={`w-full max-w-md transform rounded-lg border border-gray-500 bg-card p-4 shadow-lg transition-transform duration-300 sm:w-3/4 sm:p-6 md:w-2/3 md:p-8 lg:w-1/2 ${isOpen ? 'scale-100' : 'scale-95'} ${isCreatingAccount ? 'opacity-50' : ''}`}
          >
            <div className="mb-4 flex items-center justify-between text-xl">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                Create New Moderator
              </h3>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-gray-100"
                disabled={isCreatingAccount}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                />
              </button>
            </div>

            <div className="mb-4 space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-card p-2 text-foreground dark:border-gray-600"
                disabled={isCreatingAccount}
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-card p-2 text-foreground dark:border-gray-600"
                disabled={isCreatingAccount}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-card p-2 text-foreground dark:border-gray-600"
                disabled={isCreatingAccount}
              />
              {accountCreationError && (
                <p className="text-sm text-red-500">{accountCreationError}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`rounded-lg bg-muted px-4 py-2 text-foreground transition-all duration-200 ease-in-out hover:bg-gray-400 dark:hover:bg-gray-600`}
                disabled={isCreatingAccount}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`rounded-lg bg-blue-500 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700`}
                disabled={isCreatingAccount}
              >
                Create Moderator
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

NewModeratorCreateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  createAccount: PropTypes.func.isRequired,
  isCreatingAccount: PropTypes.bool.isRequired,
  accountCreationError: PropTypes.string,
};

export default NewModeratorCreateModal;
