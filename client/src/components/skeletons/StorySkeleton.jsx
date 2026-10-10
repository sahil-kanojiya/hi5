import { Person } from '@mui/icons-material';

const StorySkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Person className="text-2xl text-muted-foreground" />
      </div>
      <p className="mt-2 h-4 w-20 rounded bg-muted"></p>
    </div>
  );
};

export default StorySkeleton;
