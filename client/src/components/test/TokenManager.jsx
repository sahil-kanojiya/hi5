import { useState, useEffect } from 'react';
import { setToken, getToken, removeToken } from '../../utils/localStorage';

const TokenManager = () => {
  console.log('TokenManager');

  const [token, setTokenState] = useState(null);
  const [newToken, setNewToken] = useState('');

  useEffect(() => {
    const loadAccessToken = () => {
      try {
        const storedToken = getToken();
        setTokenState(storedToken || null);
      } catch (error) {
        console.error('Failed to load token:', error);
      }
    };
    loadAccessToken();
  }, []);

  const handlesetToken = () => {
    try {
      setToken(newToken);
      setTokenState(newToken);
      setNewToken('');
    } catch (error) {
      console.error('Failed to set access token:', error);
    }
  };

  const handleremoveToken = () => {
    try {
      removeToken();
      setTokenState(null);
    } catch (error) {
      console.error('Failed to remove access token:', error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-lg border border-gray-200 bg-card p-6 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Token Manager</h1>
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Access Token</h2>
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder="Enter new access token"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlesetToken}
            className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md transition duration-300 hover:bg-blue-600"
          >
            Set Access Token
          </button>
        </div>
        <div className="text-right">
          <button
            onClick={handleremoveToken}
            className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow-md transition duration-300 hover:bg-red-600"
          >
            Remove Access Token
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-700">
        Current Access Token:{' '}
        <span className="font-semibold text-foreground">{token || 'None'}</span>
      </p>
    </div>
  );
};

export default TokenManager;
