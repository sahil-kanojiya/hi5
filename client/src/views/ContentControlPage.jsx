import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import PostModeration from '../components/moderation/contentControl/PostModeration';
import ReelModeration from '../components/moderation/contentControl/ReelModeration';
import CommentModeration from '../components/moderation/contentControl/CommentModeration';

const ContentControlPage = () => {
  const [feedType, setFeedType] = useState('POST');
  const postTabClickHandle = () => {
    setFeedType('POST');
  };
  const reelTabClickHandle = () => {
    setFeedType('REEL');
  };
  const commentTabClickHandle = () => {
    setFeedType('COMMENT');
  };

  return (
    <MainLayout>
      <div className="mx-auto flex h-full w-full justify-center pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-3xl justify-center">
          <div className="my-0 flex w-full flex-col justify-center rounded-lg bg-white px-4 shadow-lg dark:bg-black md:my-4">
            <div className="sticky top-0 w-full p-2 md:p-2">
              <div className="flex w-full rounded-lg bg-white shadow-md dark:bg-black">
                <div
                  className="relative flex flex-1 cursor-pointer justify-center rounded-lg p-3 hover:bg-gray-200 hover:dark:bg-gray-800"
                  onClick={postTabClickHandle}
                >
                  Post
                  {feedType === 'POST' && (
                    <div className="absolute bottom-0 h-1 w-10 rounded-full bg-gray-800 dark:bg-gray-200"></div>
                  )}
                </div>

                <div
                  className="relative flex flex-1 cursor-pointer justify-center rounded-lg p-3 hover:bg-gray-200 hover:dark:bg-gray-800"
                  onClick={reelTabClickHandle}
                >
                  Reels
                  {feedType === 'REEL' && (
                    <div className="absolute bottom-0 h-1 w-10 rounded-full bg-gray-800 dark:bg-gray-200"></div>
                  )}
                </div>

                <div
                  className="relative flex flex-1 cursor-pointer justify-center rounded-lg p-3 hover:bg-gray-200 hover:dark:bg-gray-800"
                  onClick={commentTabClickHandle}
                >
                  Comments
                  {feedType === 'COMMENT' && (
                    <div className="absolute bottom-0 h-1 w-10 rounded-full bg-gray-800 dark:bg-gray-200"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-1 rounded-lg bg-slate-200 dark:bg-slate-800"></div>

            <div className="hide-scrollbar mb-2 flex flex-1 flex-col items-center space-y-1 overflow-y-auto rounded-b-lg">
              {feedType === 'POST' && <PostModeration />}
              {feedType === 'REEL' && <ReelModeration />}
              {feedType === 'COMMENT' && <CommentModeration />}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContentControlPage;
