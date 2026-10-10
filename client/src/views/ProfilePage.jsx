import MainLayout from '../components/layout/MainLayout';
import {
  ArrowBackSharp,
  Link as LinkIcon,
  CalendarToday,
  Edit,
  Settings,
  Male,
  Female,
  Transgender,
  CheckCircle,
  PersonAdd,
  HourglassEmpty,
  Email,
  Lock,
  Send,
} from '@mui/icons-material';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  follow,
  getUserProfile,
  unfollow,
  updateProfileAndCoverImage,
  updateProfileInfo,
} from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setUser } from '../redux/slices/userSlice';
import RequestsModal from '../components/profile/RequestsModal';
import ConnectionsModal from '../components/profile/ConnectionsModal';
import ProfileTabs from '../components/profile/ProfileTabs';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState('');
  const [profileType, setProfileType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverImage, setCoverImage] = useState();
  const [profileImage, setProfileImage] = useState();
  const [coverImageFile, setCoverImageFile] = useState();
  const [profileImageFile, setProfileImageFile] = useState();

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (coverImage) {
      URL.revokeObjectURL(coverImage);
    }
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
    setCoverImageFile(file);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (profileImage) {
      URL.revokeObjectURL(profileImage);
    }
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
    setProfileImageFile(file);
  };

  const dispatch = useDispatch();
  const userProfileData = useSelector((state) => state?.user?.profile);

  const [isEditable, setIsEditable] = useState(false);
  const [fullname, setFullname] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  const toogleEditable = () => {
    setFullname(profileData?.fullname);
    setBio(profileData?.bio);
    setLink(profileData?.link);
    setDateOfBirth(new Date(profileData?.dateOfBirth).toISOString().split('T')[0]);
    setGender(profileData?.gender);
    setIsEditable((prev) => !prev);
  };

  const profileSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, 'Fullname must be at least 3 characters')
      .max(50, 'Fullname must not exceed 50 characters') // Corrected limit
      .matches(/^[A-Za-z ]+$/, 'Full name can only contain letters and spaces')
      .required('Full name is required'),
    dob: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    gender: Yup.string()
      .oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Please select a valid gender')
      .required('Gender is required'),
  });

  const updateHandler = async () => {
    if (isEditable) {
      try {
        const formData = {
          fullname,
          dob: dateOfBirth,
          gender: gender.toLowerCase(),
        };

        await profileSchema.validate(formData, { abortEarly: false });

        await updateProfileInfo({
          fullname,
          link,
          bio,
          dateOfBirth,
          gender,
        });
        setProfileData((prev) => {
          return {
            ...prev,
            fullname,
            bio,
            link,
            dateOfBirth,
            gender,
          };
        });
        dispatch(
          setUser({
            ...userProfileData,
            fullname,
          })
        );
        toast.success('Profile updated successfully!');
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || 'Data not updated');
      } finally {
        setIsEditable(false);
      }
    }

    if (!coverImageFile && !profileImageFile) {
      return;
    }
    const formData = new FormData();
    if (coverImageFile) {
      formData.append('coverPicture', coverImageFile);
    }
    if (profileImageFile) {
      formData.append('profilePicture', profileImageFile);
    }
    try {
      const response = await updateProfileAndCoverImage(formData);
      setProfileData((prev) => {
        return {
          ...prev,
          coverPictureUrl: response.data.coverPictureUrl,
          profilePictureUrl: response.data.profilePictureUrl,
        };
      });
      dispatch(
        setUser({
          ...userProfileData,
          profilePictureUrl: response.data.profilePictureUrl,
        })
      );
    } catch (error) {
      console.log(error);
      toast.error('Image Upload Error');
    } finally {
      setCoverImageFile(null);
      setProfileImageFile(null);
    }
  };

  const [followStatus, setFollowStatus] = useState('NOT_FOLLOWED');

  const followStatusClickHandler = async () => {
    console.log(followStatus);
    if (followStatus === 'FOLLOWED') {
      try {
        const response = await unfollow(profileData.id);
        if (response.data?.currentStatus === 'NOT_FOLLOWED') {
          setProfileData((prev) => {
            return {
              ...prev,
              followersCount: prev?.followersCount - 1,
            };
          });
        }
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === 'NOT_FOLLOWED') {
      try {
        const response = await follow(profileData.id);
        if (response.data?.currentStatus === 'FOLLOWED') {
          setProfileData((prev) => {
            return {
              ...prev,
              followersCount: prev?.followersCount + 1,
            };
          });
        }
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === 'REQUEST_SENT') {
      console.log('already request sent');
    } else {
      console.log('Invalid Status');
    }
  };

  const myId = useSelector((state) => state?.user?.profile?.id);
  const { userId } = useParams();

  const isMyProfile = myId === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        const data = response.data;
        setProfileData(data);
        setProfileType(data?.profileType);
        setCoverImage(data?.coverPictureUrl);
        setProfileImage(data?.profilePictureUrl);
        setFollowStatus(data?.followStatus);
      } catch (err) {
        console.log(err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const navigate = useNavigate();
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleCancel = () => {
    setCoverImage(profileData?.coverPictureUrl);
    setProfileImage(profileData?.profilePictureUrl);
    setCoverImageFile(null);
    setProfileImageFile(null);
    setIsEditable(false);
  };

  const [isSentRequestsModalOpen, setIsSentRequestsModalOpen] = useState(false);
  const handleSentRequestsModalOpen = () => {
    setIsSentRequestsModalOpen(true);
  };
  const handleSentRequestsModalClose = () => {
    setIsSentRequestsModalOpen(false);
  };
  const [isReceivedRequestsModalOpen, setIsReceivedRequestsModalOpen] = useState(false);
  const handleReceivedRequestsModalOpen = () => {
    setIsReceivedRequestsModalOpen(true);
  };
  const handleReceivedRequestsModalClose = () => {
    setIsReceivedRequestsModalOpen(false);
  };
  const [isFollowersModelOpen, setIsFollowersModelOpen] = useState(false);
  const handleFollowersModelOpen = () => {
    setIsFollowersModelOpen(true);
  };
  const handleFollowersModelClose = () => {
    setIsFollowersModelOpen(false);
  };
  const [isFollowingsModelOpen, setIsFollowingsModelOpen] = useState(false);
  const handleFollowingsModelOpen = () => {
    setIsFollowingsModelOpen(true);
  };
  const handleFollowingsModelClose = () => {
    setIsFollowingsModelOpen(false);
  };

  useEffect(() => {
    handleSentRequestsModalClose();
    handleReceivedRequestsModalClose();
    handleFollowersModelClose();
    handleFollowingsModelClose();
  }, [userId]);

  return (
    <MainLayout>
      <div className="mx-auto flex w-full justify-center bg-background pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-3xl flex-col justify-center">
          {error && (
            <div className="mt-[15dvh] flex min-h-[200px] w-full flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm">
              <h1 className="mb-4 text-lg font-bold text-destructive">Profile Not Found</h1>
              <p className="text-center text-sm text-muted-foreground">
                An error occurred while loading the profile, or the profile doesn&apos;t exist.
                Please try again later or contact support.
              </p>
              <button
                className="mt-4 rounded-lg bg-primary px-6 py-2 text-primary-foreground shadow-sm transition duration-200 hover:bg-primary/90"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          )}
          {loading && (
            <div className="mt-[15dvh] flex min-h-[200px] w-full flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="text-lg font-bold">
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </div>
          )}
          {!error && !loading && profileData && (
            <div className="my-0 flex min-h-screen flex-col rounded-xl border-x border-border bg-card px-4 shadow-sm md:my-4 md:min-h-[auto] md:border-y">
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  <div
                    onClick={handleBackClick}
                    className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowBackSharp className="text-2xl" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold text-foreground">{profileData?.fullname}</p>
                    <span className="text-sm text-muted-foreground">
                      {/* {profileData?.postsCount}{" "} */}
                      {/* {profileData?.postsCount === 1 ? "post" : "posts"} */}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  {isMyProfile && (
                    <div className="flex justify-center gap-4 px-5">
                      <div className="group relative">
                        <button
                          className="flex items-center justify-center gap-2 rounded-full p-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                          onClick={handleReceivedRequestsModalOpen}
                        >
                          <Send className="h-4 w-4 rotate-180" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition duration-200 group-hover:opacity-100">
                          Received Requests
                        </span>
                      </div>

                      <div className="group relative">
                        <button
                          className="flex items-center justify-center gap-2 rounded-full p-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
                          onClick={handleSentRequestsModalOpen}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition duration-200 group-hover:opacity-100">
                          Sent Requests
                        </span>
                      </div>
                    </div>
                  )}

                  {isMyProfile && (
                    <Link
                      to="/settings"
                      className="cursor-pointer rounded-full p-2 text-muted-foreground transition duration-200 hover:bg-muted hover:text-foreground"
                    >
                      <Settings className="text-2xl" />
                    </Link>
                  )}
                </div>
              </div>

              {!isMyProfile && profileType === 'PRIVATE' && (
                <div className="mx-4 mt-4 flex items-center justify-center gap-2 rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock fontSize="small" />
                    <p className="font-medium">This Profile is Private</p>
                  </div>
                </div>
              )}

              <div className="relative mt-2 overflow-hidden rounded-xl">
                <div className="group relative">
                  <img
                    src={coverImage}
                    alt="Cover Image"
                    className="h-52 w-full object-cover md:h-64 lg:h-72"
                  />
                  {isMyProfile && (
                    <>
                      <label
                        htmlFor="cover-upload"
                        className="absolute bottom-4 right-4 hidden cursor-pointer rounded-full bg-black/60 p-2.5 text-white shadow-md backdrop-blur-sm transition-all hover:bg-black/80 group-hover:block"
                      >
                        <Edit fontSize="small" />
                      </label>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverImageChange}
                      />
                    </>
                  )}
                </div>
                <div className="absolute left-6 top-40 z-10 md:left-10 md:top-44 lg:left-16 lg:top-48">
                  <div className="group relative h-28 w-28 overflow-hidden rounded-full border-4 border-card bg-card shadow-lg md:h-36 md:w-36 lg:h-44 lg:w-44">
                    <img
                      src={profileImage}
                      alt="Profile Image"
                      className="h-full w-full object-cover"
                    />
                    {isMyProfile && (
                      <>
                        <label
                          htmlFor="profile-upload"
                          className="absolute bottom-0 left-0 right-0 hidden cursor-pointer bg-black/50 py-1.5 text-center text-white backdrop-blur-sm transition-all hover:bg-black/70 group-hover:block"
                        >
                          <Edit fontSize="small" />
                        </label>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileImageChange}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-14 flex h-10 items-center justify-end gap-3 px-6">
                {!isMyProfile && (
                  <button
                    onClick={followStatusClickHandler}
                    className={`flex transform items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:scale-105 ${
                      followStatus === 'FOLLOWED'
                        ? 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : ''
                    } ${followStatus === 'NOT_FOLLOWED' ? 'bg-primary hover:bg-primary/90' : ''} ${
                      followStatus === 'REQUEST_SENT'
                        ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                        : ''
                    } `}
                  >
                    {followStatus === 'FOLLOWED' && (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="hidden md:inline">Following</span>
                      </>
                    )}
                    {followStatus === 'NOT_FOLLOWED' && (
                      <>
                        <PersonAdd className="h-4 w-4" />
                        <span className="hidden md:inline">Follow</span>
                      </>
                    )}
                    {followStatus === 'REQUEST_SENT' && (
                      <>
                        <HourglassEmpty className="h-4 w-4" />
                        <span className="hidden md:inline">Requested</span>
                      </>
                    )}
                  </button>
                )}

                {!isMyProfile && (
                  <Link to={`/chat/${profileData.id}`}>
                    <button className="flex transform items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-sm transition duration-200 hover:scale-105 hover:bg-muted">
                      <Email fontSize="small" />
                      Message
                    </button>
                  </Link>
                )}

                {isMyProfile && (profileImageFile || coverImageFile || isEditable) && (
                  <button
                    className="ml-3 flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md transition duration-200 hover:bg-primary/90"
                    onClick={updateHandler}
                    aria-label="Update profile"
                  >
                    Save Changes
                  </button>
                )}

                {isMyProfile && (profileImageFile || coverImageFile || isEditable) && (
                  <button
                    className="flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition duration-200 hover:bg-muted"
                    onClick={handleCancel}
                    aria-label="Cancel changes"
                  >
                    Cancel
                  </button>
                )}

                {isMyProfile && !isEditable && !(profileImageFile || coverImageFile) && (
                  <div
                    className="cursor-pointer rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-muted"
                    onClick={toogleEditable}
                  >
                    <Edit fontSize="small" />
                  </div>
                )}
              </div>

              <div className="px-6 py-4">
                {!isEditable && (
                  <div className="pb-1 text-2xl font-bold text-foreground">
                    {profileData?.fullname}
                  </div>
                )}
                {isMyProfile && isEditable && (
                  <input
                    type="text"
                    placeholder="Fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="block w-full rounded-lg bg-input p-2 text-2xl font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}

                <span className="text-sm font-medium text-muted-foreground">
                  @{profileData?.username}
                </span>

                {profileType === 'PUBLIC' && profileData?.email && (
                  <p className="mt-2 text-sm text-foreground/80">{profileData?.email}</p>
                )}

                {profileType === 'PUBLIC' && (
                  <>
                    {!isEditable && profileData?.bio && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {profileData?.bio}
                      </p>
                    )}
                    {isMyProfile && isEditable && (
                      <textarea
                        value={bio}
                        placeholder="Bio"
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-3 min-h-[80px] w-full rounded-lg bg-input p-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    )}
                  </>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                  {profileType === 'PUBLIC' && (
                    <>
                      {(profileData?.link || (isMyProfile && isEditable)) && (
                        <div>
                          {!isEditable && profileData?.link && (
                            <a
                              href={profileData.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                              <LinkIcon fontSize="small" className="text-muted-foreground" />
                              {profileData.link.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 rounded-lg bg-input p-2 text-sm">
                              <LinkIcon fontSize="small" className="text-muted-foreground" />
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full bg-transparent text-primary outline-none"
                                placeholder="https://your-link.com"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {profileType === 'PUBLIC' && (
                    <>
                      {(profileData?.dateOfBirth || (isMyProfile && isEditable)) && (
                        <div>
                          {!isEditable && profileData?.dateOfBirth && (
                            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                              <CalendarToday fontSize="small" />
                              <span>
                                Born{' '}
                                {new Date(profileData?.dateOfBirth).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 rounded-lg bg-input p-2 text-sm">
                              <CalendarToday fontSize="small" className="text-muted-foreground" />
                              <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full bg-transparent text-foreground outline-none"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {profileType === 'PUBLIC' && (
                    <>
                      {(profileData?.gender || (isMyProfile && isEditable)) && (
                        <div>
                          {!isEditable &&
                            profileData?.gender &&
                            profileData.gender !== 'PREFER_NOT_TO_SAY' && (
                              <div className="flex items-center gap-1.5 text-sm font-medium capitalize text-muted-foreground">
                                {profileData.gender === 'MALE' && <Male fontSize="small" />}
                                {profileData.gender === 'FEMALE' && <Female fontSize="small" />}
                                {profileData.gender === 'OTHER' && <Transgender fontSize="small" />}
                                <span>{profileData.gender.toLowerCase()}</span>
                              </div>
                            )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 rounded-lg bg-input p-2 text-sm">
                              <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="cursor-pointer bg-transparent text-foreground outline-none"
                              >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-5 flex gap-6 border-t border-border pt-4">
                  {isMyProfile ? (
                    <>
                      <div
                        className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        onClick={handleFollowingsModelOpen}
                      >
                        <span className="font-bold text-foreground">
                          {profileData?.followingsCount}
                        </span>
                        Following
                      </div>
                      <div
                        className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        onClick={handleFollowersModelOpen}
                      >
                        <span className="font-bold text-foreground">
                          {profileData?.followersCount}
                        </span>
                        Followers
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">
                          {profileData?.followingsCount}
                        </span>
                        Following
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">
                          {profileData?.followersCount}
                        </span>
                        Followers
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-2 border-t border-border">
                <ProfileTabs userId={userId} isMyProfile={isMyProfile} profileType={profileType} />
              </div>
            </div>
          )}
        </div>
      </div>
      <RequestsModal
        type="SENT"
        isOpen={isSentRequestsModalOpen}
        closeModal={handleSentRequestsModalClose}
      />
      <RequestsModal
        type="RECEIVED"
        isOpen={isReceivedRequestsModalOpen}
        closeModal={handleReceivedRequestsModalClose}
      />
      <ConnectionsModal
        type="FOLLOWER"
        isOpen={isFollowersModelOpen}
        closeModal={handleFollowersModelClose}
      />
      <ConnectionsModal
        type="FOLLOWING"
        isOpen={isFollowingsModelOpen}
        closeModal={handleFollowingsModelClose}
      />
    </MainLayout>
  );
};

export default ProfilePage;
