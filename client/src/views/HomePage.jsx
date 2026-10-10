import CreatePost from '../components/post/CreatePost';
import MainLayout from '../components/layout/MainLayout';
import RightPanel from '../components/layout/common/panel/RightPanel';
import Stories from '../components/story/Stories';
import Posts from '../components/post/Posts';
import { useState } from 'react';

const HomePage = () => {
  const [feedType, setFeedType] = useState('FOR_YOU');

  const forYouTabClickHandle = () => {
    setFeedType('FOR_YOU');
  };

  const followingTabClickHandle = () => {
    setFeedType('FOLLOWINGS');
  };

  return (
    <>
      <MainLayout>
        <div className="mx-auto mt-[60px] flex w-full items-start justify-center gap-5 bg-background p-2 sm:mt-[50px] sm:p-4 md:mt-[10px] md:pl-[70px] md:pt-[0px] lg:pl-[260px]">
          <div className="flex w-full max-w-2xl flex-col items-center px-2 sm:px-3 lg:max-w-xl xl:px-4">
            <Stories />

            <CreatePost />

            <div className="mb-4 flex w-full max-w-xl rounded-xl border border-border bg-card shadow-sm">
              <div
                className={`relative flex flex-1 cursor-pointer justify-center rounded-l-xl p-4 font-medium transition-colors hover:bg-muted ${feedType === 'FOR_YOU' ? 'text-foreground' : 'text-muted-foreground'}`}
                onClick={forYouTabClickHandle}
              >
                For You
                {feedType === 'FOR_YOU' && (
                  <div className="absolute bottom-0 h-1 w-12 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                )}
              </div>

              <div className="my-2 w-px bg-border"></div>

              <div
                className={`relative flex flex-1 cursor-pointer justify-center rounded-r-xl p-4 font-medium transition-colors hover:bg-muted ${feedType === 'FOLLOWINGS' ? 'text-foreground' : 'text-muted-foreground'}`}
                onClick={followingTabClickHandle}
              >
                Following
                {feedType === 'FOLLOWINGS' && (
                  <div className="absolute bottom-0 h-1 w-12 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                )}
              </div>
            </div>

            <Posts feedType={feedType} />
          </div>
          <RightPanel />
        </div>
      </MainLayout>
    </>
  );
};
export default HomePage;
