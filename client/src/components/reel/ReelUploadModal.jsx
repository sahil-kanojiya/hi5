import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../services/axios.config';
import { ReelCreatedToast as displayReelCreatedToast } from '../providers/ToastProvider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const ReelUploadModal = ({ isOpen, onClose }) => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(null);
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [disableComments, setDisableComments] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setValidationError('');
    setUploadError('');
    const isValidVideo = file.type.startsWith('video/');
    if (isValidVideo && file.size > 1024 * 1024 * 1024) {
      setValidationError('The selected video exceeds the maximum file size of 1GB.');
      return;
    }

    setVideo(file);
    const videoURL = URL.createObjectURL(file);
    setPreview(videoURL);

    const videoElement = document.createElement('video');
    videoElement.src = videoURL;
    videoElement.preload = 'metadata';
    videoElement.onloadedmetadata = () => {
      setDuration(Math.floor(videoElement.duration));
    };
  };

  const handleUpload = async () => {
    setValidationError('');
    setUploadError('');

    if (validationError) return;
    if (!video) {
      setValidationError('Please select a video to upload the reel!');
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('video', video);
    formData.append('isPrivate', isPrivate);
    formData.append('isCommentsDisabled', disableComments);
    try {
      console.log('-------------------');
      console.log(description, duration, isPrivate, disableComments);
      setLoading(true);
      const response = await axiosInstance.post('/reel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });
      console.log('Reel created:', response.data);

      displayReelCreatedToast();

      clearAll();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('An error occurred during the upload. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const clearAll = () => {
    setVideo(null);
    setPreview(null);
    setDuration(null);
    setValidationError('');
    setUploadProgress(0);
    setUploadError('');
    setDescription('');
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      clearAll();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="w-full max-w-md rounded-lg border border-gray-500 bg-card p-4 px-5 shadow-lg sm:max-w-lg lg:max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upload Reel</h2>
          <button
            onClick={() => {
              clearAll();
              onClose();
            }}
            className="text-muted-foreground transition duration-200 hover:text-red-500"
          >
            <CloseRoundedIcon
              sx={{
                fontSize: { xs: 25, sm: 28, md: 30 },
              }}
            />
          </button>
        </div>

        <div className="hide-scrollbar max-h-[70dvh] overflow-y-auto">
          {validationError && <div className="text-sm text-red-600">{validationError}</div>}
          {uploadError && <div className="text-sm text-red-600">{uploadError}</div>}

          <div>
            <span>Video:</span>
            {preview ? (
              <div className="relative mx-auto w-full p-2">
                <button type="button" onClick={clearAll}>
                  <CloseRoundedIcon
                    sx={{
                      fontSize: { xs: 25, sm: 28, md: 30 },
                    }}
                    className="absolute right-1 top-1 cursor-pointer rounded-full bg-muted p-1 hover:bg-gray-400 dark:hover:bg-gray-600"
                  />
                </button>
                <video
                  ref={videoRef}
                  className="max-h-[50dvh] w-full rounded-lg object-contain"
                  controls
                  src={preview}
                />
              </div>
            ) : (
              <span className="pl-2 text-muted-foreground">No video selected</span>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div
                className="flex flex-grow cursor-pointer items-center justify-center rounded-md border p-3 shadow-sm transition duration-200 hover:bg-background dark:border-gray-800 dark:hover:bg-gray-800"
                onClick={() => videoInputRef.current.click()}
              >
                <span className="font-semibold">Select Video</span>
                <input
                  disabled={isLoading}
                  type="file"
                  accept="video/*"
                  ref={videoInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Select a video file"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-300 bg-background p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700">
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
                        : 'text-muted-foreground dark:text-muted-foreground'
                    }`}
                  />
                ) : (
                  <CheckBoxOutlineBlank
                    fontSize="medium"
                    className={`${
                      isPrivate
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-muted-foreground dark:text-muted-foreground'
                    }`}
                  />
                )}
                <span className="select-none">Private Reel</span>
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
                        : 'text-muted-foreground dark:text-muted-foreground'
                    }`}
                  />
                ) : (
                  <CheckBoxOutlineBlank
                    fontSize="medium"
                    className={`${
                      disableComments
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-muted-foreground dark:text-muted-foreground'
                    }`}
                  />
                )}
                <span className="select-none">Disable Comments</span>
              </div>
            </div>

            <textarea
              disabled={isLoading}
              className="min-h-[85px] w-full resize-none rounded-lg border border-gray-300 bg-background p-3 text-sm focus:outline-none dark:border-gray-700"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4 h-2.5 w-full rounded-full bg-muted">
                <div
                  className="h-2.5 rounded-full bg-blue-600"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={isLoading}
              className={`w-full rounded-lg py-2 text-white ${
                isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition duration-200`}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ReelUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReelUploadModal;
