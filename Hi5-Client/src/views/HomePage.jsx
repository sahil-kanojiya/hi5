import CreatePost from '../components/post/CreatePost';
import MainLayout from '../components/layout/MainLayout';
import RightPanel from '../components/layout/common/panel/RightPanel';
import Storys from '../components/story/Storys';
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
        <div className="mx-auto mt-[60px] flex w-full items-start justify-center gap-5 bg-gray-100 p-2 dark:bg-gray-900 sm:mt-[50px] sm:p-4 md:mt-[10px] md:pl-[70px] md:pt-[0px] lg:pl-[260px]">
          <div className="flex w-full max-w-2xl flex-col items-center px-2 sm:px-3 lg:max-w-xl xl:px-4">
            <Storys />

            <CreatePost />

            <div className="flex w-full max-w-xl rounded-lg bg-white shadow-md dark:bg-black">
              <div
                className="relative flex flex-1 cursor-pointer justify-center rounded-lg p-3 hover:bg-gray-200 hover:dark:bg-gray-800"
                onClick={forYouTabClickHandle}
              >
                For You
                {feedType === 'FOR_YOU' && (
                  <div className="absolute bottom-0 h-1 w-10 rounded-full bg-gray-800 dark:bg-gray-200"></div>
                )}
              </div>

              <div
                className="relative flex flex-1 cursor-pointer justify-center rounded-lg p-3 hover:bg-gray-200 hover:dark:bg-gray-800"
                onClick={followingTabClickHandle}
              >
                Following
                {feedType === 'FOLLOWINGS' && (
                  <div className="absolute bottom-0 h-1 w-10 rounded-full bg-gray-800 dark:bg-gray-200"></div>
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
