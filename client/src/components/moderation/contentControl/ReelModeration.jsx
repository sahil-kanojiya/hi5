import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../services/axios.config';
import ReportedReel from './ReportedReel';

const ReelModeration = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchReels = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/moderate/content/reel', {
        params: {
          page,
          size: 10,
        },
      });
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
  }, [page]);

  useEffect(() => {
    setReels([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    fetchReels();
  }, [page, fetchReels]);

  const loadMoreReels = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreReels();
        }
      },
      { threshold: 0.1 }
    );
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loadMoreReels]);

  const removeReel = (reelId) => {
    setReels((prev) => {
      console.log(prev);
      const newReels = prev.filter((reel) => reel.id !== reelId);
      console.log(newReels);
      return newReels;
    });
  };

  const updateBanUntill = (userId, banUntil) => {
    setReels((prevReels) => {
      console.log(prevReels);
      const newReels = prevReels.map((reel) =>
        reel.userId === userId ? { ...reel, banUntil } : reel
      );
      console.log(newReels);
      return newReels;
    });
  };

  return (
    <>
      <div className="hide-scrollbar w-full overflow-y-auto pt-2">
        {!isLoading && reels.length > 0 && (
          <>
            {reels.map((reel) => (
              <ReportedReel
                key={reel.id}
                reel={reel}
                removeReel={removeReel}
                updateBanUntill={updateBanUntill}
              />
            ))}

            {isLoading && error === null && (
              <div ref={loaderRef} className="flex h-11 items-center justify-center">
                <span className="text-muted-foreground">Loading more reels...</span>
              </div>
            )}

            {!isLoading && error === null && (
              <div ref={loaderRef} className="flex h-11 items-center justify-center">
                <span className="text-muted-foreground">No more reels available.</span>
              </div>
            )}

            {!isLoading && error !== null && (
              <div ref={loaderRef} className="flex h-16 items-center justify-center text-red-500">
                Something went wrong. Please try again.
              </div>
            )}
          </>
        )}
      </div>

      {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
    </>
  );
};

export default ReelModeration;
