import { CameraAlt } from '@mui/icons-material';

const MyStorySkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
        <CameraAlt className="text-2xl text-gray-500" />
      </div>
      <p className="mt-2 h-4 w-20 rounded bg-gray-300"></p>
    </div>
  );
};

export default MyStorySkeleton;
