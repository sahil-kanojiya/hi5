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
      <div className="mx-auto flex h-full w-full justify-center bg-background pt-[70px] md:pl-[70px] md:pt-0 lg:pl-[260px]">
        <div className="flex w-full max-w-2xl justify-center">
          <div className="my-0 flex w-full flex-col rounded-xl border-x border-border bg-card shadow-sm md:my-4 md:min-h-[auto] md:border-y">
            <div className="sticky top-0 z-10 w-full rounded-t-xl border-b border-border bg-card/80 p-2 backdrop-blur-md">
              <div className="flex w-full rounded-lg bg-transparent">
                <button
                  className={`relative flex flex-1 items-center justify-center rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted ${feedType === 'POST' ? 'text-foreground' : 'text-muted-foreground'}`}
                  onClick={postTabClickHandle}
                >
                  Posts
                  {feedType === 'POST' && (
                    <div className="absolute bottom-0 h-1 w-12 rounded-full bg-primary"></div>
                  )}
                </button>

                <button
                  className={`relative flex flex-1 items-center justify-center rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted ${feedType === 'REEL' ? 'text-foreground' : 'text-muted-foreground'}`}
                  onClick={reelTabClickHandle}
                >
                  Reels
                  {feedType === 'REEL' && (
                    <div className="absolute bottom-0 h-1 w-12 rounded-full bg-primary"></div>
                  )}
                </button>

                <button
                  className={`relative flex flex-1 items-center justify-center rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted ${feedType === 'COMMENT' ? 'text-foreground' : 'text-muted-foreground'}`}
                  onClick={commentTabClickHandle}
                >
                  Comments
                  {feedType === 'COMMENT' && (
                    <div className="absolute bottom-0 h-1 w-12 rounded-full bg-primary"></div>
                  )}
                </button>
              </div>
            </div>

            <div className="hide-scrollbar mb-2 flex flex-1 flex-col items-center space-y-1 overflow-y-auto rounded-b-xl bg-card">
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
