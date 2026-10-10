import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import * as Yup from 'yup';
import { ArrowBackSharp, LightMode, DarkMode, Logout } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';
import axiosInstance from '../services/axios.config';
import toast from 'react-hot-toast';
import { setUser } from '../redux/slices/userSlice';

const SettingsPage = () => {
  const userProfileData = useSelector((state) => state.user.profile);

  const navigate = useNavigate();
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const changeThemeClickHandler = () => {
    dispatch(toggleTheme());
  };

  const [username, setUsername] = useState('');
  const [isUsernameUpdateModalOpen, setIsUsernameUpdateModalOpen] = useState(false);

  const handleUsernameUpdate = async () => {
    const usernameSchema = Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must not exceed 15 characters')
      .matches(
        /^[a-z0-9_]+$/,
        'Username can only contain lowercase letters, numbers, and underscores'
      )
      .required('Username is required');

    try {
      await usernameSchema.validate(username);

      const response = await axiosInstance.post('/user/change-username', {
        username,
      });
      console.log(response);
      toast.success('Username updated successfully!');
      setIsUsernameUpdateModalOpen(false);
      dispatch(
        setUser({
          ...userProfileData,
          username,
        })
      );
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        toast.error(e.message);
      } else {
        toast.error(e?.response?.data?.message || 'Failed to update username. Please try again.');
        console.error(e);
      }
    }
  };

  const logout = useLogout();

  const [isProfileTypeSettingModalOpen, setIsProfileTypeSettingModalOpen] = useState(false);
  const [profileType, setProfileType] = useState('public');

  const [autoFollow, setAutoFollow] = useState('ask');
  const [isAutoFollowSettingModalOpen, setIsAutoFollowSettingModalOpen] = useState(false);

  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [notificationsNetworkPosts, setNotificationsNetworkPosts] = useState(false);
  const [notificationsNetworkReels, setNotificationsNetworkReels] = useState(false);
  const [notificationsNetworkStories, setNotificationsNetworkStories] = useState(false);
  const [notificationsPostLikes, setNotificationsPostLikes] = useState(false);
  const [notificationsReelLikes, setNotificationsReelLikes] = useState(false);
  const [notificationsStoryLikes, setNotificationsStoryLikes] = useState(false);
  const [notificationsCommentLikes, setNotificationsCommentLikes] = useState(false);
  const [notificationsPostComments, setNotificationsPostComments] = useState(false);
  const [notificationsReelComments, setNotificationsReelComments] = useState(false);
  const [notificationsUserFollows, setNotificationsUserFollows] = useState(false);
  const [notificationsFollowRequests, setNotificationsFollowRequests] = useState(false);

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [isTwoFactorAuthModalOpen, setIsTwoFactorAuthModalOpen] = useState(false);

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete('/user/myaccount');
      setIsDeleteAccountModalOpen(false);
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setUsername(userProfileData.username);
  }, [userProfileData]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/user/settings');
        const data = response?.data;
        setProfileType(data?.profileType.toLowerCase() || 'public');
        setAutoFollow((data?.followRequestBehaviourAuto && 'auto') || 'ask');
        setNotificationsNetworkPosts(data?.isAllowedNetworkPostNotification || false);
        setNotificationsNetworkReels(data?.isAllowedNetworkReelNotification || false);
        setNotificationsNetworkStories(data?.isAllowedNetworkStoryNotification || false);
        setNotificationsPostLikes(data?.isAllowedPostsLikeNotification || false);
        setNotificationsReelLikes(data?.isAllowedReelsLikeNotification || false);
        setNotificationsStoryLikes(data?.isAllowedStorysLikeNotification || false);
        setNotificationsCommentLikes(data?.isAllowedCommentsLikeNotification || false);
        setNotificationsPostComments(data?.isAllowedPostsCommentNotification || false);
        setNotificationsReelComments(data?.isAllowedReelsCommentNotification || false);
        setNotificationsUserFollows(data?.isAllowedUsersFollowNotification || false);
        setNotificationsFollowRequests(data?.isAllowedUsersFollowRequestNotification || false);
        setTwoFactorAuth(data?.twoFactorAuthentication || false);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async () => {
    try {
      const payload = {
        twoFactorAuthentication: twoFactorAuth,
        profileType: profileType.toUpperCase(),
        followRequestBehaviourAuto: autoFollow === 'auto',
        isAllowedNetworkPostNotification: notificationsNetworkPosts,
        isAllowedNetworkReelNotification: notificationsNetworkReels,
        isAllowedNetworkStoryNotification: notificationsNetworkStories,
        isAllowedPostsLikeNotification: notificationsPostLikes,
        isAllowedReelsLikeNotification: notificationsReelLikes,
        isAllowedStorysLikeNotification: notificationsStoryLikes,
        isAllowedCommentsLikeNotification: notificationsCommentLikes,
        isAllowedPostsCommentNotification: notificationsPostComments,
        isAllowedReelsCommentNotification: notificationsReelComments,
        isAllowedUsersFollowNotification: notificationsUserFollows,
        isAllowedUsersFollowRequestNotification: notificationsFollowRequests,
      };
      const response = await axiosInstance.put('/user/settings', payload);
      console.log('Settings updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating user settings:', error);
    } finally {
      setIsProfileTypeSettingModalOpen(false);
      setIsAutoFollowSettingModalOpen(false);
      setIsNotificationsModalOpen(false);
      setIsTwoFactorAuthModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto flex h-screen w-full justify-center pt-[60px] sm:pt-[80px] md:pl-[70px] md:pt-[0px] lg:pl-[260px]">
        <div className="mx-auto flex w-full justify-center bg-gray-100 p-3 dark:bg-gray-900 sm:p-6">
          <div className="mb-10 flex w-full max-w-2xl flex-col rounded-lg bg-white p-6 shadow-lg dark:bg-black">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <div
                onClick={handleBackClick}
                className="cursor-pointer text-gray-500 dark:text-gray-400"
              >
                <ArrowBackSharp className="text-2xl" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Settings</h1>
            </div>

            {/* Content */}
            <div className="hide-scrollbar flex h-screen flex-col space-y-8 overflow-y-auto">
              <section className="flex flex-col">
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                  Theme Settings
                </h2>
                <div
                  onClick={changeThemeClickHandler}
                  className="flex cursor-pointer items-center space-x-4 text-xl"
                >
                  {/* Sun Icon */}
                  <div className="text-gray-800">
                    <LightMode
                      className={`transition-all duration-300 ${
                        theme === 'dark' ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </div>

                  <div className="relative h-6 w-12 rounded-full bg-gray-300 dark:bg-gray-700">
                    <div
                      className={`absolute h-6 w-6 transform rounded-full bg-blue-400 transition-all duration-300 dark:bg-blue-600 ${
                        theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>

                  <div className="dark:text-gray-200">
                    <DarkMode
                      className={`transition-all duration-300 ${
                        theme === 'light' ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </div>
                </div>
              </section>

              {/* Account Settings */}
              <section className="flex flex-col">
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                  Account Settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your username to personalize your account.
                </p>
                <div className="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
                  <span className="text-gray-600 dark:text-gray-400">Username: {username}</span>
                  <button
                    onClick={() => setIsUsernameUpdateModalOpen(true)}
                    className="mt-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 sm:mt-0 sm:w-max"
                  >
                    Change Username
                  </button>
                </div>
              </section>

              <section className="flex flex-col">
                <p className="text-sm text-gray-600 dark:text-gray-400">Logout your account.</p>
                <button
                  onClick={logout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 sm:w-max"
                >
                  <Logout className="text-xl" />
                  Logout
                </button>
              </section>

              {/* Privacy Settings */}
              <section className="flex flex-col">
                <h2 className="mb-4 flex flex-col text-xl font-bold text-gray-800 dark:text-gray-200">
                  Privacy Settings
                </h2>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  Manage your profile visibility and follow request behavior.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setIsProfileTypeSettingModalOpen(true)}
                    className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
                  >
                    Profile Type
                  </button>
                  <button
                    onClick={() => setIsAutoFollowSettingModalOpen(true)}
                    className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
                  >
                    Follow Request Behavior
                  </button>
                </div>
              </section>

              {/* Notification Settings */}
              <section className="flex flex-col">
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                  Notification Settings
                </h2>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  Customize your notifications.
                </p>
                <button
                  onClick={() => setIsNotificationsModalOpen(true)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 sm:w-max"
                >
                  Notifications
                </button>
              </section>

              {/* Security Settings */}
              <section className="flex flex-col">
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
                  Security Settings
                </h2>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  Enable two-factor authentication to secure your account.
                </p>
                <button
                  onClick={() => setIsTwoFactorAuthModalOpen(true)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 sm:w-max"
                >
                  Enable Two-Factor Authentication
                </button>
              </section>

              {/* Danger Zone */}
              <section className="flex flex-col">
                <h2 className="mb-4 text-xl font-bold text-red-500 dark:text-red-400">
                  Danger Zone
                </h2>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  This is where you can permanently delete your account.
                </p>
                <button
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                  className="rounded-md bg-red-600 p-2 text-white shadow-2xl transition duration-200 hover:bg-red-700 dark:text-gray-200 sm:w-max"
                >
                  Delete Account
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for settings */}
      <Modal
        isOpen={isUsernameUpdateModalOpen}
        onClose={() => setIsUsernameUpdateModalOpen(false)}
        title="Change Username"
        content={
          <div className="mb-4">
            <InputField
              label="New Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        }
        onSave={handleUsernameUpdate}
        type="UPDATE"
      />

      <Modal
        isOpen={isProfileTypeSettingModalOpen}
        onClose={() => setIsProfileTypeSettingModalOpen(false)}
        title="Profile Visibility"
        content={
          <SelectField
            label="Profile Type"
            value={profileType}
            onChange={(e) => setProfileType(e.target.value)}
            options={['public', 'private']}
          />
        }
        onSave={updateSettings}
        type="SETTING"
      />

      <Modal
        isOpen={isAutoFollowSettingModalOpen}
        onClose={() => setIsAutoFollowSettingModalOpen(false)}
        title="Follow Request Behavior"
        content={
          <SelectField
            label="Behavior"
            value={autoFollow}
            onChange={(e) => setAutoFollow(e.target.value)}
            options={['auto', 'ask']}
          />
        }
        onSave={updateSettings}
        type="SETTING"
      />

      <Modal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        title="Notification Settings"
        content={
          <div>
            <CheckboxField
              label="Network Posts Notifications"
              checked={notificationsNetworkPosts}
              onChange={(e) => setNotificationsNetworkPosts(e.target.checked)}
            />
            <CheckboxField
              label="Network Reels Notifications"
              checked={notificationsNetworkReels}
              onChange={(e) => setNotificationsNetworkReels(e.target.checked)}
            />
            <CheckboxField
              label="Network Story Notifications"
              checked={notificationsNetworkStories}
              onChange={(e) => setNotificationsNetworkStories(e.target.checked)}
            />
            <CheckboxField
              label="Like Notifications (Posts)"
              checked={notificationsPostLikes}
              onChange={(e) => setNotificationsPostLikes(e.target.checked)}
            />
            <CheckboxField
              label="Like Notifications (Reels)"
              checked={notificationsReelLikes}
              onChange={(e) => setNotificationsReelLikes(e.target.checked)}
            />
            <CheckboxField
              label="Like Notifications (Stories)"
              checked={notificationsStoryLikes}
              onChange={(e) => setNotificationsStoryLikes(e.target.checked)}
            />
            <CheckboxField
              label="Like Notifications (Comments)"
              checked={notificationsCommentLikes}
              onChange={(e) => setNotificationsCommentLikes(e.target.checked)}
            />
            <CheckboxField
              label="Comment Notifications (Posts)"
              checked={notificationsPostComments}
              onChange={(e) => setNotificationsPostComments(e.target.checked)}
            />
            <CheckboxField
              label="Comment Notifications (Reels)"
              checked={notificationsReelComments}
              onChange={(e) => setNotificationsReelComments(e.target.checked)}
            />
            <CheckboxField
              label="Follow Notifications"
              checked={notificationsUserFollows}
              onChange={(e) => setNotificationsUserFollows(e.target.checked)}
            />
            <CheckboxField
              label="Follow Request Notifications"
              checked={notificationsFollowRequests}
              onChange={(e) => setNotificationsFollowRequests(e.target.checked)}
            />
          </div>
        }
        onSave={updateSettings}
        type="SETTING"
      />
      <Modal
        isOpen={isTwoFactorAuthModalOpen}
        onClose={() => setIsTwoFactorAuthModalOpen(false)}
        title="Two-Factor Authentication"
        content={
          <CheckboxField
            label="Enable Two-Factor Authentication"
            checked={twoFactorAuth}
            onChange={(e) => setTwoFactorAuth(e.target.checked)}
          />
        }
        onSave={updateSettings}
        type="SECURITY"
      />
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Delete Account"
        content={
          <div>
            <p className="text-gray-700 dark:text-gray-400">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
          </div>
        }
        onSave={handleDeleteAccount}
        type="DANGER"
      />
    </MainLayout>
  );
};

const InputField = ({ label, type, value, onChange }) => (
  <div className="mb-4">
    <label
      htmlFor={label}
      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
    >
      {label}
    </label>
    <input
      type={type}
      id={label}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black"
    />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const SelectField = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    <label
      htmlFor={label}
      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
    >
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-black"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const CheckboxField = ({ label, checked, onChange }) => (
  <div className="mb-4">
    <input type="checkbox" id={label} checked={checked} onChange={onChange} className="mr-2" />
    <label htmlFor={label} className="text-gray-700 dark:text-gray-400">
      {label}
    </label>
  </div>
);

CheckboxField.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Modal = ({ isOpen, onClose, title, content, onSave, type }) => {
  const getButtonStyle = (type) => {
    switch (type) {
      case 'UPDATE':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'SETTING':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'SECURITY':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'DANGER':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-300 hover:bg-gray-400 text-black';
    }
  };

  const getButtonText = (type) => {
    switch (type) {
      case 'UPDATE':
        return 'Save Changes';
      case 'SETTING':
        return 'Update Settings';
      case 'SECURITY':
        return 'Enable Security';
      case 'DANGER':
        return 'Delete Account';
      default:
        return 'Save';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded-lg border border-gray-500 bg-white p-6 shadow-lg dark:bg-black">
        <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">{title}</h3>
        {content}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
          <button onClick={onSave} className={`rounded-md px-4 py-2 ${getButtonStyle(type)}`}>
            {getButtonText(type)}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  onSave: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['CONFIRM', 'ALERT']).isRequired,
};

export default SettingsPage;
