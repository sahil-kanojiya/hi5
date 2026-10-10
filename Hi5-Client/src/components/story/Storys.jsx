import { useEffect, useState } from 'react';
import { CameraAlt } from '@mui/icons-material';
import CreateStoryModal from './CreateStoryModal.jsx';
import { getNewStoryUsers } from '../../services/api.js';
import Story from './Story.jsx';
import StorySkeleton from '../skeletons/StorySkeleton.jsx';

const Stories = () => {
  const [newStoryUsers, setNewStoryUsers] = useState([]);
  const [isUsersStorysLoading, setIsUsersStorysUsersLoading] = useState(true);
  const fetchFolloingsUsersStories = async () => {
    try {
      setIsUsersStorysUsersLoading(true);
      const response = await getNewStoryUsers();
      setNewStoryUsers(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsUsersStorysUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchFolloingsUsersStories();
  }, []);

  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const handleCreateStoryModelOpen = () => {
    setIsCreateStoryModalOpen(true);
  };
  const handleCreateStoryModelClose = () => {
    setIsCreateStoryModalOpen(false);
  };

  return (
    <>
      <div className="hide-scrollbar flex w-full max-w-xl gap-4 overflow-x-auto rounded-md bg-white p-4 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500"
            onClick={handleCreateStoryModelOpen}
          >
            <CameraAlt className="text-2xl text-blue-500" />
          </div>
          <p className="mt-2 w-20 truncate text-sm text-gray-700">My Story</p>
        </div>
        {isUsersStorysLoading && <StorySkeleton />}
        {!isUsersStorysLoading &&
          newStoryUsers.map((newStoryUser) => (
            <Story key={newStoryUser.id} newStoryUser={newStoryUser} />
          ))}
      </div>

      {isCreateStoryModalOpen && (
        <CreateStoryModal
          isOpen={isCreateStoryModalOpen}
          closeModal={handleCreateStoryModelClose}
        />
      )}
    </>
  );
};

export default Stories;
