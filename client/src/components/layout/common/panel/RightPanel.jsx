import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../services/axios.config';

const RightPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axiosInstance.get('/user/suggest');
        setUsers(response?.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="mt-5 hidden w-72 min-w-60 lg:block">
      <div className="rounded-md bg-card p-4 shadow-md">
        <p className="mb-4 text-lg font-bold">You Might Know</p>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : (
          <div className="flex flex-col space-y-5">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${user?.id}`}>
                      <img
                        src={user?.profilePictureUrl}
                        alt={`${user?.fullname}'s Profile`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </Link>
                    <div>
                      <span className="block truncate text-sm font-medium">{user?.fullname}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {user?.username}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${user?.id}`}
                    className="rounded-full bg-muted px-4 py-1 text-sm font-semibold text-foreground transition duration-200 hover:opacity-90"
                  >
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No suggestions found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
