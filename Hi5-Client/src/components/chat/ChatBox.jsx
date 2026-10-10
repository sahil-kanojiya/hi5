import React, { useState, useEffect, useRef } from 'react';
import { getMessagesByChatId, uploadMedia } from '../../services/api';
import { useWebSocket } from '../../socket/WebSocketProvider';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CloseRounded, ImageRounded, VideocamRounded } from '@mui/icons-material';

const ChatBox = ({ chatId, receiverId }) => {
  const { publish } = useWebSocket();
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');

  const myId = useSelector((state) => state?.user?.profile?.id);

  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();

  useEffect(() => {
    setMessage('');
    setError(null);
    setFile(null);
    setFileError(null);
    setFileURL(null);
    if (!chatId) return;

    let subscription;

    const fetchMessagesAndSubscribeTopic = async () => {
      try {
        setIsMessagesLoading(true);
        const response = await getMessagesByChatId(chatId);
        setMessages(response.data);
      } catch (e) {
        setError(e);
      } finally {
        setIsMessagesLoading(false);
      }

      if (isConnected) {
        try {
          subscription = subscribeTopic(`/message/${myId + receiverId}`, (message) => {
            const msg = JSON.parse(message);
            if (msg?.senderUserId == receiverId) {
              console.log(receiverId, msg?.senderUserId);
              setMessages((prev) => [...prev, msg]);
            }
          });
        } catch (e) {
          console.log('Subscription error:', e);
        }
      }
    };

    fetchMessagesAndSubscribeTopic();

    return () => {
      if (subscription) {
        console.log('Unsubscribing from:', `/message/${myId + receiverId}`);
        unsubscribeTopic(subscription);
      }
    };
  }, [chatId, myId, receiverId, isConnected, subscribeTopic, unsubscribeTopic]);

  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const fileRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        if (file?.type.startsWith('image/')) {
          setIsImage(true);
        } else if (file?.type.startsWith('video/')) {
          setIsVideo(true);
        } else {
          setFileError('this file is not supported');
          return;
        }

        if (isImage || isVideo) {
          try {
            setIsPending(true);
            setFileError(null);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append(isImage ? 'image' : isVideo ? 'video' : 'file', file);

            const response = await uploadMedia(formData, (progressEvent) => {
              setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            });

            setFileURL(response?.data);
          } catch (error) {
            setFileError(error);
            console.error('Upload error:', error);
          } finally {
            setIsPending(false);
          }
        }
      }
    };
    uploadFile();
  }, [file, isImage, isVideo]);

  const handleSendMessage = async () => {
    if (!message.trim() && !file && !(isImage || isVideo) && !fileURL) return;

    publish('/app/message', {
      chatId,
      message,
      senderUserId: myId,
      receiverUserId: receiverId,
      ...(isImage && fileURL ? { imageUrl: fileURL } : {}),
      ...(isVideo && fileURL ? { videoUrl: fileURL } : {}),
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        chatId,
        message,
        senderUserId: myId,
        createdAt: new Date().toISOString(),
        ...(isImage && fileURL ? { imageUrl: fileURL } : {}),
        ...(isVideo && fileURL ? { videoUrl: fileURL } : {}),
      },
    ]);

    if (fileRef.current) fileRef.current.value = null;
    setFile(null);
    setFileURL(null);
    setMessage('');
    setIsImage(false);
    setIsVideo(false);
    setIsPending(false);
    setFileError(null);
    setUploadProgress(0);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderFilePreview = () => {
    if (!file || !fileURL) return null;
    if (isImage) {
      return (
        <div className="relative h-full">
          <CloseRounded
            className="absolute right-0 top-0 z-10 h-6 w-6 cursor-pointer rounded-full"
            onClick={() => {
              setFile(null);
              setFileURL(null);
              fileRef.current.value = null;
            }}
          />
          <img src={fileURL} className="mx-auto h-full rounded-lg object-contain" alt="Preview" />
        </div>
      );
    }
    if (isVideo) {
      return (
        <div className="relative h-full">
          <CloseRounded
            sx={{
              fontSize: { xs: 25, sm: 28, md: 30 },
            }}
            className="absolute right-0 top-0 z-10 cursor-pointer rounded-full"
            onClick={() => {
              setFile(null);
              setFileURL(null);
              fileRef.current.value = null;
              setIsImage(false);
              setIsVideo(false);
              setIsPending(false);
              setFileError(null);
              setUploadProgress(0);
            }}
          />
          <video
            src={fileURL}
            controls
            className="mx-auto h-full rounded-lg object-contain"
            controlsList="nodownload"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="hide-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto rounded-lg bg-gray-300 p-4 dark:bg-gray-800">
        {!chatId && <p className="text-center text-gray-400">Select a user to start chatting.</p>}
        {isMessagesLoading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {chatId && !isMessagesLoading && !error && messages.length > 0 ? (
          messages.map((msg, index) => {
            const currentMessageDate = formatDate(msg.createdAt);
            const previousMessageDate =
              index > 0 ? formatDate(messages[index - 1].createdAt) : null;
            const showDateHeader = currentMessageDate !== previousMessageDate;

            return (
              <div key={msg.id}>
                {showDateHeader && (
                  <div className="my-2 flex justify-center">
                    <div className="max-w-xs rounded-lg bg-gray-400 bg-opacity-10 px-3 py-1 text-sm dark:bg-gray-600">
                      <p className="font-medium">{currentMessageDate}</p>
                    </div>
                  </div>
                )}
                <div
                  className={`flex gap-1 ${
                    msg?.senderUserId === myId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg p-2 text-sm ${
                      msg?.senderUserId === myId
                        ? 'bg-blue-400 dark:bg-blue-600'
                        : 'bg-gray-400 dark:bg-gray-600'
                    } max-w-xs`}
                  >
                    {(msg?.imageUrl || msg?.videoUrl) && (
                      <div className="flex h-48 w-full text-gray-50">
                        {msg?.imageUrl && (
                          <img
                            src={msg?.imageUrl}
                            className="mx-auto h-full rounded-lg"
                            alt="image"
                          />
                        )}
                        {msg?.videoUrl && (
                          <video
                            src={msg?.videoUrl}
                            controls
                            className="mx-auto h-full rounded-lg"
                            controlsList="nodownload"
                          />
                        )}
                      </div>
                    )}
                    {msg?.message && (
                      <p className="whitespace-pre-wrap break-words font-medium">{msg?.message}</p>
                    )}
                    <span className="mt-1 block text-xs text-gray-300">
                      {extractTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No messages yet. Say hi!</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-2">
        <div className="flex flex-col items-center rounded-xl bg-gray-200 p-1 dark:bg-gray-800">
          {file && fileURL && (
            <div className="flex h-48 w-full p-1 text-gray-500">{renderFilePreview()}</div>
          )}

          {fileError && (
            <div className="w-full rounded-full bg-gray-200 p-1 text-red-400">{fileError}</div>
          )}

          {isPending && (
            <div className="w-full rounded-full bg-gray-200 p-1">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex w-full items-center gap-3 rounded-xl bg-gray-200 p-1 dark:bg-gray-800">
            <div className="flex flex-1 items-center rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-600 dark:bg-gray-700">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={chatId ? 'Type a message...' : 'Select a user to chat'}
                className="max-h-[50px] min-h-[40px] flex-1 resize-none overflow-y-auto bg-transparent p-3 text-gray-900 focus:outline-none disabled:opacity-50 dark:text-gray-100"
                disabled={!chatId || isMessagesLoading}
              />

              {/* Action Buttons (Image & Video) */}
              <div className="flex items-center gap-2 pr-2">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full p-2 transition hover:bg-gray-300 dark:hover:bg-gray-700"
                  disabled={chatId === undefined}
                  onClick={() => {
                    fileRef.current.accept = 'image/*';
                    fileRef.current.click();
                  }}
                >
                  <ImageRounded
                    sx={{ fontSize: 24 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>

                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full p-2 transition hover:bg-gray-300 dark:hover:bg-gray-700"
                  disabled={chatId === undefined}
                  onClick={() => {
                    fileRef.current.accept = 'video/*';
                    fileRef.current.click();
                  }}
                >
                  <VideocamRounded
                    sx={{ fontSize: 28 }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>

                <input
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  ref={fileRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className={`rounded-lg px-6 py-3 text-white transition-all hover:scale-105 ${
                chatId
                  ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-500 opacity-50'
              }`}
              disabled={!chatId || isMessagesLoading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ChatBox.propTypes = {
  chatId: PropTypes.string,
  receiverId: PropTypes.string,
};

const formatDate = (isoString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(isoString).toLocaleDateString(undefined, options);
};

const extractTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export default React.memo(ChatBox);
