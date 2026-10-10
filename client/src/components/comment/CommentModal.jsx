import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useCallback } from 'react';
import axiosInstance from '../../services/axios.config';
import { makeComment } from '../../services/api';
import Comment from './Comment';

const CommentModal = ({
  isOpen,
  onClose,
  type,
  relevantId,
  updateCommentCount,
  commentCount,
  isMyProfileEntity = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    try {
      setIsPosting(true);
      const data = await makeComment({
        relevantId,
        content: newComment,
        type,
      });
      updateCommentCount((prev) => prev + 1);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setNewComment('');
      setIsPosting(false);
    }
  };

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get('/comment', {
        params: {
          type,
          relevantId,
          page,
          size: 10,
        },
      });
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setComments((prevPosts) => [...prevPosts, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setComments([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, [type, relevantId, commentCount]);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type, relevantId, commentCount]);

  const loadMoreComments = useCallback(() => {
    console.log('load more posts');
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const removeComment = (commentId) => {
    updateCommentCount((prev) => prev - 1);
    setComments((prevComments) => {
      console.log(prevComments);
      const newPosts = prevComments.filter((post) => post.id !== commentId);
      console.log(newPosts);
      return newPosts;
    });
  };

  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
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
  }, [loadMoreComments]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="w-full max-w-md rounded-lg border border-gray-500 bg-card p-4 shadow-lg sm:max-w-lg lg:max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground transition duration-200 hover:text-red-500"
          >
            <CloseRoundedIcon
              sx={{
                fontSize: { xs: 25, sm: 28, md: 30 },
              }}
            />
          </button>
        </div>

        <div className="hide-scrollbar max-h-60 overflow-y-auto">
          {!isLoading && comments.length > 0 && (
            <>
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  removeComment={removeComment}
                  isMyProfileEntity={isMyProfileEntity}
                />
              ))}
              {!isLoading && error === null && (
                <div ref={loaderRef} className="flex h-11 items-center justify-center"></div>
              )}
              {!isLoading && error !== null && (
                <div
                  ref={loaderRef}
                  className="flex h-16 items-center justify-center text-white dark:text-foreground"
                >
                  Something error occured.
                </div>
              )}
            </>
          )}
        </div>

        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        <div className="flex items-center space-x-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            className="w-full rounded-lg border bg-card p-2 outline-none dark:border-gray-500"
            disabled={isPosting}
          />
          <button
            onClick={handlePostComment}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            disabled={isPosting}
          >
            {isPosting ? 'Posting..' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

CommentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  relevantId: PropTypes.string.isRequired,
  updateCommentCount: PropTypes.func.isRequired,
  commentCount: PropTypes.number.isRequired,
  isMyProfileEntity: PropTypes.bool.isRequired,
};

export default CommentModal;
