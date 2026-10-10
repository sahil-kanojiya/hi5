import PropTypes from 'prop-types';
import { useState } from 'react';
import ViewStorysModal from './ViewStorysModal';

const Story = ({ newStoryUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleStoryClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="flex cursor-pointer flex-col items-center text-center"
        onClick={handleStoryClick}
      >
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-blue-500">
          <img
            src={newStoryUser.profilePictureUrl}
            alt={`${newStoryUser.fullname}'s profile`}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="mt-2 w-20 truncate text-sm text-gray-700">{newStoryUser.fullname}</p>
      </div>
      {isModalOpen && (
        <ViewStorysModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          newStoryUser={newStoryUser}
        />
      )}
    </>
  );
};

Story.propTypes = {
  newStoryUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    profilePictureUrl: PropTypes.string.isRequired,
    totalStorys: PropTypes.number.isRequired,
    totalSeenStorys: PropTypes.number.isRequired,
  }).isRequired,
};

export default Story;
