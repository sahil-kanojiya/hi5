import MainLayout from '../components/layout/MainLayout';
import { useEffect, useState } from 'react';
import { createModeratorAccount, getModerators } from '../services/api';
import ModeratorSearchCard from '../components/moderation/moderatorControl/ModeratorSearchCard';
import { PersonAdd, Search } from '@mui/icons-material';
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
      <div className="mx-auto flex h-full w-full justify-center bg-background pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-2xl justify-center">
          <div className="my-0 flex w-full flex-col rounded-xl border-x border-border bg-card shadow-sm md:my-4 md:min-h-[auto] md:border-y">
            <div className="sticky top-0 z-10 w-full rounded-t-xl border-b border-border bg-card/80 p-4 backdrop-blur-md md:p-6">
              <div className="flex items-center justify-between">
                <h1 className="hidden text-xl font-bold tracking-tight text-foreground md:block lg:text-2xl">
                  Moderators
                </h1>
                <button
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                  onClick={openCreateNewModeratorModal}
                >
                  <PersonAdd fontSize="small" />
                  <span className="hidden sm:inline">New Moderator</span>
                </button>
              </div>
            </div>

            <div className="hide-scrollbar mb-10 flex flex-1 flex-col overflow-y-auto bg-card sm:mb-0">
              {!isLoading && users.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="rounded-full bg-muted p-4">
                    <Search fontSize="large" />
                  </div>
                  <p className="font-medium text-foreground">No Moderators Found</p>
                </div>
              )}
              {users.length > 0 && (
                <div className="flex flex-col gap-2 p-2 sm:p-4">
                  {users.map((user, index) => (
                    <ModeratorSearchCard
                      key={user.id}
                      index={index}
                      user={user}
                      removeModerator={removeModerator}
                    />
                  ))}
                </div>
              )}
              {isLoading && users.length === 0 && (
                <div className="flex h-32 flex-col items-center justify-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Loading moderators...</p>
                </div>
              )}
              {!isLoading && error && (
                <div className="m-4 rounded-md border border-destructive/20 bg-destructive/10 p-4 text-center text-sm font-medium text-destructive">
                  {error}
                </div>
              )}
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
