import { DeleteOutline, Favorite, Visibility } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import StoryViewUsersModal from './StoryViewUsersModal';

const MyStory = ({
  index,
  currentIndex,
  story,
  myStorys,
  openDeleteModal,
  file,
  previewUrl,
  isPending,
  uploadProgress,
  isError,
  handleFileChange,
  handleCreateStory,
  setIsAnyModelIsOpen,
}) => {
  const [isLikedUsersModalOpen, setIsLikedUsersModalOpen] = useState(false);
  const openLikedUsersModal = () => {
    setIsAnyModelIsOpen(true);
    setIsLikedUsersModalOpen(true);
  };
  const closeLikedUsersModal = () => {
    setIsAnyModelIsOpen(false);
    setIsLikedUsersModalOpen(false);
  };
  const [isViewedUsersModalOpen, setIsViewedUsersModalOpen] = useState(false);
  const openViewedUsersModal = () => {
    setIsAnyModelIsOpen(true);
    setIsViewedUsersModalOpen(true);
  };
  const closeViewedUsersModal = () => {
    setIsAnyModelIsOpen(false);
    setIsViewedUsersModalOpen(false);
  };

  return (
    <div
      className={`relative ${index === currentIndex ? 'block' : 'hidden'} flex h-full w-full items-center justify-center`}
    >
      <div className="absolute left-0 top-7 flex w-full gap-1 px-4 pt-2 sm:top-0">
        {myStorys.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-md transition-all ${index <= currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>

      {currentIndex < myStorys.length - 1 && (
        <button
          className="absolute right-1 top-16 z-50 flex transform items-center space-x-1 px-4 pt-2 transition duration-200 hover:scale-110 hover:text-red-500 sm:top-6"
          onClick={openDeleteModal}
        >
          <DeleteOutline
            sx={{ fontSize: { xs: 25, sm: 28, md: 30 } }}
            className="cursor-pointer text-gray-600 hover:text-red-500"
          />
        </button>
      )}

      {!story?.newStoryModel ? (
        story?.imageUrl ? (
          <img
            src={story.imageUrl}
            alt={`Story image ${index + 1}`}
            className="mb-4 w-full rounded-md object-contain"
          />
        ) : (
          <video src={story.videoUrl} autoPlay className="mb-4 w-full rounded-md object-contain" />
        )
      ) : (
        <>
          {file === null && <p className="text-center">No file is selected</p>}
          {file?.type?.startsWith('image/') && (
            <img src={previewUrl} alt="Preview" className="mb-4 w-full rounded-md object-contain" />
          )}
          {file?.type?.startsWith('video/') && (
            <video src={previewUrl} autoPlay className="mb-4 w-full rounded-md object-contain" />
          )}
        </>
      )}

      <div className="absolute bottom-8 w-full px-4 py-2">
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-800 bg-opacity-50 py-2 shadow-lg">
          {isPending && (
            <div className="w-full px-2 pb-3">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {isError && (
            <div className="w-full px-2 pb-3">
              <div className="mt-2 text-center text-sm text-red-500">{isError?.message}</div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2">
            {!story.newStoryModel ? (
              <>
                <div
                  className="flex transform cursor-pointer items-center gap-1 rounded-lg bg-gray-700 bg-opacity-60 px-3 py-2 text-white transition hover:scale-105 hover:shadow-md"
                  onClick={openLikedUsersModal}
                >
                  <Favorite className="text-red-500" />
                  <span className="text-sm">{story.likeCount}</span>
                </div>

                <div
                  className="flex transform cursor-pointer items-center gap-1 rounded-lg bg-gray-700 bg-opacity-60 px-3 py-2 text-white transition hover:scale-105 hover:shadow-md"
                  onClick={openViewedUsersModal}
                >
                  <Visibility className="text-blue-400" />
                  <span className="text-sm">{story.viewCount}</span>
                </div>
              </>
            ) : (
              <>
                <label className="flex transform cursor-pointer items-center gap-1 rounded-lg bg-gray-700 bg-opacity-60 px-3 py-2 text-white transition hover:scale-105 hover:shadow-md">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                  <span>Upload</span>
                </label>
                <button
                  onClick={handleCreateStory}
                  className="flex transform cursor-pointer items-center gap-1 rounded-lg bg-gray-700 bg-opacity-60 px-3 py-2 text-white transition hover:scale-105 hover:shadow-md"
                >
                  Create Story
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {isLikedUsersModalOpen && (
        <StoryViewUsersModal
          isOpen={isLikedUsersModalOpen}
          closeModal={closeLikedUsersModal}
          storyId={story.id}
          type="STORY_LIKES"
        />
      )}
      {isViewedUsersModalOpen && (
        <StoryViewUsersModal
          isOpen={isViewedUsersModalOpen}
          closeModal={closeViewedUsersModal}
          storyId={story.id}
          type="STORY_VIEWS"
        />
      )}
    </div>
  );
};

MyStory.propTypes = {
  index: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
  story: PropTypes.shape({
    id: PropTypes.string.isRequired,
    newStoryModel: PropTypes.bool,
    imageUrl: PropTypes.string,
    videoUrl: PropTypes.string,
    likeCount: PropTypes.number,
    viewCount: PropTypes.number,
  }).isRequired,
  myStorys: PropTypes.arrayOf(PropTypes.object).isRequired,
  openDeleteModal: PropTypes.func.isRequired,
  file: PropTypes.object,
  previewUrl: PropTypes.string,
  isPending: PropTypes.bool,
  uploadProgress: PropTypes.number,
  isError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      message: PropTypes.string,
    }),
  ]),
  handleFileChange: PropTypes.func?.isRequired,
  handleCreateStory: PropTypes.func?.isRequired,
  setIsAnyModelIsOpen: PropTypes.func?.isRequired,
};

export default MyStory;
