import axiosInstance from './axios.config';

const checkEmail = async (body) => {
  return axiosInstance.post('/auth/check-email', body);
};

const checkUsername = async (body) => {
  return axiosInstance.post('/auth/check-username', body);
};

const register = async (body) => {
  return axiosInstance.post('/auth/register', body);
};

const registerVerifyOtp = async (otp, body) => {
  return axiosInstance.post(`/auth/register/${encodeURIComponent(otp)}`, body);
};

const activateUser = async (token, body) => {
  return axiosInstance.post('/auth/activate', body, {
    headers: {
      IdentificationToken: token,
    },
  });
};

const getMe = async () => {
  return axiosInstance.get('/user/get-me');
};

const login = async (body) => {
  return axiosInstance.post('/auth/login', body);
};

const loginVerifyOTP = async (otp, token) => {
  return axiosInstance.post(`/auth/login/${encodeURIComponent(otp)}`, null, {
    headers: {
      IdentificationToken: token,
    },
  });
};

const forgotPassword = async (body) => {
  return axiosInstance.post('/auth/forget-password', body);
};

const forgotPasswordVerifyOTP = async (otp, body) => {
  return axiosInstance.post(`/auth/forget-password/${encodeURIComponent(otp)}`, body);
};

const deletePost = async (postId) => {
  return axiosInstance.delete(`/post/${encodeURIComponent(postId)}`);
};

const deleteReel = async (reelId) => {
  return axiosInstance.delete(`/reel/${encodeURIComponent(reelId)}`);
};

const deleteComment = async (commentId) => {
  return axiosInstance.delete(`/comment/${encodeURIComponent(commentId)}`);
};

const save = async (body) => {
  return axiosInstance.post('/save', body);
};

const unsave = async (body) => {
  return axiosInstance.delete('/save', {
    params: body,
  });
};

const getSharedPost = async (postId) => {
  return axiosInstance.get(`/post/shared?postId=${postId}`);
};

const getSharedReel = async (reelId) => {
  return axiosInstance.get(`/reel/shared?reelId=${reelId}`);
};

const getSharedPostWithoutAuth = async (postId) => {
  return axiosInstance.get(`/shared/post?postId=${postId}`);
};

const getSharedReelWithoutAuth = async (reelId) => {
  return axiosInstance.get(`/shared/reel?reelId=${reelId}`);
};

const getUserProfile = async (userId) => {
  return axiosInstance.get(`/user/${userId}`);
};

const makeComment = async (body) => {
  return axiosInstance.post('/comment', body);
};

const likeEntity = async (body) => {
  return axiosInstance.post('/like', body);
};

const unlikeEntity = async (body) => {
  return axiosInstance.delete('/like', {
    params: body,
  });
};

const reportEntity = async (body) => {
  return axiosInstance.post('/report', body);
};

const searchUsersByKeyword = async (keyword, body) => {
  return axiosInstance.get(`/user/search/${encodeURIComponent(keyword)}`, {
    params: body,
  });
};

const searchUsersByKeywordForModeration = async (keyword, body) => {
  return axiosInstance.get(`/moderate/user/search/${encodeURIComponent(keyword)}`, {
    params: body,
  });
};

const getModerators = async () => {
  return axiosInstance.get('/moderate/moderator');
};

const createChat = async (userId) => {
  return axiosInstance.post(`/chat/${userId}`);
};

const getMyChats = async () => {
  return axiosInstance.get('/chat');
};

const getMessagesByChatId = async (chatId) => {
  return axiosInstance.get(`/message/${chatId}`);
};

const deleteMessagesByChatId = async (chatId) => {
  return axiosInstance.delete(`/message/${chatId}`);
};

const uploadMedia = async (formData, onUploadProgressHandler) => {
  return axiosInstance.post('/message/upload/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onUploadProgressHandler,
  });
};

const updateProfileAndCoverImage = async (formData) => {
  return axiosInstance.patch('/user/update-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateProfileInfo = async (body) => {
  return axiosInstance.put('/user', body);
};

const follow = async (userId) => {
  return axiosInstance.post(`/user/follow/${userId}`);
};

const unfollow = async (userId) => {
  return axiosInstance.post(`/user/unfollow/${userId}`);
};

const getMyStorys = async () => {
  return axiosInstance.get('/story/my');
};

const getNewStoryUsers = async () => {
  return axiosInstance.get('/story');
};

const getStory = async (userId, index) => {
  return axiosInstance.get(`/story/user/${userId}/${index}`);
};

const deleteStory = async (storyId) => {
  return axiosInstance.delete(`/story/${encodeURIComponent(storyId)}`);
};

const banUserAccount = async (userId, date) => {
  return axiosInstance.patch(`/moderate/user/${userId}/ban`, {
    banToDate: date,
  });
};

const unbanUserAccount = async (userId) => {
  return axiosInstance.patch(`/moderate/user/${userId}/unban`);
};

const deleteUserAccount = async (userId) => {
  return axiosInstance.delete(`/moderate/user/${userId}/delete`);
};

const createModeratorAccount = async (data) => {
  return axiosInstance.post(`/moderate/moderator`, data);
};

const deleteModeratorAccount = async (userId) => {
  return axiosInstance.delete(`/moderate/moderator/${userId}/delete`);
};

const deleteEntity = async (relevantId, reportType) => {
  return axiosInstance.delete(`/moderate/content`, {
    params: {
      relevantId: relevantId,
      reportType: reportType,
    },
  });
};

const deleteAllReports = async (relevantId, type) => {
  return axiosInstance.delete(`/moderate/content/report`, {
    params: {
      relevantId: relevantId,
      reportType: type,
    },
  });
};

export {
  checkEmail,
  checkUsername,
  register,
  registerVerifyOtp,
  activateUser,
  getMe,
  login,
  loginVerifyOTP,
  forgotPassword,
  forgotPasswordVerifyOTP,
  deletePost,
  deleteReel,
  deleteComment,
  save,
  unsave,
  getSharedPost,
  getSharedReel,
  getSharedPostWithoutAuth,
  getSharedReelWithoutAuth,
  getUserProfile,
  makeComment,
  likeEntity,
  unlikeEntity,
  reportEntity,
  searchUsersByKeyword,
  getMyChats,
  createChat,
  getMessagesByChatId,
  uploadMedia,
  deleteMessagesByChatId,
  updateProfileAndCoverImage,
  updateProfileInfo,
  follow,
  unfollow,
  searchUsersByKeywordForModeration,
  banUserAccount,
  unbanUserAccount,
  deleteUserAccount,
  getModerators,
  createModeratorAccount,
  deleteModeratorAccount,
  deleteEntity,
  getMyStorys,
  getStory,
  deleteStory,
  deleteAllReports,
  getNewStoryUsers,
};
