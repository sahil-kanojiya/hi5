import { useRef, useState, useEffect } from 'react';
import axiosInstance from '../../services/axios.config.js';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import { useSelector } from 'react-redux';
import ReelUploadModal from '../reel/ReelUploadModal.jsx';
import { PostCreatedToast as displayPostCreatedToast } from '../providers/ToastProvider.jsx';
import { Link } from 'react-router-dom';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const fileRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState(null);

  const [isReelModalOpen, setIsReelModalOpen] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [disableComments, setDisableComments] = useState(false);

  useEffect(() => {
    return () => {
      if (fileURL) {
        URL.revokeObjectURL(fileURL);
      }
    };
  }, [fileURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationError) {
      return;
    }

    if (file === null && !text.trim()) {
      return;
    }

    setIsPending(true);
    setIsError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('content', text);
    formData.append('isPrivate', isPrivate);
    formData.append('isCommentsDisabled', disableComments);
    if (file) {
      if (file.type.startsWith('image/')) {
        formData.append('image', file);
      } else if (file.type.startsWith('video/')) {
        formData.append('video', file);
      }
    }

    try {
      const response = await axiosInstance.post('/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      console.log('Post created:', response.data);
      setText('');
      setFile(null);
      setFileURL(null);

      setIsPrivate(false);
      setDisableComments(false);

      displayPostCreatedToast();

      fileRef.current.value = null;
    } catch (error) {
      setIsError(error);
      console.error('Error:', error);
    } finally {
      setIsPending(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileType = selectedFile.type;
    const fileSize = selectedFile.size;

    // image size should not bigger then the 20MB
    if (fileType.startsWith('image/') && fileSize > 20 * 1024 * 1024) {
      setValidationError('The selected image exceeds the maximum file size of 20MB.');
    } else {
      setValidationError(null);
    }

    // video size should not be bigger then 1GB
    if (fileType.startsWith('video/') && fileSize > 1024 * 1024 * 1024) {
      setValidationError('The selected video exceeds the maximum file size of 1GB.');
    } else {
      setValidationError(null);
    }

    // video should not be bigger then 5 minutes
    if (fileType.startsWith('video/')) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(selectedFile);
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 5 * 60) {
          setValidationError('The selected video exceeds the maximum length of 5 minutes.');
        }
      };
    } else {
      setValidationError(null);
    }

    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };

  const renderFilePreview = () => {
    if (!file || !fileURL) return null;
    if (validationError) return null;

    if (file.type.startsWith('image/')) {
      return (
        <div className="w-full text-lg text-gray-500">
          <div className="relative mx-auto w-full">
            <CloseRoundedIcon
              className="absolute right-0 top-0 z-10 h-6 w-6 cursor-pointer rounded-full"
              onClick={() => {
                setFile(null);
                setFileURL(null);
                fileRef.current.value = null;
              }}
            />
            <img
              src={fileURL}
              className="mx-auto h-auto max-h-[calc(100vh-250px)] w-full rounded-lg object-contain"
              alt="Preview"
            />
          </div>
        </div>
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <div className="w-full text-lg text-gray-500">
          <div className="relative mx-auto w-full">
            <CloseRoundedIcon
              sx={{
                fontSize: { xs: 25, sm: 28, md: 30 },
              }}
              className="absolute right-0 top-0 z-10 cursor-pointer rounded-full"
              onClick={() => {
                setFile(null);
                setFileURL(null);
                fileRef.current.value = null;
              }}
            />
            <video
              src={fileURL}
              controls
              className="mx-auto h-auto max-h-[calc(100vh-250px)] w-full rounded-lg object-contain"
              controlsList="nodownload"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const user = useSelector((state) => state.user.profile);

  return (
    <div className="mb-3 mt-4 flex w-full max-w-xl items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-black">
      <Link
        to={`/profile/${user?.id}`}
        className="mt-2 h-10 w-10 flex-shrink-0 cursor-pointer overflow-hidden rounded-full shadow-md"
      >
        <img
          alt="Profile"
          src={user?.profilePictureUrl}
          className="aspect-square h-full w-full object-cover"
          loading="lazy"
        />
      </Link>

      <form className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-[85px] w-full resize-none rounded-lg border border-gray-300 bg-gray-100 p-3 text-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {validationError && <p className="text-sm text-red-500">{validationError}</p>}

        {renderFilePreview()}

        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-300 bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-900">
          <div
            className="flex cursor-pointer items-center gap-2 text-sm font-medium transition-all duration-300"
            onClick={() => setIsPrivate(!isPrivate)}
          >
            {isPrivate ? (
              <CheckBox
                fontSize="medium"
                className={`${
                  isPrivate
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              />
            ) : (
              <CheckBoxOutlineBlank
                fontSize="medium"
                className={`${
                  isPrivate
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              />
            )}
            <span className="select-none">Private Post</span>
          </div>

          <div
            className="flex cursor-pointer items-center gap-2 text-sm font-medium transition-all duration-300"
            onClick={() => setDisableComments(!disableComments)}
          >
            {disableComments ? (
              <CheckBox
                fontSize="medium"
                className={`${
                  disableComments
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              />
            ) : (
              <CheckBoxOutlineBlank
                fontSize="medium"
                className={`${
                  disableComments
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              />
            )}
            <span className="select-none">Disable Comments</span>
          </div>
        </div>

        {isPending && (
          <div className="relative h-2 w-full rounded-full bg-gray-300">
            <div
              className="absolute left-0 top-0 h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-3">
            <ImageRoundedIcon
              sx={{ fontSize: 30 }}
              className="cursor-pointer text-gray-600 transition-colors hover:text-blue-500"
              onClick={() => {
                fileRef.current.accept = 'image/*';
                fileRef.current.click();
              }}
            />
            <VideocamRoundedIcon
              sx={{ fontSize: 35 }}
              className="cursor-pointer text-gray-600 transition-colors hover:text-blue-500"
              onClick={() => {
                fileRef.current.accept = 'video/*';
                fileRef.current.click();
              }}
            />
          </div>

          <input
            type="file"
            accept="image/*,video/*"
            hidden
            ref={fileRef}
            onChange={handleFileChange}
          />

          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              className="sm:text-md whitespace-nowrap rounded-md bg-blue-600 px-2 py-2 text-sm text-white shadow-md transition-all duration-300 hover:bg-blue-700 focus:outline-none sm:px-3"
              onClick={() => setIsReelModalOpen(true)}
            >
              Upload Reel
            </button>

            <button
              type="submit"
              className={`sm:text-md whitespace-nowrap rounded-md bg-blue-600 px-2 py-2 text-sm text-white shadow-md transition-all duration-300 hover:bg-blue-700 focus:outline-none sm:px-3 ${
                isPending ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isPending}
            >
              {isPending ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
        {isError && <p className="mt-2 text-sm text-red-500">{isError.message}</p>}
      </form>

      <ReelUploadModal isOpen={isReelModalOpen} onClose={() => setIsReelModalOpen(false)} />
    </div>
  );
};

export default CreatePost;
