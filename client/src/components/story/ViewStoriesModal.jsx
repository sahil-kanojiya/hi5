import {
  ChevronLeft,
  ChevronRight,
  Send,
  Close,
  FavoriteSharp,
  FavoriteBorderSharp,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { getStory, likeEntity, unlikeEntity } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ViewStoriesModal = ({ isOpen, closeModal, newStoryUser }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [storyData, setStoryData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleModalClose = useCallback(() => {
    closeModal();
    setCurrentIndex(0);
  }, [closeModal, setCurrentIndex]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setIsLoading(true);
        const response = await getStory(newStoryUser.id, currentIndex);
        console.log('data:');
        console.log(response.data);
        setStoryData(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
        handleModalClose();
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, [currentIndex, newStoryUser, handleModalClose]);

  const nextImage = useCallback(() => {
    if (currentIndex === newStoryUser.totalStorys - 1) {
      handleModalClose();
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => {
      return prevIndex < newStoryUser.totalStorys - 1 ? prevIndex + 1 : prevIndex;
    });
  }, [currentIndex, handleModalClose, newStoryUser]);

  const previousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(nextImage, 5000);
    }
    return () => clearInterval(timer);
  }, [isOpen, nextImage]);

  const likeClickHandler = async () => {
    if (storyData?.likeStatus === 'LIKED') {
      unlikeEntity({
        relevantId: storyData?.id,
        type: 'STORY',
      });
      setStoryData((prevState) => ({
        ...prevState,
        likeCount: prevState.likeCount - 1,
        likeStatus: 'NOT_LIKED',
      }));
      console.log('unliked ' + storyData?.id);
    } else {
      likeEntity({
        relevantId: storyData?.id,
        type: 'STORY',
      });
      setStoryData((prevState) => ({
        ...prevState,
        likeCount: prevState.likeCount + 1,
        likeStatus: 'LIKED',
      }));
      console.log('liked ' + storyData?.id);
    }
  };

  const navigate = useNavigate();

  const handleRedirectToChat = () => {
    navigate(`/chat/${newStoryUser?.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleModalClose();
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
  }, [isOpen, handleModalClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-all">
      <button
        onClick={handleModalClose}
        className="fixed right-4 top-4 z-10 rounded-full bg-gray-500 p-2 text-white"
      >
        <Close className="text-2xl" />
      </button>

      <div className="relative flex h-screen w-full max-w-md flex-col items-center justify-center rounded-md bg-card shadow-lg">
        <div className="absolute left-0 top-7 flex w-full gap-1 px-4 pt-2 sm:top-0">
          {Array.from({ length: newStoryUser.totalStorys }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-md transition-all ${
                index <= currentIndex ? 'bg-blue-500' : 'bg-muted'
              }`}
            ></div>
          ))}
        </div>

        {isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        {!isLoading && storyData?.imageUrl ? (
          <img
            src={storyData.imageUrl}
            alt={`Story image ${currentIndex + 1}`}
            className="mb-4 w-full rounded-md object-contain"
          />
        ) : (
          <video
            src={storyData?.videoUrl}
            autoPlay
            className="mb-4 w-full rounded-md object-contain"
          />
        )}

        <div className="absolute bottom-8 w-full px-4 py-2">
          {!isLoading && (
            <div className="flex flex-col items-center justify-center rounded-xl bg-gray-800 bg-opacity-50 py-2 shadow-lg">
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-gray-700 bg-opacity-60 text-white hover:shadow-md"
                  onClick={handleRedirectToChat}
                >
                  <input
                    type="text"
                    placeholder="Chat with user..."
                    className="w-full flex-grow cursor-pointer rounded-lg bg-transparent px-4 py-2 text-white placeholder-gray-400 opacity-100 focus:outline-none"
                    readOnly
                  />
                  <button className="ml-2 flex items-center rounded-lg bg-transparent px-4 py-2 text-white transition-all hover:bg-blue-500 hover:bg-opacity-70 hover:text-white">
                    <Send />
                  </button>
                </div>

                <button
                  className="group flex transform cursor-pointer items-center gap-1 space-x-2 rounded-lg bg-gray-700 bg-opacity-60 px-3 py-2 text-white transition duration-200 hover:scale-110 hover:shadow-md"
                  onClick={likeClickHandler}
                >
                  {storyData?.likeStatus === 'LIKED' ? (
                    <FavoriteSharp className="h-5 w-5 text-red-600 transition-colors duration-200" />
                  ) : (
                    <FavoriteBorderSharp className="h-5 w-5 transition-colors duration-200 group-hover:text-red-600" />
                  )}
                  <span className="text-sm font-medium group-hover:text-red-500">
                    {storyData?.likeCount}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={previousImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-400 p-3 text-white opacity-50 shadow-lg hover:bg-gray-700"
          aria-label="Previous Story"
        >
          <ChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-400 p-3 text-white opacity-50 shadow-lg hover:bg-gray-700"
          aria-label="Next Story"
        >
          <ChevronRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

ViewStoriesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  newStoryUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    totalStorys: PropTypes.number.isRequired,
    totalSeenStorys: PropTypes.number.isRequired,
  }).isRequired,
};

export default ViewStoriesModal;
