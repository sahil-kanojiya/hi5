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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <Block className="text-destructive" style={{ fontSize: 48 }} />
        </div>

        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
          Account Suspended
        </h1>

        <p className="mb-6 text-sm text-muted-foreground">
          Your account has been suspended due to violations of our terms of service
          {banData?.banUntil && ` until ${new Date(banData?.banUntil).toLocaleDateString('en-GB')}`}
          .
        </p>

        <button
          onClick={() => (window.location.href = '/login')}
          className="w-full rounded-lg bg-destructive px-4 py-3 font-semibold text-destructive-foreground shadow-sm transition-all hover:bg-destructive/90 active:scale-[0.98]"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default BanPage;
