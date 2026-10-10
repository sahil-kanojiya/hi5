import MainLayout from '../components/layout/MainLayout';
import Reels from '../components/reel/Reels';

const ReelsPage = () => {
  return (
    <MainLayout>
      <div className="flex items-center justify-center gap-5 md:pl-[70px] lg:pl-[260px]">
        <div className="mr-auto flex w-full max-w-lg flex-col items-center justify-center gap-10 bg-white dark:bg-black">
          <Reels feedType="RANDOM" />
        </div>
      </div>
    </MainLayout>
  );
};

export default ReelsPage;
