import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  follow,
  getSharedPost,
  getSharedPostWithoutAuth,
  getSharedReel,
  getSharedReelWithoutAuth,
  likeEntity,
  reportEntity,
  save,
  unfollow,
  unlikeEntity,
  unsave,
} from '../services/api';
import {
  BookmarkBorderOutlined,
  BookmarkSharp,
  CheckCircle,
  CommentOutlined,
  CommentsDisabled,
  DarkMode,
  FavoriteBorderSharp,
  FavoriteSharp,
  HourglassEmpty,
  LightMode,
  PersonAdd,
  Report,
  ReportGmailerrorred,
  ShareSharp,
  VolumeOffOutlined,
  VolumeUpOutlined,
} from '@mui/icons-material';
import logo from '../assets/images/logo/hi5.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';
import TimeAgo from '../components/common/TimeAgo';
import ReportConfirmationModal from '../components/modal/ReportConfirmationModal';
import CommentModel from '../components/comment/CommentModel';

const SharedMediaPage = () => {
  const { entity, entityId } = useParams();

  const [entityData, setEntityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isInitializing = useSelector((state) => state.auth.isInitializing);
  const user = useSelector((state) => state.user.profile);

  useEffect(() => {
    const fetchEntity = async () => {
      if (!entityId || entityId.trim() === '') {
        setError('Invalid ID provided.');
        setIsLoading(false);
        return;
      }
      if (entity === 'post') {
        try {
          setIsLoading(true);
          if (isAuthenticated) {
            const response = await getSharedPost(entityId);
            setEntityData(response.data);
            setData(response.data);
          } else {
            const response = await getSharedPostWithoutAuth(entityId);
            setEntityData(response.data);
            setData(response.data);
          }
        } catch (err) {
          if (err?.response?.data?.statusCode === 400) {
            console.log('error set');
            setError(err?.response?.data?.message);
          } else {
            setError('Failed to load post. Please try again later.');
          }
        } finally {
          setIsLoading(false);
        }
      } else if (entity === 'reel') {
        try {
          setIsLoading(true);
          if (isAuthenticated) {
            const response = await getSharedReel(entityId);
            setEntityData(response.data);
            setData(response.data);
          } else {
            const response = await getSharedReelWithoutAuth(entityId);
            setEntityData(response.data);
            setData(response.data);
          }
        } catch (err) {
          console.log(err);
          setError('Failed to load post. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('Invalid entity type.');
        setIsLoading(false);
        return;
      }
    };
    if (!isInitializing) {
      fetchEntity();
    }
  }, [entity, entityId, isAuthenticated, isInitializing]);

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const changeThemeClickHandler = () => {
    dispatch(toggleTheme());
  };

  const [isMyEntity, setIsMyEntity] = useState(entityData?.userId === user?.id);

  const navigate = useNavigate();
  const setData = useCallback(
    (data) => {
      setEntityData(data);
      setIsMyEntity(data?.userId === user?.id);
      setIsReported(data?.reportStatus === 'REPORTED');
      setIsLiked(data?.likeStatus === 'LIKED');
      setLikesCount(data?.likesCount);
      setCommentCount(data?.commentsCount);
      setIsSaved(data?.saveStatus === 'SAVED');
      if (data?.followStatus) {
        setFollowStatus(data?.followStatus);
      }
    },
    [user]
  );

  const [commentCount, setCommentCount] = useState(entityData?.commentsCount);
  const [isCommentModelOpen, setIsCommentModelOpen] = useState(false);
  const openCommentModel = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsCommentModelOpen(true);
  };
  const closeCommentModel = () => {
    setIsCommentModelOpen(false);
  };

  const [isReported, setIsReported] = useState(entityData?.reportStatus === 'REPORTED');
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsReportModal(true);
  };
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = useCallback(
    async (reportReason) => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      setIsReporting(true);
      try {
        await reportEntity({
          relevantId: entityData?.id,
          reason: reportReason,
          type: entity.toUpperCase(),
        });
        console.log('Entity reported: ' + entityData?.id + '  reason: ' + reportReason);
      } catch (error) {
        console.error('Error reporting post: ', error);
      } finally {
        setIsReporting(false);
        setIsReported(true);
        closeReportModal();
      }
    },
    [isAuthenticated, navigate, entityData, entity, closeReportModal]
  );

  const [isLiked, setIsLiked] = useState(entityData?.likeStatus === 'LIKED');
  const [likesCount, setLikesCount] = useState(entityData?.likesCount);
  const likeClickHandler = useCallback(async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const id = entityData?.id;
    if (isLiked) {
      unlikeEntity({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log('unliked ' + id);
    } else {
      likeEntity({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log('liked ' + id);
    }
  }, [isAuthenticated, navigate, isLiked, entityData, entity]);

  const [isSaved, setIsSaved] = useState(entityData?.saveStatus === 'SAVED');
  const saveClickHandler = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const id = entityData?.id;
    if (isSaved) {
      unsave({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setIsSaved(false);
      console.log('unsaved ' + id);
    } else {
      save({
        relevantId: id,
        type: entity.toUpperCase(),
      });
      setIsSaved(true);
      console.log('saved ' + id);
    }
  }, [isAuthenticated, navigate, isSaved, entityData, entity]);

  const shareClickHandler = () => {
    if (navigator?.share) {
      navigator
        .share({
          title: 'Check out this post!',
          text: 'This is an interesting post I found.',
          url: `http://localhost:3000/share/${entity}/${entityId}`,
        })
        .then(() => console.log('Share successful'))
        .catch((error) => console.error('Share failed:', error));
    } else {
      alert('Web Share API not supported in this browser.');
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleClick = () => {
    const videoElement = videoRef.current;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const [expanded, setExpanded] = useState(false);

  const [followStatus, setFollowStatus] = useState(entityData?.followStatus);

  const followStatusClickHandler = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (followStatus === 'FOLLOWED') {
      try {
        const response = await unfollow(entityData?.userId);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === 'NOT_FOLLOWED') {
      try {
        const response = await follow(entityData?.userId);
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

  if (isInitializing) {
    return null;
  }

  return (
    <>
      <header className="bg-white p-3 shadow-md dark:bg-black">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center justify-center gap-3">
            <img src={logo} alt="Hi5 Logo" className="w-10" />
            <p className="hidden font-lobster text-4xl sm:block md:hidden lg:block">Hi5</p>
          </Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {!isAuthenticated && (
                <>
                  <Link to="/login">
                    <button className="rounded-lg bg-gray-200 px-2 py-2 text-gray-700 shadow-md transition hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900 sm:px-4">
                      Login
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="rounded-lg bg-gray-200 px-2 py-2 text-gray-700 shadow-md transition hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900 sm:px-4">
                      SignUp
                    </button>
                  </Link>
                </>
              )}
            </div>

            <button
              className="flex cursor-pointer items-center justify-center rounded-md bg-gray-200 p-2 transition-all duration-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={changeThemeClickHandler}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <LightMode className="text-gray-200 transition-all duration-300" />
              ) : (
                <DarkMode className="text-gray-800 transition-all duration-300 dark:text-gray-200" />
              )}
            </button>

            {isAuthenticated && user?.role === 'USER' && (
              <div className="flex items-center justify-center lg:gap-2">
                <Link to={isAuthenticated ? `/profile/${user.id}` : '/login'}>
                  <img
                    src={user.profilePictureUrl}
                    alt={`${user.username}'s profile image`}
                    className="h-8 w-8 rounded-full lg:h-10 lg:w-10"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-80px)] items-center justify-center space-x-2 pt-5">
        {isLoading && (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-lg font-semibold text-blue-600">
              {entity === 'post' && 'Loading post, please wait...'}
              {entity === 'reel' && 'Loading reel, please wait...'}
            </p>
          </>
        )}
        {error && (
          <div className="rounded-lg px-5 py-2 text-center text-red-600 shadow-xl">{error}</div>
        )}
        {!isLoading && !error && entity == 'post' && entityData && (
          <>
            <div className="mx-auto mb-6 w-full max-w-xl rounded-lg bg-white p-3 shadow-md dark:bg-black sm:p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link to={isAuthenticated ? `/profile/${entityData.userId}` : '/login'}>
                    <img
                      src={entityData.profilePictureUrl}
                      alt={`${entityData.fullname}'s profile`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="text-md font-semibold sm:text-lg">{entityData.fullname}</p>
                    <p className="flex flex-col items-start space-x-1 whitespace-nowrap text-sm text-gray-500 sm:flex-row sm:items-center">
                      <span>@{entityData.username}</span>
                      <span className="hidden sm:block">•</span>
                      <TimeAgo
                        date={entityData.createdAt}
                        className="sm:text-md whitespace-nowrap pt-1 text-xs font-medium sm:pt-0"
                      />
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {!isMyEntity &&
                    (isReported ? (
                      <Report
                        className="transform cursor-not-allowed text-red-500 transition duration-200"
                        title="This post has already been reported"
                      />
                    ) : (
                      <ReportGmailerrorred
                        className="transform cursor-pointer text-gray-600 transition duration-200 hover:scale-110 hover:text-red-500"
                        onClick={openReportModal}
                        title="Report this post"
                      />
                    ))}

                  {isSaved ? (
                    <BookmarkSharp
                      className="transform cursor-pointer text-yellow-600 transition duration-200 hover:scale-110"
                      onClick={saveClickHandler}
                      title="Unsave this post"
                    />
                  ) : (
                    <BookmarkBorderOutlined
                      className="transform cursor-pointer text-gray-600 transition duration-200 hover:scale-110 hover:text-yellow-600"
                      onClick={saveClickHandler}
                      title="Save this post"
                    />
                  )}
                </div>
              </div>

              <div className="mb-4 w-full">
                <p className="w-full whitespace-pre-wrap break-words px-2 text-sm text-gray-800 dark:text-gray-200 sm:text-base">
                  {entityData.content}
                </p>
              </div>

              {entityData.imageUrl && (
                <div className="mb-4 h-full w-full">
                  <img
                    src={entityData.imageUrl}
                    alt="Post content"
                    className="h-auto max-h-[90dvh] w-full rounded-md object-contain"
                  />
                </div>
              )}
              {entityData.videoUrl && (
                <div className="mb-4 h-full w-full">
                  <video
                    src={entityData.videoUrl}
                    controls
                    className="h-auto max-h-[90dvh] w-full rounded-md object-contain"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-gray-500">
                <div className="ml-2 flex items-center space-x-5">
                  <button
                    className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
                    onClick={likeClickHandler}
                  >
                    {isLiked ? (
                      <FavoriteSharp className="h-5 w-5 text-red-600 transition-colors duration-200" />
                    ) : (
                      <FavoriteBorderSharp className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-red-600" />
                    )}
                    <span className="text-sm font-medium group-hover:text-red-500">
                      {likesCount}
                    </span>
                  </button>

                  {entityData?.isCommentsDisabled === true ? (
                    <button className="flex cursor-not-allowed items-center space-x-2">
                      <CommentsDisabled
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      />
                      <span className="text-xs font-medium sm:text-sm">0</span>
                    </button>
                  ) : (
                    <button className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110">
                      <CommentOutlined
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 transition-colors duration-200 hover:text-blue-500 sm:h-6 sm:w-6"
                        onClick={openCommentModel}
                      />
                      <span className="text-xs font-medium sm:text-sm">{commentCount}</span>
                    </button>
                  )}

                  <button
                    className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
                    onClick={shareClickHandler}
                  >
                    <ShareSharp className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-green-500" />
                    <span className="text-xs group-hover:text-green-500">Share</span>
                  </button>
                </div>
              </div>

              <ReportConfirmationModal
                isOpen={isReportModalOpen}
                closeModal={closeReportModal}
                report={confirmReport}
                isReporting={isReporting}
                type={entity.toUpperCase()}
              />
              {isAuthenticated && entityData?.isCommentsDisabled !== true && (
                <>
                  <CommentModel
                    isOpen={isCommentModelOpen}
                    onClose={closeCommentModel}
                    type={entity.toUpperCase()}
                    relevantId={entityId}
                    updateCommentCount={setCommentCount}
                    commentCount={commentCount}
                  />
                </>
              )}
            </div>
          </>
        )}
        {!isLoading && !error && entity == 'reel' && (
          <>
            <div
              id="video-container"
              className="hide-scrollbar h-[87dvh] w-full max-w-md snap-y snap-mandatory overflow-scroll bg-white dark:bg-black md:h-screen"
            >
              <div className="relative h-full w-full snap-start">
                <div className="absolute left-1/2 top-0 z-10 mb-3 mt-6 flex w-full -translate-x-1/2 transform items-center justify-center rounded-lg bg-white/15 p-2 px-4 text-xs text-black dark:bg-black/20 dark:text-white sm:mt-4 sm:px-5 md:mt-2 md:px-6 lg:mt-4 lg:px-7">
                  <p className="text-center text-lg font-bold">Reels</p>
                </div>

                <video
                  className="h-full w-full object-cover"
                  src={entityData.videoUrl}
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  onClick={handleClick}
                />

                <div
                  className="textfrom-white absolute bottom-40 right-14 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black bg-opacity-15 p-2 text-white dark:bg-white"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeOffOutlined
                      sx={{
                        fontSize: { xs: 21, sm: 23, md: 25 },
                      }}
                    />
                  ) : (
                    <VolumeUpOutlined
                      sx={{
                        fontSize: { xs: 21, sm: 23, md: 25 },
                      }}
                    />
                  )}
                </div>

                <div className="absolute right-4 top-1/2 flex -translate-y-1/2 transform flex-col items-center space-y-6 text-white sm:right-5 sm:gap-2 md:gap-3 lg:gap-4">
                  <button
                    className="group flex transform flex-col items-center space-y-2 transition duration-200 hover:scale-110"
                    onClick={likeClickHandler}
                  >
                    {isLiked ? (
                      <FavoriteSharp
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 text-red-600 transition-colors duration-200 sm:h-6 sm:w-6"
                      />
                    ) : (
                      <FavoriteBorderSharp
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 transition-colors duration-200 hover:text-red-600 sm:h-6 sm:w-6"
                      />
                    )}
                    <span className="text-xs font-medium sm:text-sm">{likesCount}</span>
                  </button>

                  {entityData?.isCommentsDisabled === true ? (
                    <button className="flex cursor-not-allowed flex-col items-center space-y-1">
                      <CommentsDisabled
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      />
                      <span className="text-xs font-medium sm:text-sm">0</span>
                    </button>
                  ) : (
                    <button className="group flex transform flex-col items-center space-y-2 transition duration-200 hover:scale-110">
                      <CommentOutlined
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 transition-colors duration-200 hover:text-blue-500 sm:h-6 sm:w-6"
                        onClick={openCommentModel}
                      />
                      <span className="text-xs font-medium sm:text-sm">{commentCount}</span>
                    </button>
                  )}

                  <button
                    className="group flex transform items-center space-x-2 transition duration-200 hover:scale-110"
                    onClick={shareClickHandler}
                  >
                    <ShareSharp
                      sx={{
                        fontSize: { xs: 21, sm: 23, md: 25 },
                      }}
                      className="h-5 w-5 transition-colors duration-200 hover:text-green-500 sm:h-6 sm:w-6"
                    />
                  </button>
                  <button
                    className="group flex transform flex-col items-center space-y-2 transition duration-200 hover:scale-110"
                    onClick={saveClickHandler}
                  >
                    {isSaved ? (
                      <BookmarkSharp
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 text-yellow-600 transition-colors duration-200 sm:h-6 sm:w-6"
                      />
                    ) : (
                      <BookmarkBorderOutlined
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="h-5 w-5 transition-colors duration-200 hover:text-yellow-600 sm:h-6 sm:w-6"
                      />
                    )}
                  </button>

                  {!isMyEntity &&
                    (isReported ? (
                      <Report
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="transform cursor-not-allowed text-red-500 transition duration-200"
                        title="This post has already been reported"
                      />
                    ) : (
                      <ReportGmailerrorred
                        sx={{
                          fontSize: { xs: 21, sm: 23, md: 25 },
                        }}
                        className="transform cursor-pointer transition duration-200 hover:scale-110 hover:text-red-500"
                        onClick={openReportModal}
                        title="Report this post"
                      />
                    ))}
                </div>

                <div className="absolute bottom-8 left-1/2 z-10 flex w-full -translate-x-1/2 transform flex-col items-center justify-between rounded-lg bg-white/15 p-2 px-3 text-xs text-white dark:bg-black/20 dark:text-black sm:px-5 md:px-6 lg:px-7">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4">
                      <Link
                        to={isAuthenticated ? `/profile/${entityData.userId}` : '/login'}
                        className="h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                      >
                        <img
                          src={entityData.profilePictureUrl}
                          alt={`${entityData.username}'s profile image`}
                          className="h-full w-full rounded-full border-2 border-gray-800 object-cover shadow-md transition-transform duration-300 hover:scale-105 dark:border-gray-200"
                        />
                      </Link>
                      <div className="flex flex-col text-black dark:text-white">
                        <span className="truncate text-sm font-semibold sm:text-lg md:text-lg">
                          {entityData.fullname}
                        </span>
                        <span className="flex flex-col flex-wrap gap-1 truncate text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:text-sm">
                          <span>@{entityData.username}</span>
                          <TimeAgo date={entityData.createdAt} />
                        </span>
                      </div>
                    </div>

                    {!isMyEntity && (
                      <button
                        onClick={followStatusClickHandler}
                        className={`flex transform items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-105 min-[410px]:px-4 ${
                          followStatus === 'FOLLOWED' ? 'bg-green-500 hover:bg-green-600' : ''
                        } ${
                          followStatus === 'NOT_FOLLOWED' ? 'bg-blue-500 hover:bg-blue-600' : ''
                        } ${
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
                  </div>

                  <div className="w-full pt-2">
                    <p
                      className={`w-full text-xs text-black dark:text-white sm:text-sm ${
                        expanded ? '' : 'line-clamp-1'
                      }`}
                    >
                      {entityData.description}
                    </p>
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="float-end mt-1 text-xs text-blue-500 sm:text-sm"
                    >
                      {expanded ? 'See Less' : 'See More'}
                    </button>
                  </div>
                </div>

                <ReportConfirmationModal
                  isOpen={isReportModalOpen}
                  closeModal={closeReportModal}
                  report={confirmReport}
                  isReporting={isReporting}
                  type={entity.toUpperCase()}
                />

                {isAuthenticated && entityData?.isCommentsDisabled !== true && (
                  <>
                    <CommentModel
                      isOpen={isCommentModelOpen}
                      onClose={closeCommentModel}
                      type={entity.toUpperCase()}
                      relevantId={entityId}
                      updateCommentCount={setCommentCount}
                      commentCount={commentCount}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SharedMediaPage;
