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
  CommentOutlined,
  CommentsDisabled,
  DarkMode,
  FavoriteBorderSharp,
  FavoriteSharp,
  LightMode,
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
import CommentModal from '../components/comment/CommentModal';

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
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const openCommentModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsCommentModalOpen(true);
  };
  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
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
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 p-3 shadow-sm backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="group flex items-center justify-center gap-3">
            <img
              src={logo}
              alt="Hi5 Logo"
              className="w-10 transition-transform group-hover:scale-105"
            />
            <p className="hidden font-lobster text-4xl text-foreground transition-colors group-hover:text-primary sm:block md:hidden lg:block">
              Hi5
            </p>
          </Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {!isAuthenticated && (
                <>
                  <Link to="/login">
                    <button className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-muted">
                      Login
                    </button>
                  </Link>

                  <Link to="/signup">
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                      SignUp
                    </button>
                  </Link>
                </>
              )}
            </div>

            <button
              className="flex cursor-pointer items-center justify-center rounded-full border border-border bg-secondary p-2 transition-colors duration-300 hover:bg-muted"
              onClick={changeThemeClickHandler}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <LightMode
                  fontSize="small"
                  className="text-foreground transition-all duration-300"
                />
              ) : (
                <DarkMode
                  fontSize="small"
                  className="text-foreground transition-all duration-300"
                />
              )}
            </button>

            {isAuthenticated && user?.role === 'USER' && (
              <div className="flex items-center justify-center lg:gap-2">
                <Link to={isAuthenticated ? `/profile/${user.id}` : '/login'}>
                  <img
                    src={user.profilePictureUrl}
                    alt={`${user.username}'s profile image`}
                    className="h-9 w-9 rounded-full border-2 border-border object-cover transition-colors hover:border-primary lg:h-10 lg:w-10"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-80px)] items-center justify-center space-x-2 bg-background pb-8 pt-5">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-semibold text-foreground">
              {entity === 'post' && 'Loading post...'}
              {entity === 'reel' && 'Loading reel...'}
            </p>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-5 py-3 text-center text-sm font-medium text-destructive shadow-sm">
            {error}
          </div>
        )}
        {!isLoading && !error && entity == 'post' && entityData && (
          <>
            <div className="mx-auto mb-6 w-full max-w-xl rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Link
                    to={isAuthenticated ? `/profile/${entityData.userId}` : '/login'}
                    className="group"
                  >
                    <img
                      src={entityData.profilePictureUrl}
                      alt={`${entityData.fullname}'s profile`}
                      className="h-10 w-10 rounded-full border border-border object-cover transition-colors group-hover:border-primary"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      to={isAuthenticated ? `/profile/${entityData.userId}` : '/login'}
                      className="text-base font-semibold leading-tight text-foreground decoration-primary underline-offset-2 hover:underline"
                    >
                      {entityData.fullname}
                    </Link>
                    <div className="mt-0.5 flex items-center space-x-1.5 text-xs text-muted-foreground">
                      <span>@{entityData.username}</span>
                      <span>•</span>
                      <TimeAgo date={entityData.createdAt} className="font-medium" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {!isMyEntity &&
                    (isReported ? (
                      <Report
                        className="h-8 w-8 transform cursor-not-allowed p-1.5 text-destructive/50"
                        title="This post has already been reported"
                      />
                    ) : (
                      <button
                        className="group rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        onClick={openReportModal}
                        title="Report this post"
                      >
                        <ReportGmailerrorred className="h-5 w-5 transform transition-transform group-active:scale-95" />
                      </button>
                    ))}

                  {isSaved ? (
                    <button
                      className="group rounded-full p-1.5 text-primary transition-colors hover:bg-muted"
                      onClick={saveClickHandler}
                      title="Unsave this post"
                    >
                      <BookmarkSharp className="h-5 w-5 transform transition-transform group-active:scale-95" />
                    </button>
                  ) : (
                    <button
                      className="group rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={saveClickHandler}
                      title="Save this post"
                    >
                      <BookmarkBorderOutlined className="h-5 w-5 transform transition-transform group-active:scale-95" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4 w-full">
                <p className="w-full whitespace-pre-wrap break-words px-1 text-sm leading-relaxed text-foreground sm:text-base">
                  {entityData.content}
                </p>
              </div>

              {entityData.imageUrl && (
                <div className="mb-4 w-full overflow-hidden rounded-lg border border-border/50 bg-muted/20">
                  <img
                    src={entityData.imageUrl}
                    alt="Post content"
                    className="h-auto max-h-[70vh] w-full object-contain"
                  />
                </div>
              )}
              {entityData.videoUrl && (
                <div className="mb-4 w-full overflow-hidden rounded-lg border border-border/50 bg-muted/20">
                  <video
                    src={entityData.videoUrl}
                    controls
                    className="h-auto max-h-[70vh] w-full object-contain"
                  />
                </div>
              )}

              <div className="mt-4 flex items-center border-t border-border pt-2">
                <div className="flex items-center space-x-6 px-2">
                  <button
                    className="group flex items-center space-x-2 transition-colors active:scale-95"
                    onClick={likeClickHandler}
                  >
                    <div className="rounded-full p-1.5 transition-colors group-hover:bg-red-500/10">
                      {isLiked ? (
                        <FavoriteSharp className="h-5 w-5 text-red-500" />
                      ) : (
                        <FavoriteBorderSharp className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-red-500" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-muted-foreground group-hover:text-foreground'}`}
                    >
                      {likesCount}
                    </span>
                  </button>

                  {entityData?.isCommentsDisabled === true ? (
                    <button className="flex cursor-not-allowed items-center space-x-2 text-muted-foreground opacity-70">
                      <div className="rounded-full p-1.5">
                        <CommentsDisabled className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">0</span>
                    </button>
                  ) : (
                    <button
                      className="group flex items-center space-x-2 transition-colors active:scale-95"
                      onClick={openCommentModal}
                    >
                      <div className="rounded-full p-1.5 transition-colors group-hover:bg-blue-500/10">
                        <CommentOutlined className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                        {commentCount}
                      </span>
                    </button>
                  )}

                  <button
                    className="group flex items-center space-x-2 transition-colors active:scale-95"
                    onClick={shareClickHandler}
                  >
                    <div className="rounded-full p-1.5 transition-colors group-hover:bg-green-500/10">
                      <ShareSharp className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-green-500" />
                    </div>
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
                  <CommentModal
                    isOpen={isCommentModalOpen}
                    onClose={closeCommentModal}
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
              className="hide-scrollbar relative h-[87dvh] w-full max-w-md snap-y snap-mandatory overflow-hidden overflow-scroll bg-black shadow-xl md:h-[calc(100vh-100px)] md:rounded-xl md:border md:border-border"
            >
              <div className="relative h-full w-full snap-start">
                <div className="absolute left-1/2 top-0 z-10 mb-3 mt-4 flex w-auto -translate-x-1/2 items-center justify-center rounded-full bg-black/40 p-1.5 px-4 text-xs text-white backdrop-blur-md">
                  <p className="text-center font-bold tracking-wide">Hi5 Reels</p>
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
                  className="absolute bottom-40 right-14 flex cursor-pointer items-center justify-center rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeOffOutlined className="h-6 w-6 drop-shadow-md" />
                  ) : (
                    <VolumeUpOutlined className="h-6 w-6 drop-shadow-md" />
                  )}
                </div>

                <div className="absolute bottom-24 right-4 flex flex-col items-center space-y-5 text-white sm:right-5">
                  <button
                    className="group flex flex-col items-center space-y-1.5 transition-transform hover:scale-110 active:scale-95"
                    onClick={likeClickHandler}
                  >
                    <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm transition-colors group-hover:bg-black/60">
                      {isLiked ? (
                        <FavoriteSharp className="h-7 w-7 text-red-500 drop-shadow-md" />
                      ) : (
                        <FavoriteBorderSharp className="h-7 w-7 text-white drop-shadow-md" />
                      )}
                    </div>
                    <span className="text-xs font-semibold drop-shadow-md">{likesCount}</span>
                  </button>

                  {entityData?.isCommentsDisabled === true ? (
                    <button className="flex cursor-not-allowed flex-col items-center space-y-1.5 opacity-70">
                      <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm">
                        <CommentsDisabled className="h-7 w-7 text-white drop-shadow-md" />
                      </div>
                      <span className="text-xs font-semibold drop-shadow-md">0</span>
                    </button>
                  ) : (
                    <button
                      className="group flex flex-col items-center space-y-1.5 transition-transform hover:scale-110 active:scale-95"
                      onClick={openCommentModal}
                    >
                      <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm transition-colors group-hover:bg-black/60">
                        <CommentOutlined className="h-7 w-7 text-white drop-shadow-md" />
                      </div>
                      <span className="text-xs font-semibold drop-shadow-md">{commentCount}</span>
                    </button>
                  )}

                  <button
                    className="group flex flex-col items-center space-y-1.5 transition-transform hover:scale-110 active:scale-95"
                    onClick={shareClickHandler}
                  >
                    <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm transition-colors group-hover:bg-black/60">
                      <ShareSharp className="h-7 w-7 text-white drop-shadow-md" />
                    </div>
                  </button>

                  <button
                    className="group flex flex-col items-center space-y-1.5 transition-transform hover:scale-110 active:scale-95"
                    onClick={saveClickHandler}
                  >
                    <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm transition-colors group-hover:bg-black/60">
                      {isSaved ? (
                        <BookmarkSharp className="h-7 w-7 text-yellow-500 drop-shadow-md" />
                      ) : (
                        <BookmarkBorderOutlined className="h-7 w-7 text-white drop-shadow-md" />
                      )}
                    </div>
                  </button>

                  {!isMyEntity &&
                    (isReported ? (
                      <div className="cursor-not-allowed rounded-full bg-black/40 p-2.5 opacity-50 backdrop-blur-sm">
                        <Report
                          className="h-6 w-6 text-red-500"
                          title="This reel has already been reported"
                        />
                      </div>
                    ) : (
                      <button
                        className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 group-hover:bg-black/60"
                        onClick={openReportModal}
                        title="Report this reel"
                      >
                        <ReportGmailerrorred className="h-6 w-6 text-white transition-colors group-hover:text-red-400" />
                      </button>
                    ))}
                </div>

                {/* Bottom Overlay Gradient */}
                <div className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-4 left-0 z-10 flex w-[85%] flex-col justify-end p-4 text-white">
                  <div className="mb-3 flex w-full items-center gap-3">
                    <Link
                      to={isAuthenticated ? `/profile/${entityData.userId}` : '/login'}
                      className="relative h-11 w-11 flex-shrink-0"
                    >
                      <img
                        src={entityData.profilePictureUrl}
                        alt={`${entityData.username}'s profile`}
                        className="h-full w-full rounded-full border-2 border-white/50 object-cover shadow-lg"
                      />
                    </Link>

                    <div className="flex flex-col drop-shadow-md">
                      <Link
                        to={isAuthenticated ? `/profile/${entityData.userId}` : '/login'}
                        className="text-[15px] font-semibold leading-tight hover:underline"
                      >
                        {entityData.username}
                      </Link>
                      <TimeAgo
                        date={entityData.createdAt}
                        className="text-[11px] font-medium text-white/80"
                      />
                    </div>

                    {!isMyEntity && (
                      <button
                        onClick={followStatusClickHandler}
                        className={`ml-2 flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold shadow-sm transition-colors ${
                          followStatus === 'FOLLOWED'
                            ? 'border border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                            : ''
                        } ${
                          followStatus === 'NOT_FOLLOWED'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : ''
                        } ${
                          followStatus === 'REQUEST_SENT'
                            ? 'border border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                            : ''
                        } `}
                      >
                        {followStatus === 'FOLLOWED' && 'Following'}
                        {followStatus === 'NOT_FOLLOWED' && 'Follow'}
                        {followStatus === 'REQUEST_SENT' && 'Requested'}
                      </button>
                    )}
                  </div>

                  <div className="w-full">
                    <p
                      className={`text-[14px] leading-snug drop-shadow-md ${
                        expanded ? '' : 'line-clamp-2'
                      }`}
                    >
                      {entityData.description}
                    </p>
                    {entityData.description && entityData.description.length > 80 && (
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-1 text-[13px] font-medium text-white/70 drop-shadow-md hover:text-white"
                      >
                        {expanded ? 'less' : 'more'}
                      </button>
                    )}
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
                    <CommentModal
                      isOpen={isCommentModalOpen}
                      onClose={closeCommentModal}
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
