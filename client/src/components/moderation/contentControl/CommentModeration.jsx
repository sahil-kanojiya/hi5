import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../services/axios.config';
import ReportedComment from './ReportedComment';

const CommentModeration = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/moderate/content/comment', {
        params: {
          page,
          size: 10,
        },
      });
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setComments((prevComments) => [...prevComments, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    setComments([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [page, fetchComments]);

  const loadMorePosts = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMorePosts]);

  const removeComment = (commentId) => {
    setComments((prevComments) => {
      console.log(prevComments);
      const newComments = prevComments.filter((post) => post.id !== commentId);
      console.log(newComments);
      return newComments;
    });
  };

  const updateBanUntill = (userId, banUntil) => {
    setComments((prevComments) => {
      console.log(prevComments);
      const newComments = prevComments.map((comment) =>
        comment.userId === userId ? { ...comment, banUntil } : comment
      );
      console.log(newComments);
      return newComments;
    });
  };

  return (
    <>
      <div className="hide-scrollbar w-full overflow-y-auto pt-2">
        {!isLoading && comments.length > 0 && (
          <>
            {comments.map((comment) => (
              <ReportedComment
                key={comment.id}
                comment={comment}
                removeComment={removeComment}
                updateBanUntill={updateBanUntill}
              />
            ))}
            {isLoading && error === null && (
              <div ref={loaderRef} className="flex h-11 items-center justify-center">
                <span className="text-gray-500">Loading more posts...</span>
              </div>
            )}
            {!isLoading && error === null && (
              <div ref={loaderRef} className="flex h-11 items-center justify-center">
                <span className="text-gray-500">No more posts available.</span>
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

export default CommentModeration;
