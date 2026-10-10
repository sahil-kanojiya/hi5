import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';
import axiosInstance from '../../services/axios.config';
import { deleteStory, getMyStorys } from '../../services/api';
import { StoryCreatedToast as displayStoryCreatedToast } from '../providers/ToastProvider.jsx';
import PropTypes from 'prop-types';
import MyStory from './MyStory.jsx';

const CreateStoryModal = ({ isOpen, closeModal }) => {
  const [myStorys, setMyStorys] = useState([
    {
      newStoryModel: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await getMyStorys();
      setMyStorys([
        ...response.data,
        {
          newStoryModel: true,
        },
      ]);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextImage = useCallback(() => {
    if (currentIndex === myStorys.length - 1) {
      closeModal();
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) => {
      return prevIndex < myStorys.length - 1 ? prevIndex + 1 : prevIndex;
    });
  }, [currentIndex, myStorys, closeModal]);
  const previousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const objectUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleCreateStory = async () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    if (file) {
      if (file.type.startsWith('image/')) {
        formData.append('image', file);
      } else if (file.type.startsWith('video/')) {
        formData.append('video', file);
      }
    }
    try {
      const response = await axiosInstance.post('/story', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      console.log('Story created:', response.data);
      setFile(null);
      setPreviewUrl('');
      setCurrentIndex(0);
      closeModal();
      setIsLoading(true);
      fetchStories();
      displayStoryCreatedToast();
    } catch (error) {
      setIsError(error);
      console.error('Error:', error);
    } finally {
      setIsPending(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStory(myStorys[currentIndex].id);
      console.log('Story deleted');
      setCurrentIndex(0);
      closeModal();
      setMyStorys((prev) => prev.filter((story) => story.id !== myStorys[currentIndex].id));
    } catch (error) {
      console.error('Error deleting story: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const [isAnyModelIsOpen, setIsAnyModelIsOpen] = useState(false);
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => {
        if (currentIndex < myStorys.length - 1) {
          if (!isDeleteModalOpen && !isAnyModelIsOpen) {
            nextImage();
          }
        }
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isOpen, nextImage, myStorys, currentIndex, isDeleteModalOpen, isAnyModelIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, closeModal]);

  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-80 transition-all">
        <button
          onClick={closeModal}
          className="fixed right-4 top-4 z-10 rounded-full bg-gray-500 p-2 text-white"
        >
          <Close className="text-2xl" />
        </button>

        <div className="relative flex h-screen w-full max-w-md flex-col items-center justify-center rounded-md bg-card shadow-lg">
          {isLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
          {!isLoading &&
            myStorys.map((story, index) => (
              <MyStory
                key={index}
                index={index}
                currentIndex={currentIndex}
                story={story}
                myStorys={myStorys}
                openDeleteModal={openDeleteModal}
                file={file}
                previewUrl={previewUrl}
                isPending={isPending}
                uploadProgress={uploadProgress}
                isError={isError}
                handleFileChange={handleFileChange}
                handleCreateStory={handleCreateStory}
                setIsAnyModelIsOpen={setIsAnyModelIsOpen}
              />
            ))}

          {!isLoading && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-400 p-3 text-white opacity-50 shadow-lg hover:bg-gray-700"
              >
                <ChevronLeft className="text-2xl" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-400 p-3 text-white opacity-50 shadow-lg hover:bg-gray-700"
              >
                <ChevronRight className="text-2xl" />
              </button>
            </>
          )}
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="STORY"
      />
      ShowUsersModal like views
    </>
  );
};

CreateStoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default CreateStoryModal;
