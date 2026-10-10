import { useNavigate } from 'react-router-dom';

const OAuth2Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-lg rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
        <p className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Authentication Error
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          An error occurred during the OAuth2 authentication process. Please try again or contact
          support.
        </p>
        <div className="mt-4">
          <button
            onClick={() => navigate('/login')}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Retry Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuth2Error;
