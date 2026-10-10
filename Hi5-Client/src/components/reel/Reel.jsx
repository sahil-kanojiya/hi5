import {
  PersonAdd,
  CheckCircle,
  HourglassEmpty,
  DeleteOutlineOutlined,
  ArrowBackSharp,
  AddCircleOutlineOutlined,
  ReportGmailerrorred,
  Report,
  BookmarkBorderOutlined,
  BookmarkSharp,
  ShareSharp,
  CommentOutlined,
  CommentsDisabled,
  FavoriteBorderSharp,
  FavoriteSharp,
  VolumeOffOutlined,
  VolumeUpOutlined,
  PersonOutline,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from '../common/TimeAgo';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';
import ReportConfirmationModal from '../modal/ReportConfirmationModal';
import {
  deleteReel,
  follow,
  likeEntity,
  reportEntity,
  save,
  unfollow,
  unlikeEntity,
  unsave,
} from '../../services/api';
import CommentModel from '../comment/CommentModel';
import { useSelector } from 'react-redux';
import ViewLikedUsersModel from '../profile/ViewLikedUsersModel';

const Reel = ({
  reel,
  handleBackClick,
  createReelModelOpenHandler,
  isMuted,
  toggleMute,
  removeReel,
  isMyProfileReels,
  showBackButton,
  showCreateReelButton,
}) => {
  const user = useSelector((state) => state.user.profile);
  const isMyReel = reel.userId === user.id;

  const [isCommentModelOpen, setIsCommentModelOpen] = useState(false);
  const openCommentModel = () => {
    setIsCommentModelOpen(true);
  };
  const closeCommentModel = () => {
    setIsCommentModelOpen(false);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = isMuted;
    }
  }, [isMuted]);

  const [followStatus, setFollowStatus] = useState(reel.followStatus);

  const followStatusClickHandler = async () => {
    console.log(followStatus);
    if (followStatus === 'FOLLOWED') {
      try {
        const response = await unfollow(reel.userId);
        setFollowStatus(response.data?.currentStatus);
      } catch (e) {
        console.log(e);
      }
    } else if (followStatus === 'NOT_FOLLOWED') {
      try {
        const response = await follow(reel.userId);
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReel(reel.id);
      console.log('Reel deleted: ' + reel.id);
      removeReel(reel.id);
    } catch (error) {
      console.error('Error deleting reel: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const [isReported, setIsReported] = useState(reel.reportStatus === 'REPORTED');
  const [isReporting, setIsReporting] = useState(false);
  const [isReportModalOpen, setIsReportModal] = useState(false);
  const openReportModal = () => setIsReportModal(true);
  const closeReportModal = () => setIsReportModal(false);
  const confirmReport = async (reportReason) => {
    setIsReporting(true);
    try {
      await reportEntity({
        relevantId: reel.id,
        reason: reportReason,
        type: 'REEL',
      });
      console.log('Reel reported: ' + reel.id + '  reason: ' + reportReason);
      // removePost(post.id);
    } catch (error) {
      console.error('Error reporting reel: ', error);
    } finally {
      setIsReporting(false);
      setIsReported(true);
      closeReportModal();
    }
  };

  const [isLiked, setIsLiked] = useState(reel.likeStatus === 'LIKED');
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const likeClickHandler = async () => {
    if (isLiked) {
      unlikeEntity({
        relevantId: reel.id,
        type: 'REEL',
      });
      setLikesCount((prevCount) => prevCount - 1);
      setIsLiked(false);
      console.log('unliked' + reel.id);
    } else {
      likeEntity({
        relevantId: reel.id,
        type: 'REEL',
      });
      setLikesCount((prevCount) => prevCount + 1);
      setIsLiked(true);
      console.log('liked' + reel.id);
    }
  };

  const [commentCount, setCommentCount] = useState(reel.commentsCount);

  const [isSaved, setIsSaved] = useState(reel.saveStatus === 'SAVED');
  const saveClickHandler = () => {
    if (isSaved) {
      unsave({
        relevantId: reel.id,
        type: 'REEL',
      });
      setIsSaved(false);
      console.log('unsaved' + reel.id);
    } else {
      save({
        relevantId: reel.id,
        type: 'REEL',
      });
      setIsSaved(true);
      console.log('saved' + reel.id);
    }
  };

  const shareClickHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this post!',
          text: 'This is an interesting post I found.',
          url: 'http://localhost:3000/share/reel/' + reel.id,
        })
        .then(() => console.log('Share successful'))
        .catch((error) => console.error('Share failed:', error));
    } else {
      alert('Web Share API not supported in this browser.');
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleVisibilityChange = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoElement.play();
          setIsPlaying(true);
        } else {
          videoElement.pause();
          setIsPlaying(false);
        }
      });
    };
    const observer = new IntersectionObserver(handleVisibilityChange, {
      threshold: 0.7,
    });
    if (videoElement) {
      observer.observe(videoElement);
    }
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

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

  const [isViewLikedUsersModelOpen, setIsViewLikedUsersModelOpen] = useState(false);
  const viewLikedUsersButtonClickHandler = () => {
    setIsViewLikedUsersModelOpen(true);
  };
  const closeViewLikedUsersModal = () => {
    setIsViewLikedUsersModelOpen(false);
  };

  return (
    <div className="relative flex h-full w-full snap-start">
      {/* <div className="top-0 left-1/2 z-10 absolute flex justify-between items-center bg-white/15 dark:bg-black/20 mt-6 sm:mt-4 md:mt-2 lg:mt-4 mb-3 p-2 px-4 sm:px-5 md:px-6 lg:px-7 rounded-lg w-full text-black dark:text-white text-xs -translate-x-1/2 transform">
      
        {showBackButton && (
          <span onClick={handleBackClick} className="mx-2 p-2 cursor-pointer">
            <ArrowBackSharp
              sx={{
                fontSize: { xs: 23, sm: 25, md: 27 },
              }}
            />
          </span>
        )}

        <h3 className="font-bold text-lg select-none">Reels</h3>

        {showCreateReelButton && (
          <span
            className="mx-2 p-2 text-black dark:text-white cursor-pointer"
            onClick={createReelModelOpenHandler}
          >
            <AddCircleOutlineOutlined
              sx={{
                fontSize: { xs: 23, sm: 25, md: 27 },
              }}
            />
          </span>
        )}
        {isMyProfileReels && (
          <button
            className="flex items-center space-x-1 text-black hover:text-red-500 dark:text-white hover:scale-110 transition duration-200 cursor-pointer transform"
            onClick={openDeleteModal}
          >
            <DeleteOutlineOutlined />
          </button>
        )}
      </div> */}

      <div className="absolute left-1/2 top-0 z-10 mb-3 mt-6 flex w-full -translate-x-1/2 transform items-center justify-between rounded-lg bg-white/15 p-2 px-4 text-xs text-black dark:bg-black/20 dark:text-white sm:mt-4 sm:px-5 md:mt-2 md:px-6 lg:mt-4 lg:px-7">
        <div className="flex w-1/3 items-center">
          {showBackButton && (
            <span onClick={handleBackClick} className="mx-2 cursor-pointer p-2">
              <ArrowBackSharp sx={{ fontSize: { xs: 23, sm: 25, md: 27 } }} />
            </span>
          )}
        </div>

        <div className="flex w-1/3 justify-center">
          <h3 className="select-none text-lg font-bold">Reels</h3>
        </div>

        <div className="flex w-1/3 justify-end space-x-2">
          {showCreateReelButton && (
            <span
              className="mx-2 cursor-pointer p-2 text-black dark:text-white"
              onClick={createReelModelOpenHandler}
            >
              <AddCircleOutlineOutlined sx={{ fontSize: { xs: 23, sm: 25, md: 27 } }} />
            </span>
          )}
          {isMyProfileReels && (
            <button
              className="flex transform cursor-pointer items-center space-x-1 text-black transition duration-200 hover:scale-110 hover:text-red-500 dark:text-white"
              onClick={openDeleteModal}
            >
              <DeleteOutlineOutlined />
            </button>
          )}
        </div>
      </div>

      <video
        className="w-full flex-1 object-cover"
        src={reel.videoUrl}
        // muted={isMuted}
        autoPlay
        ref={videoRef}
        loop
        onClick={handleClick}
      />
      <div
        className="textfrom-white absolute bottom-40 right-14 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black bg-opacity-20 p-2 text-white dark:bg-white dark:bg-opacity-20"
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

        {isMyProfileReels && (
          <button
            className="group relative flex transform items-center space-x-2 transition duration-200 hover:scale-110"
            onClick={viewLikedUsersButtonClickHandler}
          >
            <PersonOutline className="h-5 w-5 scale-110 transition-colors duration-200 group-hover:text-blue-600" />
            <span className="absolute -left-9 -top-8 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition duration-200 group-hover:opacity-100">
              View Liked Users
            </span>
          </button>
        )}

        {reel?.isCommentsDisabled === true ? (
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

        {reel?.isPrivate === false && (
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
        )}
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

        {!isMyReel &&
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
          <div className="flex items-center gap-x-1 sm:gap-x-2 md:gap-x-3">
            <Link
              to={`/profile/${reel.userId}`}
              className="h-10 w-10 flex-shrink-0 sm:h-12 sm:w-12"
            >
              <img
                src={reel.profilePictureUrl}
                alt={`${reel.username}'s profile image`}
                className="h-full w-full rounded-full object-cover"
              />
            </Link>
            <div className="flex flex-col text-black dark:text-white">
              <span className="truncate text-sm font-semibold sm:text-lg md:text-lg">
                {reel.fullname}
              </span>
              <span className="flex flex-col flex-wrap gap-1 truncate text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:text-sm">
                <span>@{reel.username}</span>
                <TimeAgo date={reel.createdAt} />
              </span>
            </div>
          </div>

          {/* Follow/Unfollow Button */}
          {!isMyReel && (
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
        </div>

        {/* Description Section */}
        <div className="w-full pt-2">
          <p
            className={`w-full text-xs text-black dark:text-white sm:text-sm ${
              expanded ? '' : 'line-clamp-1'
            }`}
          >
            {reel.description}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="float-end mt-1 text-xs text-blue-500 sm:text-sm"
          >
            {expanded ? 'See Less' : 'See More'}
          </button>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="REEL"
      />
      <ReportConfirmationModal
        isOpen={isReportModalOpen}
        closeModal={closeReportModal}
        report={confirmReport}
        isReporting={isReporting}
        type="REEL"
      />

      {isMyProfileReels && (
        <ViewLikedUsersModel
          isOpen={isViewLikedUsersModelOpen}
          closeModal={closeViewLikedUsersModal}
          relevantId={reel?.id}
          type="REEL"
        />
      )}

      {reel?.isCommentsDisabled !== true && (
        <CommentModel
          isOpen={isCommentModelOpen}
          onClose={closeCommentModel}
          type={'REEL'}
          relevantId={reel.id}
          updateCommentCount={setCommentCount}
          commentCount={commentCount}
          isMyProfileEntity={isMyProfileReels}
        />
      )}
    </div>
  );
};

Reel.propTypes = {
  reel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    videoUrl: PropTypes.string.isRequired,
    likeStatus: PropTypes.string.isRequired,
    reportStatus: PropTypes.string.isRequired,
    saveStatus: PropTypes.string.isRequired,
    likesCount: PropTypes.number.isRequired,
    commentsCount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    followStatus: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    isCommentsDisabled: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
  }),
  handleBackClick: PropTypes.func.isRequired,
  createReelModelOpenHandler: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
  authUserId: PropTypes.string.isRequired,
  removeReel: PropTypes.func.isRequired,
  isMyProfileReels: PropTypes.bool.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  showCreateReelButton: PropTypes.bool.isRequired,
};

export default Reel;
