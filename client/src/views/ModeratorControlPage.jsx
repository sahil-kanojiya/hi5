import MainLayout from '../components/layout/MainLayout';
import { useEffect, useState } from 'react';
import { createModeratorAccount, getModerators } from '../services/api';
import ModeratorSearchCard from '../components/moderation/moderatorControl/ModeratorSearchCard';
import { PersonAdd } from '@mui/icons-material';
import NewModeratorCreateModal from '../components/moderation/moderatorControl/NewModeratorCreateModal';
import * as Yup from 'yup';

const ModeratorControlPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getModerators();
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
      .required('Password is required'),
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must not exceed 15 characters')
      .matches(
        /^[a-z0-9_]+$/,
        'Username can only contain lowercase letters, numbers, and underscores'
      )
      .required('Username is required'),
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  });

  const [isCreateNewModeratorModalOpen, setIsCreateNewModeratorModalOpen] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreationError, setAccountCreationError] = useState(null);
  const openCreateNewModeratorModal = () => {
    setAccountCreationError(null);
    setIsCreatingAccount(false);
    setIsCreateNewModeratorModalOpen(true);
  };
  const closeCreateNewModeratorModal = () => setIsCreateNewModeratorModalOpen(false);
  const createNewAccount = async (data) => {
    try {
      setIsCreatingAccount(true);
      setAccountCreationError(null);
      await validationSchema.validate(
        { email: data.email, username: data.username, password: data.password },
        { abortEarly: true }
      );
      const response = await createModeratorAccount({
        email: data.email,
        username: data.username,
        password: data.password,
      });
      if (response.status === 200) {
        closeCreateNewModeratorModal();
        fetchUsers();
      }
    } catch (error) {
      setAccountCreationError(
        error?.response?.data?.message || error?.message || 'Failed to create account'
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const removeModerator = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <MainLayout>
      <div className="mx-auto flex h-full w-full justify-center pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-3xl justify-center">
          <div className="my-0 flex w-full flex-col justify-center rounded-lg bg-white px-4 shadow-lg dark:bg-black md:my-4">
            <div className="sticky top-0 w-full p-2 md:p-6">
              <div className="flex items-center justify-between">
                <h1 className="hidden text-xl font-semibold md:block lg:text-2xl">Moderators</h1>
                <button
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600"
                  onClick={openCreateNewModeratorModal}
                >
                  <PersonAdd />
                  <span className="hidden sm:inline">New Moderator</span>
                </button>
              </div>
            </div>
            <div className="mx-3 h-1 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
            <div className="hide-scrollbar mb-10 mt-0 flex flex-1 flex-col space-y-4 overflow-y-auto pb-4 min-[450px]:p-4 sm:mb-3">
              {!isLoading && users.length === 0 && (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-center">No Moderators Found</p>
                </div>
              )}
              {users.length > 0 && (
                <>
                  {users.map((user, index) => (
                    <ModeratorSearchCard
                      key={user.id}
                      index={index}
                      user={user}
                      removeModerator={removeModerator}
                    />
                  ))}
                </>
              )}
              {isLoading && users.length === 0 && (
                <div className="flex flex-col justify-center">
                  <p className="text-center">Loading...</p>
                </div>
              )}
              {!isLoading && error && <p className="my-4 text-center text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      </div>
      <NewModeratorCreateModal
        isOpen={isCreateNewModeratorModalOpen}
        closeModal={closeCreateNewModeratorModal}
        isCreatingAccount={isCreatingAccount}
        createAccount={createNewAccount}
        accountCreationError={accountCreationError}
      />
    </MainLayout>
  );
};

export default ModeratorControlPage;
