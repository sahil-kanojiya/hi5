import PostSkeleton from '../skeletons/PostSkeleton';
import { useCallback, useEffect, useState } from 'react';
import Post from './Post';
import PropTypes from 'prop-types';
import axiosInstance from '../../services/axios.config';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

const Posts = ({ feedType, userId = '', isMyProfilePosts = false }) => {
  const user = useSelector((state) => state.user.profile);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  const size = 10;
  const getPostEndpoint = useCallback(() => {
    switch (feedType) {
      case 'FOR_YOU':
        return `/post?size=${size}`;
      case 'FOLLOWINGS':
        return `/post/following?page=${page}&size=${size}`;
      case 'POSTS':
        return `/post/user/${userId}?page=${page}&size=${size}`;
      case 'SAVED':
        return `/post/saved?page=${page}&size=${size}`;
      default:
        return `/post?size=${size}`;
    }
  }, [size, page, userId, feedType]);

  const fetchPosts = useCallback(async () => {
    try {
      const endpoint = getPostEndpoint();
      const response = await axiosInstance.get(endpoint);
      console.log(response.data);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getPostEndpoint]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(true);
  }, [feedType, userId]);

  useEffect(() => {
    fetchPosts();
  }, [page, feedType, userId, fetchPosts]);

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const removePost = (postId) => {
    setPosts((prevPosts) => {
      console.log(prevPosts);
      const newPosts = prevPosts.filter((post) => post.id !== postId);
      console.log(newPosts);
      return newPosts;
    });
  };

  return (
    <>
      <div className="mt-3 w-full">
        {isLoading && posts.length === 0 && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}

        {error && <p className="my-4 text-center text-red-500">{error}</p>}

        {!isLoading && posts.length === 0 && (
          <div className="flex !h-full !w-full items-center justify-center px-20 sm:px-40">
            <div className="rounded-lg bg-card px-4 py-2 text-center shadow-md">
              <p className="text-lg font-semibold text-muted-foreground">No Posts</p>
            </div>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <InfiniteScroll
            dataLength={posts.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            }
            endMessage={<p className="text-center">No more posts</p>}
          >
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                authUserId={user.id}
                removePost={removePost}
                isMyProfilePosts={isMyProfilePosts}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
};

Posts.propTypes = {
  feedType: PropTypes.string.isRequired,
  userId: PropTypes.string,
  isMyProfilePosts: PropTypes.bool,
};

export default Posts;
