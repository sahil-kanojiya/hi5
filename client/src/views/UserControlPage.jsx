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
      <div className="mx-auto flex h-full w-full justify-center bg-background pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-2xl justify-center">
          <div className="my-0 flex w-full flex-col rounded-xl border-x border-border bg-card shadow-sm md:my-4 md:min-h-[auto] md:border-y">
            <div className="sticky top-0 z-10 w-full rounded-t-xl border-b border-border bg-card/80 p-4 backdrop-blur-md md:p-6">
              <div className="flex items-center justify-between">
                <h1 className="hidden text-xl font-bold tracking-tight text-foreground md:block lg:text-2xl">
                  Search Users
                </h1>
                <div className="flex w-full items-center justify-between overflow-hidden rounded-md border border-border bg-input transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search users (min 3 chars)..."
                    className="w-full bg-transparent px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none sm:w-72"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button
                    className="flex items-center justify-center p-2.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Search"
                  >
                    <Search fontSize="small" />
                  </button>
                </div>
              </div>
            </div>

            <div className="hide-scrollbar mb-10 flex flex-1 flex-col overflow-y-auto bg-card sm:mb-0">
              {!isLoading && users.length === 0 && debouncedSearchTerm.trim().length >= 3 && (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="rounded-full bg-muted p-4">
                    <Search fontSize="large" />
                  </div>
                  <p className="font-medium text-foreground">No Users Found</p>
                  <p className="text-sm">
                    We couldn&apos;t find anyone matching &quot;{debouncedSearchTerm}&quot;
                  </p>
                </div>
              )}

              {!isLoading && users.length === 0 && debouncedSearchTerm.trim().length < 3 && (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="rounded-full bg-muted p-4">
                    <Search fontSize="large" />
                  </div>
                  <p className="text-sm font-medium">Type at least 3 characters to search</p>
                </div>
              )}

              {users.length > 0 && (
                <div className="flex flex-col gap-2 p-2 sm:p-4">
                  {users.map((user) => (
                    <UserModerationSearchCard
                      key={user.id}
                      user={user}
                      changeUserBanUntill={changeUserBanUntil}
                    />
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex h-32 flex-col items-center justify-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              )}

              <div ref={loaderRef} className="h-4 w-full"></div>
              {!isLoading && error && (
                <div className="m-4 rounded-md border border-destructive/20 bg-destructive/10 p-4 text-center text-sm font-medium text-destructive">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserControlPage;
