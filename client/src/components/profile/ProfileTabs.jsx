import PropTypes from 'prop-types';
import { useState } from 'react';
import Posts from '../post/Posts';
import Reels from '../reel/Reels';

const tabs = [
  { label: 'Posts', value: 'POSTS' },
  { label: 'Reels', value: 'REELS' },
  { label: 'Saved Posts', value: 'SAVED_POSTS', requiresProfile: true },
  { label: 'Saved Reels', value: 'SAVED_REELS', requiresProfile: true },
];

export default function ProfileTabs({ userId, isMyProfile, profileType }) {
  const filteredTabs = tabs.filter((tab) => !tab.requiresProfile || isMyProfile);

  const [activeTab, setActiveTab] = useState('POSTS');

  return (
    <div className="flex flex-col items-center">
      <div className="m-4 flex w-full max-w-xl flex-col items-center gap-4 rounded-md bg-gray-100 p-3 dark:bg-gray-900">
        {(isMyProfile || profileType !== 'PRIVATE') && (
          <>
            <div className="hide-scrollbar flex w-full overflow-x-auto whitespace-nowrap rounded-lg bg-white shadow-md dark:bg-black">
              {filteredTabs.map((tab) => (
                <div
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`relative flex flex-1 cursor-pointer justify-center rounded-lg p-3 font-semibold text-black transition-all duration-300 ease-in-out hover:bg-gray-200 dark:text-white hover:dark:bg-gray-800`}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <div className="absolute bottom-0 h-1 w-10 rounded-full bg-gray-800 transition-all duration-300 dark:bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>

            {(activeTab === 'POSTS' || activeTab === 'SAVED_POSTS') && (
              <>
                <div className="flex w-full justify-center rounded-lg">
                  {activeTab === 'POSTS' && (
                    <Posts userId={userId} feedType="POSTS" isMyProfilePosts={isMyProfile} />
                  )}
                  {activeTab === 'SAVED_POSTS' && isMyProfile && <Posts feedType="SAVED" />}
                </div>
              </>
            )}

            {(activeTab === 'REELS' || activeTab === 'SAVED_REELS') && (
              <div className="">
                {activeTab === 'REELS' && (
                  <Reels
                    userId={userId}
                    feedType="REELS"
                    isMyProfileReels={isMyProfile}
                    showBackButton={false}
                    showCreateReelButton={false}
                  />
                )}
                {activeTab === 'SAVED_REELS' && isMyProfile && (
                  <Reels feedType="SAVED" showBackButton={false} showCreateReelButton={false} />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Prop validation
ProfileTabs.propTypes = {
  userId: PropTypes.string.isRequired,
  isMyProfile: PropTypes.bool.isRequired,
  profileType: PropTypes.string.isRequired,
};
