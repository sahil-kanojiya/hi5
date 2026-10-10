import ReelUploadModal from './ReelUploadModel';
import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../services/axios.config';
import { useNavigate } from 'react-router-dom';
import Reel from './Reel';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const Reels = ({
  feedType,
  userId = '',
  isMyProfileReels = false,
  showBackButton = true,
  showCreateReelButton = true,
}) => {
  const user = useSelector((state) => state.user.profile);

  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const size = 5;
  const getReelEndpoint = useCallback(() => {
    switch (feedType) {
      case 'RANDOM':
        return `/reel?size=${size}`;
      case 'REELS':
        return `/reel/user/${userId}?page=${page}&size=${size}`;
      case 'SAVED':
        return `/reel/saved?page=${page}&size=${size}`;
      default:
        return `/reel?size=${size}`;
    }
  }, [feedType, userId, page, size]);

  const fetchReels = useCallback(async () => {
    try {
      const endpoint = getReelEndpoint();
      const response = await axiosInstance.get(endpoint);
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setReels((prevReels) => [...prevReels, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getReelEndpoint, setReels, setHasMore, setError, setIsLoading]);

  useEffect(() => {
    setReels([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, [feedType, userId]);

  useEffect(() => {
    fetchReels();
  }, [page, feedType, userId, fetchReels]);

  const loadMoreReels = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore, setPage]);

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreReels();
        }
      },
      { threshold: 0 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMoreReels]);

  const removeReel = (reelId) => {
    setReels((prevReels) => {
      console.log(prevReels);
      const newReels = prevReels.filter((post) => post.id !== reelId);
      console.log(newReels);
      return newReels;
    });
  };

  const navigate = useNavigate();
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    console.log(isMuted);
  };

  const [isReelCreateModelOpen, setIsReelCreateModelOpen] = useState(false);

  const createReelModelOpenHandler = () => {
    setIsReelCreateModelOpen(true);
  };

  return (
    <>
      <div
        id="video-container"
        className="hide-scrollbar mt-14 h-[87dvh] w-full max-w-md snap-y snap-mandatory overflow-scroll bg-white dark:bg-black md:mt-0 md:h-screen"
      >
        {!hasMore && !isLoading && reels.length === 0 && (
          <div className="p flex !h-full !w-full items-center justify-center px-20 sm:px-40">
            <div className="rounded-lg bg-white px-4 py-2 text-center shadow-md">
              <p className="text-lg font-semibold text-gray-500">No Reels</p>
            </div>
          </div>
        )}

        {!isLoading && reels.length > 0 && (
          <>
            {reels.map((reel) => (
              <Reel
                key={reel.id}
                reel={reel}
                handleBackClick={handleBackClick}
                createReelModelOpenHandler={createReelModelOpenHandler}
                isMuted={isMuted}
                toggleMute={toggleMute}
                authUserId={user.id}
                removeReel={removeReel}
                isMyProfileReels={isMyProfileReels}
                showBackButton={showBackButton}
                showCreateReelButton={showCreateReelButton}
              />
            ))}
            {!isLoading && error === null && (
              <div ref={loaderRef} className="flex h-16 items-center justify-center text-white">
                Loading more...
              </div>
            )}
            {!isLoading && error !== null && (
              <div ref={loaderRef} className="flex h-16 items-center justify-center text-white">
                Something error occured.
              </div>
            )}
          </>
        )}
      </div>
      <ReelUploadModal
        isOpen={isReelCreateModelOpen}
        onClose={() => {
          setIsReelCreateModelOpen(false);
        }}
      />
    </>
  );
};

Reels.propTypes = {
  feedType: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isMyProfileReels: PropTypes.bool,
  showBackButton: PropTypes.bool,
  showCreateReelButton: PropTypes.bool,
};

export default Reels;
