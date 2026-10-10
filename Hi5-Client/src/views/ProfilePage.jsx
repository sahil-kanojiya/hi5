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
      <div className="mx-auto flex w-full justify-center bg-gray-100 pt-[70px] dark:bg-gray-900 md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-3xl flex-col justify-center">
          {error && (
            <div className="mt-[15dvh] flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h1 className="mb-4 text-lg font-bold text-red-600">Profile Not Found</h1>
              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                An error occurred while loading the profile, or the profile doesn&apos;t exist.
                Please try again later or contact support.
              </p>
              <button
                className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white shadow-md transition duration-200 hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          )}
          {loading && (
            <div className="mt-[15dvh] flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="text-lg font-bold">
                <span className="text-gray-600 dark:text-gray-300">Loading...</span>
              </div>
            </div>
          )}
          {!error && !loading && profileData && (
            <div className="my-0 flex min-h-screen flex-col rounded-lg bg-white px-4 shadow-md dark:bg-black md:my-4">
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  <div onClick={handleBackClick} className="cursor-pointer text-gray-500">
                    <ArrowBackSharp className="text-2xl" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-bold">{profileData?.fullname}</p>
                    <span className="text-sm text-gray-600">
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
                          className="flex items-center justify-center gap-2 rounded-full p-1 text-sm font-medium text-slate-500 transition"
                          onClick={handleReceivedRequestsModalOpen}
                        >
                          <Send className="h-2 w-2 rotate-180" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition duration-200 group-hover:opacity-100">
                          Received Requests
                        </span>
                      </div>

                      <div className="group relative">
                        <button
                          className="flex items-center justify-center gap-2 rounded-full p-1 text-sm font-medium text-slate-500 transition"
                          onClick={handleSentRequestsModalOpen}
                        >
                          <Send className="h-2 w-2" />
                        </button>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition duration-200 group-hover:opacity-100">
                          Sent Requests
                        </span>
                      </div>
                    </div>
                  )}

                  {isMyProfile && (
                    <Link
                      to="/settings"
                      className="cursor-pointer text-gray-500 transition duration-200 hover:text-gray-600 dark:hover:text-gray-400"
                    >
                      <Settings className="text-2xl" />
                    </Link>
                  )}
                </div>
              </div>

              {!isMyProfile && profileType === 'PRIVATE' && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-100 p-3 dark:bg-gray-900">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lock fontSize="small" />
                    <p className="font-medium">This Profile is Private</p>
                  </div>
                </div>
              )}

              <div className="relative">
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
                        className="absolute bottom-3 right-3 hidden cursor-pointer rounded-full bg-black/50 p-2 text-white group-hover:block"
                      >
                        <Edit />
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
                <div className="absolute left-5 top-40 md:left-10 md:top-44 lg:left-16 lg:top-48">
                  <div className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 dark:border-gray-800 md:h-32 md:w-32 lg:h-40 lg:w-40">
                    <img
                      src={profileImage}
                      alt="Profile Image"
                      className="h-full w-full object-cover"
                    />
                    {isMyProfile && (
                      <>
                        <label
                          htmlFor="profile-upload"
                          className="absolute bottom-3 right-3 hidden cursor-pointer rounded-full bg-black/50 p-2 text-white group-hover:block"
                        >
                          <Edit />
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

              <div className="mt-10 flex h-10 items-center justify-end gap-3 px-6">
                {!isMyProfile && (
                  <button
                    onClick={followStatusClickHandler}
                    className={`flex transform items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 min-[410px]:px-4 ${
                      followStatus === 'FOLLOWED' ? 'bg-green-500 hover:bg-green-600' : ''
                    } ${followStatus === 'NOT_FOLLOWED' ? 'bg-blue-500 hover:bg-blue-600' : ''} ${
                      followStatus === 'REQUEST_SENT' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
                    } `}
                  >
                    {followStatus === 'FOLLOWED' && (
                      <>
                        <CheckCircle className="h-5 w-5 text-white" />
                        <span className="hidden md:inline">Following</span>
                      </>
                    )}
                    {followStatus === 'NOT_FOLLOWED' && (
                      <>
                        <PersonAdd className="h-5 w-5 text-white" />
                        <span className="hidden md:inline">Follow</span>
                      </>
                    )}
                    {followStatus === 'REQUEST_SENT' && (
                      <>
                        <HourglassEmpty className="h-5 w-5 text-white" />
                        <span className="hidden md:inline">Requested</span>
                      </>
                    )}
                  </button>
                )}

                {!isMyProfile && (
                  <Link to={`/chat/${profileData.id}`}>
                    <button className="flex transform items-center gap-2 rounded-full bg-gray-800 px-5 py-2 text-sm font-medium text-white shadow-md transition duration-200 hover:scale-105 hover:bg-gray-900">
                      <Email />
                      Message
                    </button>
                  </Link>
                )}

                {isMyProfile && (profileImageFile || coverImageFile || isEditable) && (
                  <button
                    className="ml-3 flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm text-white shadow-md transition duration-200 hover:bg-gray-900"
                    onClick={updateHandler}
                    aria-label="Update profile"
                  >
                    Update
                  </button>
                )}

                {isMyProfile && (profileImageFile || coverImageFile || isEditable) && (
                  <button
                    className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm text-white shadow-md transition duration-200 hover:bg-gray-900"
                    onClick={handleCancel}
                    aria-label="Cancel changes"
                  >
                    Cancel
                  </button>
                )}

                {isMyProfile && (
                  <div className="rounded-full p-2 hover:bg-gray-200" onClick={toogleEditable}>
                    <Edit />
                  </div>
                )}
              </div>

              <div className="p-4">
                {!isEditable && (
                  <div className="px-1 pb-1 text-2xl font-bold">{profileData?.fullname}</div>
                )}
                {isMyProfile && isEditable && (
                  <input
                    type="text"
                    placeholder="Fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="block rounded-lg bg-gray-200 px-1 pb-1 text-2xl font-bold dark:bg-gray-800"
                  />
                )}

                <span className="px-1 text-sm text-gray-500">@{profileData?.username}</span>

                {profileType === 'PUBLIC' && profileData?.email && (
                  <p className="mt-2 px-1 text-gray-700 dark:text-gray-300">{profileData?.email}</p>
                )}

                {profileType === 'PUBLIC' && (
                  <>
                    {!isEditable && profileData?.bio && (
                      <p className="mt-2 p-1 text-sm text-gray-700 dark:text-gray-300">
                        {profileData?.bio}
                      </p>
                    )}
                    {isMyProfile && isEditable && (
                      <textarea
                        value={bio}
                        placeholder="Bio"
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-2 w-full rounded-lg bg-gray-200 p-1 text-sm text-gray-700 outline-none dark:bg-gray-800 dark:text-gray-300"
                      />
                    )}
                  </>
                )}

                <div className="flex flex-col items-start gap-6 pt-2 sm:flex-row sm:items-center">
                  {profileType === 'PUBLIC' && (
                    <>
                      {(profileData?.link || (isMyProfile && isEditable)) && (
                        <div>
                          {!isEditable && profileData?.link && (
                            <a
                              href={profileData.link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-lg p-1 text-sm text-blue-500 hover:underline"
                            >
                              <LinkIcon className="text-gray-500" />
                              {profileData.link}
                            </a>
                          )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-1 text-sm dark:bg-gray-800">
                              <LinkIcon className="text-gray-500" />
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full bg-transparent text-blue-500 outline-none"
                                placeholder="Link"
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
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <CalendarToday />
                              <span>
                                DOB {new Date(profileData?.dateOfBirth).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-1 text-sm dark:bg-gray-800">
                              <CalendarToday className="text-gray-500" />
                              <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full bg-transparent text-blue-500 outline-none"
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
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <span>
                                  {profileData.gender === 'MALE' && <Male />}
                                  {profileData.gender === 'FEMALE' && <Female />}
                                  {profileData.gender === 'OTHER' && <Transgender />}
                                  {' ' + profileData.gender}
                                </span>
                              </div>
                            )}
                          {isMyProfile && isEditable && (
                            <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-1 text-sm dark:bg-gray-800">
                              <span>Gender:</span>
                              <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="bg-transparent text-blue-500 outline-none"
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

                <div className="mt-4 flex gap-4">
                  {isMyProfile ? (
                    <>
                      <div
                        className="flex cursor-pointer items-center gap-1 text-sm"
                        onClick={handleFollowingsModelOpen}
                      >
                        <span className="font-bold">{profileData?.followingsCount}</span>
                        Following
                      </div>
                      <div
                        className="flex cursor-pointer items-center gap-1 text-sm"
                        onClick={handleFollowersModelOpen}
                      >
                        <span className="font-bold">{profileData?.followersCount}</span>
                        Followers
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-bold">{profileData?.followingsCount}</span>
                        Following
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-bold">{profileData?.followersCount}</span>
                        Followers
                      </div>
                    </>
                  )}
                </div>
              </div>

              <ProfileTabs userId={userId} isMyProfile={isMyProfile} profileType={profileType} />
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
