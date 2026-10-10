import MainLayout from '../components/layout/MainLayout';
import Reels from '../components/reel/Reels';

const ReelsPage = () => {
  return (
    <MainLayout>
      <div className="flex min-h-screen items-center justify-center gap-5 bg-background md:pl-[70px] lg:pl-[260px]">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-10">
          <Reels feedType="RANDOM" />
        </div>
      </div>
    </MainLayout>
  );
};

export default ReelsPage;
