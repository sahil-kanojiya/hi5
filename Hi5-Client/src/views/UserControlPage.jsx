import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { searchUsersByKeywordForModeration } from '../services/api';
import { Search } from '@mui/icons-material';
import UserModerationSearchCard from '../components/moderation/userControl/UserModerationSearchCard';

const UserControlPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    console.log('re render..');
  }, [debouncedSearchTerm]);

  const fetchUsers = useCallback(async () => {
    if (debouncedSearchTerm.trim().length < 3) return;
    try {
      setIsLoading(true);
      const response = await searchUsersByKeywordForModeration(debouncedSearchTerm, {
        size: 10,
        page,
      });
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prevUsers) => (page === 0 ? response.data : [...prevUsers, ...response.data]));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 3) {
      fetchUsers();
    }
  }, [page, fetchUsers, debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchParams({ query: newSearchTerm }, { replace: true });
      setDebouncedSearchTerm(newSearchTerm);
    }, 500);
  };

  const loadMoreUsers = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreUsers();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMoreUsers]);

  const changeUserBanUntil = (id, newDate) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, banUntil: newDate };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <MainLayout>
      <div className="mx-auto flex h-full w-full justify-center pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-3xl justify-center">
          <div className="my-0 flex w-full flex-col justify-center rounded-lg bg-white px-4 shadow-lg dark:bg-black md:my-4">
            <div className="sticky top-0 w-full p-2 md:p-6">
              <div className="flex items-center justify-between">
                <h1 className="hidden text-xl font-semibold md:block lg:text-2xl">Search Users</h1>
                <div className="flex w-full items-center justify-between overflow-hidden rounded-md border border-gray-700 sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full bg-white px-3 py-2 focus:outline-none dark:bg-black sm:w-64 sm:px-4"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button className="p-3" aria-label="Search">
                    <Search className="h-5 w-5 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-3 h-1 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
            <div className="hide-scrollbar mb-10 mt-0 flex flex-1 flex-col space-y-4 overflow-y-auto pb-4 min-[450px]:p-4 sm:mb-3">
              {!isLoading && users.length === 0 && (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-center">No Users Found</p>
                </div>
              )}
              {users.length > 0 && (
                <>
                  {users.map((user) => (
                    <UserModerationSearchCard
                      key={user.id}
                      user={user}
                      changeUserBanUntill={changeUserBanUntil}
                    />
                  ))}
                </>
              )}
              {isLoading && users.length === 0 && (
                <div className="flex flex-col justify-center">
                  <p className="text-center">Loading...</p>
                </div>
              )}
              <div ref={loaderRef}></div>
              {!isLoading && error && <p className="my-4 text-center text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserControlPage;
