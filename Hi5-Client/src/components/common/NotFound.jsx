import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
        <p className="mb-4 text-5xl font-bold text-gray-800 dark:text-gray-100">404 Not Found</p>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          Oops! The page you&#39;re looking for doesn&#39;t exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
