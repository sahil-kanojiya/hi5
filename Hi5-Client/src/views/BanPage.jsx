import { Block } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const BanPage = () => {
  const [banData, setBanData] = useState(null);

  useEffect(() => {
    const storedBanData = sessionStorage.getItem('banData');
    if (storedBanData) {
      const parsedData = JSON.parse(storedBanData);
      console.log(parsedData);
      setBanData(parsedData);

      if (!parsedData || !parsedData?.isBanned) {
        return <Navigate to="/login" />;
      }

      sessionStorage.removeItem('banData');
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-red-50">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <Block className="mb-4 text-red-500" style={{ fontSize: 48 }} />
        <h1 className="mb-2 text-3xl font-semibold text-red-600">Account Banned</h1>
        <p className="mb-4 text-gray-700">
          Your account is banned
          {banData?.banUntil && ` until ${new Date(banData?.banUntil).toLocaleDateString('en-GB')}`}
        </p>
        <button
          onClick={() => (window.location.href = '/login')}
          className="mt-4 rounded-2xl bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-200 hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default BanPage;
