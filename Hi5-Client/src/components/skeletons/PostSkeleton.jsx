const PostSkeleton = () => {
  return (
    <div className="mx-auto mb-6 w-full max-w-xl animate-pulse rounded-md bg-white p-4 shadow-md dark:bg-black">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div>
            <div className="mb-1 h-4 w-24 rounded-md bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-3 w-16 rounded-md bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 rounded-md bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-5 w-5 rounded-md bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 h-4 w-full rounded-md bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-4 w-3/4 rounded-md bg-gray-300 dark:bg-gray-700"></div>
      </div>

      <div className="mb-4">
        <div className="h-48 w-full rounded-md bg-gray-300 dark:bg-gray-700"></div>
      </div>

      <div className="flex items-center justify-between text-gray-300 dark:text-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 rounded-md bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-5 w-5 rounded-md bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-5 w-5 rounded-md bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
