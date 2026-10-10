import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { createChat, deleteMessagesByChatId, getMyChats } from '../services/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../socket/WebSocketProvider';
import ChatBox from '../components/chat/ChatBox';
import { MoreVertRounded } from '@mui/icons-material';
import DeleteConfirmationModal from '../components/modal/DeleteConfirmationModal';

const ChatPage = () => {
  const myId = useSelector((state) => state?.user?.profile?.id);
  const { subscribeTopic, unsubscribeTopic, isConnected } = useWebSocket();

  const navigate = useNavigate();
  const { userId } = useParams();
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);

  const handleCreateChat = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await createChat(userId);
      console.log('Chat Created:', response);
      return response;
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    setChatLoading(true);
    try {
      if (userId) {
        await handleCreateChat();
      }
      const response = await getMyChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setChatLoading(false);
    }
  }, [userId, handleCreateChat]);

  useEffect(() => {
    loadData();
  }, [userId, loadData]);

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (isConnected) {
      let subscription;
      try {
        subscription = subscribeTopic(`/presence/${myId}`, (message) => {
          const newData = JSON.parse(message);
          setChats((prevChats) =>
            prevChats.map((chat) => ({
              ...chat,
              receiverStatus: newData[chat.receiverId] || 'OFFLINE',
            }))
          );
        });
      } catch (e) {
        console.log('error:' + e);
      }
      return () => {
        unsubscribeTopic(subscription);
      };
    }
  }, [myId, isConnected, subscribeTopic, unsubscribeTopic]);

  useEffect(() => {
    setSelectedChat(chats.find((chat) => chat.receiverId === userId));
  }, [setSelectedChat, chats, userId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIsModalOpen(false);
  };
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMessagesByChatId(selectedChat?.chatId);
      console.log('messages deleted');
    } catch (error) {
      console.error('Error deleting messages: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
      setIsModalOpen(false);
      navigate('/chat');
    }
  };

  const loadNewChats = () => {
    loadData();
  };

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const setSelectedChatNull = () => {
  //   setSelectedChat(null);
  // };

  return (
    <MainLayout>
      <div className="flex h-full w-full justify-center md:ml-[6dvw] md:max-w-3xl lg:ml-[20dvw] lg:max-w-3xl xl:ml-[19dvw] xl:max-w-5xl 2xl:ml-[10dvw]">
        <div className="my-0 flex w-full justify-center space-x-1 px-4 md:my-4 lg:space-x-3">
          <div className="mb-12 mt-16 flex w-full flex-1 md:mb-0 md:mt-0 md:max-w-[250px] lg:max-w-xs">
            <div className="flex w-full flex-col rounded-lg bg-white p-4 shadow-md dark:bg-black">
              <div className="mb-7 flex w-full flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold">Users</h2>
                <div className="flex items-center gap-2">
                  <Link to="/search">
                    <button className="whitespace-nowrap rounded-lg bg-blue-500 px-2 py-1 text-sm text-white transition-all hover:bg-blue-600 sm:text-base">
                      Search Users
                    </button>
                  </Link>

                  <button
                    className="whitespace-nowrap rounded-lg bg-blue-500 px-2 py-1 text-sm text-white transition-all hover:bg-blue-600 sm:text-base"
                    onClick={loadNewChats}
                  >
                    New Chats
                  </button>
                </div>
              </div>

              <ul className="hide-scrollbar flex flex-1 flex-col overflow-y-auto rounded-md">
                {chatLoading ? (
                  <p className="pt-4 text-center text-sm text-slate-500 md:text-base">Loading...</p>
                ) : (
                  <>
                    {chats.length > 0 ? (
                      <>
                        {chats.map((chat) => (
                          <li
                            key={chat?.chatId}
                            className={`mb-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all ${
                              selectedChat?.receiverId === chat?.receiverId
                                ? '!bg-blue-400 dark:bg-blue-600'
                                : 'bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900'
                            }`}
                            onClick={() => {
                              navigate(`/chat/${chat.receiverId}`);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={chat.receiverProfileImageUrl}
                                alt={chat.receiverFullname}
                                className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold sm:text-base">
                                  {chat.receiverFullname}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                                  {chat.receiverUsername}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`h-2 w-2 rounded-full sm:h-3 sm:w-3 ${
                                chat.receiverStatus === 'ONLINE' ? 'bg-green-500' : 'bg-gray-500'
                              }`}
                            ></span>
                          </li>
                        ))}
                      </>
                    ) : (
                      <p className="pt-4 text-center text-sm text-slate-500 md:text-base">
                        No conversations yet. <br />
                        Start a chat to connect with others!
                      </p>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="hidden flex-1 flex-col md:flex">
            <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white p-4 shadow-md dark:bg-black">
              <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-2 dark:border-gray-700">
                <div className="flex w-full items-center justify-between px-3 font-semibold">
                  {selectedChat ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Link to={`/profile/${selectedChat?.receiverId}`}>
                          <img
                            src={selectedChat?.receiverProfileImageUrl}
                            alt={selectedChat?.receiverFullname}
                            className="h-10 w-10 rounded-full"
                          />
                        </Link>
                        <div className="flex flex-col">
                          <span className="font-semibold">{selectedChat?.receiverFullname}</span>
                          <span className="text-sm text-gray-400">
                            {selectedChat?.receiverUsername}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex items-center gap-3">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            selectedChat.receiverStatus === 'ONLINE'
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          }`}
                        />
                        <span className="cursor-pointer" onClick={toggleModal}>
                          <MoreVertRounded
                            sx={{
                              fontSize: { xs: 22, sm: 25, md: 28 },
                            }}
                          />
                        </span>

                        {isModalOpen && (
                          <div className="absolute left-11 top-7 z-50 flex w-48 flex-col rounded-md bg-white p-2 shadow-lg dark:bg-black">
                            <div
                              className="cursor-pointer whitespace-nowrap rounded-md p-2 text-center hover:bg-gray-200 dark:hover:bg-gray-800"
                              onClick={openDeleteModal}
                            >
                              Delete All Messages
                            </div>
                          </div>
                        )}

                        <DeleteConfirmationModal
                          isOpen={isDeleteModalOpen}
                          closeModal={closeDeleteModal}
                          confirmDelete={confirmDelete}
                          isDeleting={isDeleting}
                          type="MESSAGES"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-2xl">Select a user to chat</p>
                  )}
                </div>
              </div>

              <ChatBox chatId={selectedChat?.chatId} receiverId={selectedChat?.receiverId} />
            </div>
          </div>

          {/* <div className="md:hidden block relative">
            {selectedChat && <>
            <div className="z-20 fixed inset-0">
            </div>
            </>}
          </div> */}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
