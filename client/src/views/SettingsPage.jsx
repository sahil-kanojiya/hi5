import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import * as Yup from 'yup';
import {
  ArrowBackSharp,
  LightMode,
  DarkMode,
  Logout,
  Security,
  Person,
  Notifications,
  PrivacyTip,
  Warning,
} from '@mui/icons-material';
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
      <div className="mx-auto flex min-h-screen w-full justify-center bg-background pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="mx-auto flex w-full max-w-3xl flex-col p-4 sm:p-6">
          <div className="mb-10 flex w-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4 border-b border-border pb-4">
              <div
                onClick={handleBackClick}
                className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowBackSharp className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
            </div>

            {/* Content */}
            <div className="flex flex-col space-y-8">
              {/* Theme Settings */}
              <section className="flex flex-col rounded-lg border border-border bg-background p-5">
                <div className="mb-4 flex items-center gap-2">
                  <LightMode className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Theme Settings</h2>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark mode.
                  </p>
                  <div
                    onClick={changeThemeClickHandler}
                    className="flex cursor-pointer items-center space-x-3 rounded-full bg-input p-1"
                  >
                    <div className="relative h-7 w-14 rounded-full bg-muted shadow-inner">
                      <div
                        className={`absolute top-0.5 h-6 w-6 transform rounded-full bg-primary shadow-sm transition-all duration-300 ${
                          theme === 'dark' ? 'left-[34px]' : 'left-[2px]'
                        }`}
                      >
                        {theme === 'dark' ? (
                          <DarkMode className="absolute inset-0 m-auto h-4 w-4 text-primary-foreground" />
                        ) : (
                          <LightMode className="absolute inset-0 m-auto h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account Settings */}
              <section className="flex flex-col rounded-lg border border-border bg-background p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Person className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Update your username or sign out of your account.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col justify-between rounded-md bg-muted/50 p-3 sm:flex-row sm:items-center">
                    <span className="mb-2 text-sm font-medium text-foreground sm:mb-0">
                      Username: <span className="ml-1 text-muted-foreground">@{username}</span>
                    </span>
                    <button
                      onClick={() => setIsUsernameUpdateModalOpen(true)}
                      className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted sm:w-max"
                    >
                      Change Username
                    </button>
                  </div>

                  <div className="mt-2 flex flex-col justify-between rounded-md bg-muted/50 p-3 sm:flex-row sm:items-center">
                    <span className="mb-2 text-sm font-medium text-foreground sm:mb-0">
                      Active Session
                    </span>
                    <button
                      onClick={logout}
                      className="flex items-center justify-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground sm:w-max"
                    >
                      <Logout fontSize="small" />
                      Logout
                    </button>
                  </div>
                </div>
              </section>

              {/* Privacy Settings */}
              <section className="flex flex-col rounded-lg border border-border bg-background p-5">
                <div className="mb-4 flex items-center gap-2">
                  <PrivacyTip className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Privacy Settings</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Manage your profile visibility and follow request behavior.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setIsProfileTypeSettingModalOpen(true)}
                    className="flex-1 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
                  >
                    Profile Visibility ({profileType})
                  </button>
                  <button
                    onClick={() => setIsAutoFollowSettingModalOpen(true)}
                    className="flex-1 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
                  >
                    Follow Behavior ({autoFollow})
                  </button>
                </div>
              </section>

              {/* Notification Settings */}
              <section className="flex flex-col rounded-lg border border-border bg-background p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Notifications className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Customize which notifications you receive.
                </p>
                <button
                  onClick={() => setIsNotificationsModalOpen(true)}
                  className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted sm:w-max"
                >
                  Configure Notifications
                </button>
              </section>

              {/* Security Settings */}
              <section className="flex flex-col rounded-lg border border-border bg-background p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Security className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Enable two-factor authentication to secure your account.
                </p>
                <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                  <span className="text-sm font-medium text-foreground">
                    Two-Factor Auth ({twoFactorAuth ? 'On' : 'Off'})
                  </span>
                  <button
                    onClick={() => setIsTwoFactorAuthModalOpen(true)}
                    className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
                  >
                    Configure
                  </button>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="flex flex-col rounded-lg border border-destructive/20 bg-destructive/5 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Warning className="text-destructive" />
                  <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Permanently delete your account and all of its data. This action cannot be undone.
                </p>
                <button
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                  className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90 sm:w-max"
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
          <div className="hide-scrollbar max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-1 divide-y divide-border">
              <div className="py-2">
                <CheckboxField
                  label="Network Posts"
                  checked={notificationsNetworkPosts}
                  onChange={(e) => setNotificationsNetworkPosts(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Network Reels"
                  checked={notificationsNetworkReels}
                  onChange={(e) => setNotificationsNetworkReels(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Network Stories"
                  checked={notificationsNetworkStories}
                  onChange={(e) => setNotificationsNetworkStories(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Post Likes"
                  checked={notificationsPostLikes}
                  onChange={(e) => setNotificationsPostLikes(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Reel Likes"
                  checked={notificationsReelLikes}
                  onChange={(e) => setNotificationsReelLikes(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Story Likes"
                  checked={notificationsStoryLikes}
                  onChange={(e) => setNotificationsStoryLikes(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Comment Likes"
                  checked={notificationsCommentLikes}
                  onChange={(e) => setNotificationsCommentLikes(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Post Comments"
                  checked={notificationsPostComments}
                  onChange={(e) => setNotificationsPostComments(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Reel Comments"
                  checked={notificationsReelComments}
                  onChange={(e) => setNotificationsReelComments(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="New Followers"
                  checked={notificationsUserFollows}
                  onChange={(e) => setNotificationsUserFollows(e.target.checked)}
                />
              </div>
              <div className="py-2">
                <CheckboxField
                  label="Follow Requests"
                  checked={notificationsFollowRequests}
                  onChange={(e) => setNotificationsFollowRequests(e.target.checked)}
                />
              </div>
            </div>
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
          <div className="py-4">
            <CheckboxField
              label="Enable Two-Factor Authentication"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
            />
          </div>
        }
        onSave={updateSettings}
        type="SECURITY"
      />
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Delete Account"
        content={
          <div className="py-4">
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              Are you sure you want to delete your account? This action cannot be undone and you
              will lose all data.
            </div>
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
    <label htmlFor={label} className="mb-1.5 block text-sm font-medium text-foreground">
      {label}
    </label>
    <input
      type={type}
      id={label}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
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
    <label htmlFor={label} className="mb-1.5 block text-sm font-medium text-foreground">
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="w-full cursor-pointer rounded-md border border-border bg-input px-3 py-2 capitalize text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
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
  <label className="group flex cursor-pointer items-center gap-3">
    <div className="relative flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-input transition-all checked:border-primary checked:bg-primary"
      />
      <svg
        className="pointer-events-none absolute h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
        ></path>
      </svg>
    </div>
    <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
      {label}
    </span>
  </label>
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
      case 'SETTING':
      case 'SECURITY':
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
      case 'DANGER':
        return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg duration-200">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
        <div className="mb-6">{content}</div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors ${getButtonStyle(type)}`}
          >
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
  type: PropTypes.oneOf(['UPDATE', 'SETTING', 'SECURITY', 'DANGER']).isRequired,
};

export default SettingsPage;
