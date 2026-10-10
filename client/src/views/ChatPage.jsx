import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { createChat, deleteMessagesByChatId, getMyChats } from '../services/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWebSocket } from '../socket/WebSocketProvider';
import ChatBox from '../components/chat/ChatBox';
import { MoreVertRounded, Email } from '@mui/icons-material';
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

  return (
    <MainLayout>
      <div className="flex h-full w-full justify-center bg-background md:ml-[6dvw] md:max-w-3xl lg:ml-[20dvw] lg:max-w-3xl xl:ml-[19dvw] xl:max-w-5xl 2xl:ml-[10dvw]">
        <div className="my-0 flex w-full justify-center space-x-1 px-4 md:my-4 lg:space-x-4">
          <div className="mb-12 mt-[70px] flex w-full flex-1 flex-col md:mb-0 md:mt-0 md:max-w-[280px] lg:max-w-[320px]">
            <div className="flex h-[calc(100vh-100px)] w-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-6 flex w-full flex-col gap-4">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Messages</h2>
                <div className="flex items-center gap-2">
                  <Link to="/search" className="flex-1">
                    <button className="w-full whitespace-nowrap rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all hover:bg-muted active:scale-[0.98]">
                      Search Users
                    </button>
                  </Link>

                  <button
                    className="flex-1 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
                    onClick={loadNewChats}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <ul className="hide-scrollbar flex flex-1 flex-col overflow-y-auto rounded-md">
                {chatLoading ? (
                  <p className="pt-4 text-center text-sm font-medium text-muted-foreground">
                    Loading chats...
                  </p>
                ) : (
                  <>
                    {chats.length > 0 ? (
                      <div className="space-y-1">
                        {chats.map((chat) => (
                          <li
                            key={chat?.chatId}
                            className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                              selectedChat?.receiverId === chat?.receiverId
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'text-foreground hover:bg-muted'
                            }`}
                            onClick={() => {
                              navigate(`/chat/${chat.receiverId}`);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={chat.receiverProfileImageUrl}
                                  alt={chat.receiverFullname}
                                  className="h-10 w-10 rounded-full border border-border object-cover"
                                />
                                <span
                                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
                                    chat.receiverStatus === 'ONLINE'
                                      ? 'bg-green-500'
                                      : 'bg-gray-400'
                                  }`}
                                ></span>
                              </div>
                              <div className="flex flex-col">
                                <span className="max-w-[130px] truncate text-sm font-semibold">
                                  {chat.receiverFullname}
                                </span>
                                <span className="max-w-[130px] truncate text-xs text-muted-foreground">
                                  @{chat.receiverUsername}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 pt-8 text-center text-sm text-muted-foreground">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <MoreVertRounded className="text-muted-foreground/50" />
                        </div>
                        <p>No conversations yet.</p>
                        <p className="text-xs">Start a chat to connect with others!</p>
                      </div>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="hidden flex-1 flex-col md:flex">
            <div className="flex h-[calc(100vh-100px)] flex-col overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm">
              <div className="z-10 flex items-center justify-between border-b border-border bg-card/50 p-4 backdrop-blur-sm">
                <div className="flex w-full items-center justify-between font-semibold">
                  {selectedChat ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/profile/${selectedChat?.receiverId}`}
                          className="group relative"
                        >
                          <img
                            src={selectedChat?.receiverProfileImageUrl}
                            alt={selectedChat?.receiverFullname}
                            className="h-11 w-11 rounded-full border border-border object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex flex-col">
                          <span className="font-semibold tracking-tight text-foreground">
                            {selectedChat?.receiverFullname}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                selectedChat.receiverStatus === 'ONLINE'
                                  ? 'bg-green-500'
                                  : 'bg-gray-400'
                              }`}
                            />
                            {selectedChat.receiverStatus === 'ONLINE' ? 'Active now' : 'Offline'}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex items-center gap-3">
                        <span
                          className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
                          onClick={toggleModal}
                        >
                          <MoreVertRounded fontSize="medium" />
                        </span>

                        {isModalOpen && (
                          <div className="absolute right-0 top-12 z-50 flex w-48 flex-col overflow-hidden rounded-lg border border-border bg-popover shadow-md">
                            <button
                              className="w-full p-3 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                              onClick={openDeleteModal}
                            >
                              Delete Conversation
                            </button>
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
                    <div className="flex h-full w-full items-center justify-center p-4">
                      <p className="text-lg font-medium text-muted-foreground">
                        Select a user to chat
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedChat ? (
                <div className="flex-1 overflow-hidden bg-background/50">
                  <ChatBox chatId={selectedChat?.chatId} receiverId={selectedChat?.receiverId} />
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center bg-background/30 p-8 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Email className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">
                    Your Messages
                  </h3>
                  <p className="max-w-[250px] text-muted-foreground">
                    Select an existing conversation or search for users to start a new chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
