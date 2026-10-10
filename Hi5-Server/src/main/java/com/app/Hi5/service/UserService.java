package com.app.Hi5.service;

import com.app.Hi5.dto.enums.FollowStatus;
import com.app.Hi5.dto.request.SettingsRequest;
import com.app.Hi5.dto.response.*;
import com.app.Hi5.exceptions.ActionNotAllowedException;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.Enum.Gender;
import com.app.Hi5.model.Enum.NotificationType;
import com.app.Hi5.model.Enum.ProfileType;
import com.app.Hi5.model.Enum.Role;
import com.app.Hi5.model.Notification;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.*;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.enums.FileType;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final NotificationRepository notificationRepository;
    private final OtpRepository otpRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final StoryRepository storyRepository;
    private final UserActivityRepository userActivityRepository;

    public List<UserSearchResponse> getUsersByKeyword(
            String keyword, Integer page, Integer size, User myUser) {
        Page<User> users =
                userRepository.findUsersByUsernameAndFullname(keyword, PageRequest.of(page, size));
        return users.getContent().stream()
                .map(
                        user ->
                                UserSearchResponse.builder()
                                        .id(user.getId().toHexString())
                                        .username(user.getUsername())
                                        .fullname(user.getFullname())
                                        .profilePictureUrl(user.getProfileImageUrl())
                                        .followStatus(
                                                user.getFollowerUserIds()
                                                                .contains(
                                                                        myUser.getId()
                                                                                .toHexString())
                                                        ? FollowStatus.FOLLOWED
                                                        : (user.getFollowRequestReceivedUserIds()
                                                                        .contains(
                                                                                myUser.getId()
                                                                                        .toHexString())
                                                                ? FollowStatus.REQUEST_SENT
                                                                : FollowStatus.NOT_FOLLOWED))
                                        .build())
                .collect(Collectors.toList());
    }

    public List<UserCardResponse> getUsersByKeywordForModeration(
            String keyword, Integer page, Integer size, User myUser) {
        Page<User> users =
                userRepository.findUsersByUsernameAndFullname(keyword, PageRequest.of(page, size));
        return users.getContent().stream()
                .map(
                        user ->
                                UserCardResponse.builder()
                                        .id(user.getId().toHexString())
                                        .username(user.getUsername())
                                        .fullname(user.getFullname())
                                        .profilePictureUrl(user.getProfileImageUrl())
                                        .banUntil(user.getBanUntil())
                                        .build())
                .collect(Collectors.toList());
    }

    public UserProfileResponse getProfile(String userId, User user) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid userId");
        }
        User searchedUser =
                userRepository
                        .findUserById(new ObjectId(userId))
                        .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        boolean isSelf = userId.equals(user.getId().toHexString());
        boolean isFollower = searchedUser.getFollowerUserIds().contains(user.getId().toHexString());
        FollowStatus followStatus =
                isFollower
                        ? FollowStatus.FOLLOWED
                        : (searchedUser
                                        .getFollowRequestReceivedUserIds()
                                        .contains(user.getId().toHexString())
                                ? FollowStatus.REQUEST_SENT
                                : FollowStatus.NOT_FOLLOWED);
        if (isSelf || searchedUser.getProfileType().equals(ProfileType.PUBLIC) || isFollower) {
            return buildUserProfileResponse(searchedUser, followStatus);
        }
        return buildPrivateUserProfileResponse(searchedUser, followStatus);
    }

    private UserProfileResponse buildUserProfileResponse(
            User searchedUser, FollowStatus followStatus) {
        return UserProfileResponse.builder()
                .id(searchedUser.getId().toHexString())
                .username(searchedUser.getUsername())
                .fullname(searchedUser.getFullname())
                .email(searchedUser.getEmail())
                .profilePictureUrl(searchedUser.getProfileImageUrl())
                .coverPictureUrl(searchedUser.getCoverImageUrl())
                .bio(searchedUser.getBio())
                .link(searchedUser.getLink())
                .dateOfBirth(searchedUser.getDateOfBirth())
                .gender(searchedUser.getGender())
                .followersCount((long) searchedUser.getFollowerUserIds().size())
                .followingsCount((long) searchedUser.getFollowingUserIds().size())
                .postsCount((long) searchedUser.getUserPostIds().size())
                .followStatus(followStatus)
                .profileType(ProfileType.PUBLIC)
                .build();
    }

    private UserProfileResponse buildPrivateUserProfileResponse(
            User searchedUser, FollowStatus followStatus) {
        return UserProfileResponse.builder()
                .id(searchedUser.getId().toHexString())
                .username(searchedUser.getUsername())
                .fullname(searchedUser.getFullname())
                .email(null)
                .profilePictureUrl(searchedUser.getProfileImageUrl())
                .coverPictureUrl("/resource/user/coverImage/default.png")
                .bio(null)
                .link(null)
                .dateOfBirth(null)
                .gender(Gender.PREFER_NOT_TO_SAY)
                .followersCount((long) searchedUser.getFollowerUserIds().size())
                .followingsCount((long) searchedUser.getFollowingUserIds().size())
                .postsCount((long) searchedUser.getUserPostIds().size())
                .followStatus(followStatus)
                .profileType(ProfileType.PRIVATE)
                .build();
    }

    public UpdateImagesResponse updateUserImages(
            User user, MultipartFile profilePicture, MultipartFile coverPicture) {
        String oldProfilePictureUrl = user.getProfileImageUrl();
        String oldCoverPictureUrl = user.getProfileImageUrl();
        try {
            if (profilePicture != null && !profilePicture.isEmpty()) {
                log.debug("Profile image is not null: {}", profilePicture.getOriginalFilename());
                String profilePictureUrl =
                        fileStorage.saveFile(profilePicture, FileType.USER_PROFILE_IMAGE);
                user.setProfileImageUrl(profilePictureUrl);
            }
            if (coverPicture != null && !coverPicture.isEmpty()) {
                log.debug("Cover image is not null: {}", coverPicture.getOriginalFilename());
                String coverPictureUrl =
                        fileStorage.saveFile(coverPicture, FileType.USER_COVER_IMAGE);
                user.setCoverImageUrl(coverPictureUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("images not updated!");
        }
        User persistedUser = userRepository.save(user);
        if (!persistedUser.getProfileImageUrl().equals(oldProfilePictureUrl)
                && !oldProfilePictureUrl.contains("/default.png")) {
            try {
                fileStorage.deleteFile(oldProfilePictureUrl);
            } catch (IOException e) {
                log.error("Exception occured while deleting ProfileImage:", e);
            }
        }
        if (!persistedUser.getCoverImageUrl().equals(oldCoverPictureUrl)
                && !oldCoverPictureUrl.contains("/default.png")) {
            try {
                fileStorage.deleteFile(oldCoverPictureUrl);
            } catch (IOException e) {
                log.error("Exception occured while deleting CoverImage:", e);
            }
        }
        return UpdateImagesResponse.builder()
                .profilePictureUrl(persistedUser.getProfileImageUrl())
                .coverPictureUrl(persistedUser.getCoverImageUrl())
                .build();
    }

    public void updateUser(
            User user, String fullname, String bio, String link, Date dob, Gender gender) {
        user.setFullname(fullname);
        user.setBio(bio);
        user.setLink(link);
        user.setDateOfBirth(dob);
        user.setGender(gender);
        userRepository.save(user);
    }

    public FollowUserResponse follow(User user, String userToFollowId) {
        if (user.getId().toHexString().equals(userToFollowId)) {
            throw new IllegalStateException("You cannot follow yourself.");
        }
        User userToFollow =
                userRepository
                        .findById(new ObjectId(userToFollowId))
                        .orElseThrow(
                                () -> new EntityNotFoundException("User to follow not found!"));
        if (userToFollow.getFollowRequestBehaviourAuto()) {
            user.getFollowingUserIds().add(userToFollow.getId().toHexString());
            userToFollow.getFollowerUserIds().add(user.getId().toHexString());
            userRepository.save(user);
            userRepository.save(userToFollow);
            notificationService.makeFollowNotificationAndSend(
                    user, userToFollow, FollowStatus.FOLLOWED);
            return FollowUserResponse.builder()
                    .currentStatus(FollowStatus.FOLLOWED)
                    .message("User followed successfully.")
                    .status(HttpStatus.OK)
                    .build();
        } else {
            userToFollow.getFollowRequestReceivedUserIds().add(user.getId().toHexString());
            user.getFollowRequestSentUserIds().add(userToFollow.getId().toHexString());
            userRepository.save(userToFollow);
            userRepository.save(user);
            notificationService.makeFollowNotificationAndSend(
                    user, userToFollow, FollowStatus.REQUEST_SENT);
            return FollowUserResponse.builder()
                    .currentStatus(FollowStatus.REQUEST_SENT)
                    .message("Follow Notification send successfully.")
                    .status(HttpStatus.ACCEPTED)
                    .build();
        }
    }

    public FollowUserResponse unfollow(User user, String userToUnfollowId) {
        if (user.getId().toHexString().equals(userToUnfollowId)) {
            throw new IllegalStateException("You cannot unfollow yourself.");
        }
        User userToUnfollow =
                userRepository
                        .findById(new ObjectId(userToUnfollowId))
                        .orElseThrow(
                                () -> new EntityNotFoundException("User to follow not found!"));
        user.getFollowingUserIds().remove(userToUnfollow.getId().toHexString());
        userToUnfollow.getFollowerUserIds().remove(user.getId().toHexString());
        userRepository.save(user);
        userRepository.save(userToUnfollow);
        return FollowUserResponse.builder()
                .currentStatus(FollowStatus.NOT_FOLLOWED)
                .message("User unfollowed successfully.")
                .status(HttpStatus.ACCEPTED)
                .build();
    }

    public void allowFollowRequestByNotificationId(String notificationId, User userToFollow) {
        if (!ObjectId.isValid(notificationId)) {
            throw new ValidationException("Invalid Id Exception");
        }
        Notification notification =
                notificationRepository
                        .findById(new ObjectId(notificationId))
                        .orElseThrow(() -> new EntityNotFoundException("request not found"));
        User user =
                userRepository
                        .findById(new ObjectId(notification.getUserId()))
                        .orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
        if (!userToFollow.getFollowRequestReceivedUserIds().contains(user.getId().toHexString())) {
            throw new ValidationException("request not found");
        }
        userToFollow.getFollowRequestReceivedUserIds().remove(user.getId().toHexString());
        user.getFollowRequestSentUserIds().remove(userToFollow.getId().toHexString());
        notificationRepository.delete(notification);

        userToFollow.getFollowerUserIds().add(user.getId().toHexString());
        user.getFollowingUserIds().add(userToFollow.getId().toHexString());

        notificationService.makeFollowReqAcceptedNotificationAndSend(user, userToFollow);
        userRepository.save(userToFollow);
        userRepository.save(user);
    }

    public void denyFollowRequestByNotificationId(String notificationId, User userToFollow) {
        if (!ObjectId.isValid(notificationId)) {
            throw new ValidationException("Invalid Id Exception");
        }
        Notification notification =
                notificationRepository
                        .findById(new ObjectId(notificationId))
                        .orElseThrow(() -> new EntityNotFoundException("request not found"));
        User user =
                userRepository
                        .findById(new ObjectId(notification.getUserId()))
                        .orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
        if (!userToFollow.getFollowRequestReceivedUserIds().contains(user.getId().toHexString())) {
            throw new ValidationException("request not found");
        }
        userToFollow.getFollowRequestReceivedUserIds().remove(user.getId().toHexString());
        user.getFollowRequestSentUserIds().remove(user.getId().toHexString());
        notificationRepository.delete(notification);

        userRepository.save(userToFollow);
        userRepository.save(user);
    }

    public void allowFollowRequestByUserId(String userId, User userToFollow) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid Id Exception");
        }
        User user =
                userRepository
                        .findById(new ObjectId(userId))
                        .orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
        if (!userToFollow.getFollowRequestReceivedUserIds().contains(user.getId().toHexString())) {
            throw new ValidationException("request not found");
        }
        userToFollow.getFollowRequestReceivedUserIds().remove(user.getId().toHexString());
        user.getFollowRequestSentUserIds().remove(userToFollow.getId().toHexString());
        notificationRepository.deleteByNotificationUserIdAndUserIdAndType(
                userToFollow.getId().toHexString(), userId, NotificationType.FOLLOW_REQUEST);

        userToFollow.getFollowerUserIds().add(user.getId().toHexString());
        user.getFollowingUserIds().add(userToFollow.getId().toHexString());

        notificationService.makeFollowReqAcceptedNotificationAndSend(user, userToFollow);
        userRepository.save(userToFollow);
        userRepository.save(user);
    }

    public void denyFollowRequestByUserId(String userId, User userToFollow) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid Id Exception");
        }
        User user =
                userRepository
                        .findById(new ObjectId(userId))
                        .orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
        if (!userToFollow.getFollowRequestReceivedUserIds().contains(user.getId().toHexString())) {
            throw new ValidationException("request not found");
        }
        userToFollow.getFollowRequestReceivedUserIds().remove(user.getId().toHexString());
        user.getFollowRequestSentUserIds().remove(userToFollow.getId().toHexString());
        notificationRepository.deleteByNotificationUserIdAndUserIdAndType(
                userToFollow.getId().toHexString(), userId, NotificationType.FOLLOW_REQUEST);

        userRepository.save(userToFollow);
        userRepository.save(user);
    }

    public void cancelFollowRequest(String sentRequestUserId, User user) {
        if (!ObjectId.isValid(sentRequestUserId)) {
            throw new ValidationException("Invalid Id Exception");
        }
        User userToFollow =
                userRepository
                        .findById(new ObjectId(sentRequestUserId))
                        .orElseThrow(() -> new EntityNotFoundException("User Not Found!"));

        if (!userToFollow.getFollowRequestReceivedUserIds().contains(user.getId().toHexString())) {
            throw new ValidationException("request not found");
        }
        userToFollow.getFollowRequestReceivedUserIds().remove(user.getId().toHexString());
        user.getFollowRequestSentUserIds().remove(userToFollow.getId().toHexString());
        notificationRepository.deleteByNotificationUserIdAndUserIdAndType(
                userToFollow.getId().toHexString(),
                user.getId().toHexString(),
                NotificationType.FOLLOW_REQUEST);

        userRepository.save(userToFollow);
        userRepository.save(user);
    }

    public List<ConnectionRequestResponse> getSentFollowRequestsList(
            User user, Integer page, Integer size) {
        return userRepository
                .findByIdIn(
                        user.getFollowRequestSentUserIds().stream()
                                .map(ObjectId::new)
                                .collect(Collectors.toSet()),
                        PageRequest.of(page, size))
                .get()
                .map(
                        (u) ->
                                ConnectionRequestResponse.builder()
                                        .id(u.getId().toHexString())
                                        .username(u.getUsername())
                                        .fullname(u.getFullname())
                                        .profilePictureUrl(u.getProfileImageUrl())
                                        .build())
                .collect(Collectors.toList());
    }

    public List<ConnectionRequestResponse> getReceivedFollowRequestsList(
            User user, Integer page, Integer size) {
        return userRepository
                .findByIdIn(
                        user.getFollowRequestReceivedUserIds().stream()
                                .map(ObjectId::new)
                                .collect(Collectors.toSet()),
                        PageRequest.of(page, size))
                .get()
                .map(
                        (u) ->
                                ConnectionRequestResponse.builder()
                                        .id(u.getId().toHexString())
                                        .username(u.getUsername())
                                        .fullname(u.getFullname())
                                        .profilePictureUrl(u.getProfileImageUrl())
                                        .build())
                .collect(Collectors.toList());
    }

    public List<UserCardResponse> getFollowersList(User user, Integer page, Integer size) {
        return userRepository
                .findByIdIn(
                        user.getFollowerUserIds().stream()
                                .map(ObjectId::new)
                                .collect(Collectors.toSet()),
                        PageRequest.of(page, size))
                .get()
                .map(
                        (u) ->
                                UserCardResponse.builder()
                                        .id(u.getId().toHexString())
                                        .username(u.getUsername())
                                        .fullname(u.getFullname())
                                        .profilePictureUrl(u.getProfileImageUrl())
                                        .build())
                .collect(Collectors.toList());
    }

    public List<UserCardResponse> getFollowingsList(User user, Integer page, Integer size) {
        return userRepository
                .findByIdIn(
                        user.getFollowingUserIds().stream()
                                .map(ObjectId::new)
                                .collect(Collectors.toSet()),
                        PageRequest.of(page, size))
                .get()
                .map(
                        (u) ->
                                UserCardResponse.builder()
                                        .id(u.getId().toHexString())
                                        .username(u.getUsername())
                                        .fullname(u.getFullname())
                                        .profilePictureUrl(u.getProfileImageUrl())
                                        .build())
                .collect(Collectors.toList());
    }

    public List<UserCardResponse> getSuggestedUsers(User user) {
        List<User> allFollowers =
                userRepository.findAllById(
                        user.getFollowingUserIds().stream()
                                .map(ObjectId::new)
                                .collect(Collectors.toSet()));
        Set<String> allSecondDegreeConnection =
                allFollowers.stream()
                        .flatMap(followingUser -> followingUser.getFollowingUserIds().stream())
                        .filter(followingId -> !user.getFollowingUserIds().contains(followingId))
                        .filter(followingId -> !followingId.equals(user.getId().toHexString()))
                        .collect(Collectors.toSet());
        List<UserCardResponse> userCardResponses =
                userRepository
                        .findRandomUsers(
                                allSecondDegreeConnection.stream()
                                        .map(ObjectId::new)
                                        .collect(Collectors.toSet()),
                                6)
                        .stream()
                        .map(
                                (u) ->
                                        UserCardResponse.builder()
                                                .id(u.getId().toHexString())
                                                .username(u.getUsername())
                                                .fullname(u.getFullname())
                                                .profilePictureUrl(u.getProfileImageUrl())
                                                .build())
                        .collect(Collectors.toList());
        if (userCardResponses.size() < 6) {
            int remainingSlots = 6 - userCardResponses.size();

            Set<ObjectId> excludedIds = new HashSet<>();
            excludedIds.add(user.getId());
            excludedIds.addAll(
                    user.getFollowingUserIds().stream()
                            .map(ObjectId::new)
                            .collect(Collectors.toSet()));
            excludedIds.addAll(
                    userCardResponses.stream()
                            .map(UserCardResponse::getId)
                            .map(ObjectId::new)
                            .collect(Collectors.toSet()));

            List<UserCardResponse> additionalUsers =
                    userRepository
                            .findRandomUsersExceptSomeIds(remainingSlots, excludedIds)
                            .stream()
                            .map(
                                    u ->
                                            new UserCardResponse(
                                                    u.getId().toHexString(),
                                                    u.getUsername(),
                                                    u.getFullname(),
                                                    u.getProfileImageUrl(),
                                                    u.getBanUntil()))
                            .toList();
            userCardResponses.addAll(additionalUsers);
        }
        return userCardResponses;
    }

    public SettingsResponse getUserSettings(User user) {
        return SettingsResponse.builder()
                .twoFactorAuthentication(user.getTwoFactorAuthentication())
                .profileType(user.getProfileType())
                .followRequestBehaviourAuto(user.getFollowRequestBehaviourAuto())
                .isAllowedNetworkPostNotification(user.getIsAllowedNetworkPostNotification())
                .isAllowedNetworkReelNotification(user.getIsAllowedNetworkReelNotification())
                .isAllowedNetworkStoryNotification(user.getIsAllowedNetworkStoryNotification())
                .isAllowedPostsLikeNotification(user.getIsAllowedPostsLikeNotification())
                .isAllowedReelsLikeNotification(user.getIsAllowedReelsLikeNotification())
                .isAllowedStorysLikeNotification(user.getIsAllowedStorysLikeNotification())
                .isAllowedCommentsLikeNotification(user.getIsAllowedCommentsLikeNotification())
                .isAllowedPostsCommentNotification(user.getIsAllowedPostsCommentNotification())
                .isAllowedReelsCommentNotification(user.getIsAllowedReelsCommentNotification())
                .isAllowedUsersFollowNotification(user.getIsAllowedUsersFollowNotification())
                .isAllowedUsersFollowRequestNotification(
                        user.getIsAllowedUsersFollowRequestNotification())
                .build();
    }

    public void saveUserSettings(SettingsRequest settingsRequest, User user) {
        user.setTwoFactorAuthentication(settingsRequest.getTwoFactorAuthentication());
        user.setProfileType(settingsRequest.getProfileType());
        user.setFollowRequestBehaviourAuto(settingsRequest.getFollowRequestBehaviourAuto());
        user.setIsAllowedNetworkPostNotification(
                settingsRequest.getIsAllowedNetworkPostNotification());
        user.setIsAllowedNetworkReelNotification(
                settingsRequest.getIsAllowedNetworkReelNotification());
        user.setIsAllowedNetworkStoryNotification(
                settingsRequest.getIsAllowedNetworkStoryNotification());
        user.setIsAllowedPostsLikeNotification(settingsRequest.getIsAllowedPostsLikeNotification());
        user.setIsAllowedReelsLikeNotification(settingsRequest.getIsAllowedReelsLikeNotification());
        user.setIsAllowedStorysLikeNotification(
                settingsRequest.getIsAllowedStorysLikeNotification());
        user.setIsAllowedCommentsLikeNotification(
                settingsRequest.getIsAllowedCommentsLikeNotification());
        user.setIsAllowedPostsCommentNotification(
                settingsRequest.getIsAllowedPostsCommentNotification());
        user.setIsAllowedReelsCommentNotification(
                settingsRequest.getIsAllowedReelsCommentNotification());
        user.setIsAllowedUsersFollowNotification(
                settingsRequest.getIsAllowedUsersFollowNotification());
        user.setIsAllowedUsersFollowRequestNotification(
                settingsRequest.getIsAllowedUsersFollowRequestNotification());
        userRepository.save(user);
    }

    public void changeUsername(String username, User user) {
        if (userRepository.findByUsernameAndIsActiveTrue(username).isPresent()) {
            throw new ActionNotAllowedException("Username already exists.");
        }
        user.setUsername(username);
        userRepository.save(user);
    }

    public List<ModeratorUserCardResponse> getModerators() {
        return userRepository.findByRole(Role.MODERATOR).stream()
                .map(
                        user ->
                                (ModeratorUserCardResponse.builder()
                                        .id(user.getId().toHexString())
                                        .username(user.getUsername())
                                        .email(user.getEmail())
                                        .createdAt(user.getCreatedAt())
                                        .build()))
                .collect(Collectors.toList());
    }

    public void makeModeratorAccount(String email, String username, String password) {
        if (userRepository.findByEmailAndIsActiveTrue(email).isPresent()) {
            throw new ActionNotAllowedException("email already exists.");
        }
        if (userRepository.findByUsernameAndIsActiveTrue(username).isPresent()) {
            throw new ActionNotAllowedException("username already exists.");
        }
        log.info("Creating moderator account for email: {}", email);
        User user =
                userRepository.save(
                        User.builder()
                                .email(email)
                                .password(passwordEncoder.encode(password))
                                .username(username)
                                .role(Role.MODERATOR)
                                .isActive(true)
                                .gender(Gender.PREFER_NOT_TO_SAY)
                                .isAllowedNetworkPostNotification(false)
                                .isAllowedNetworkReelNotification(false)
                                .isAllowedNetworkStoryNotification(false)
                                .isAllowedPostsLikeNotification(false)
                                .isAllowedReelsLikeNotification(false)
                                .isAllowedStorysLikeNotification(false)
                                .isAllowedCommentsLikeNotification(false)
                                .isAllowedPostsCommentNotification(false)
                                .isAllowedReelsCommentNotification(false)
                                .isAllowedUsersFollowNotification(false)
                                .isAllowedUsersFollowRequestNotification(false)
                                .profileType(ProfileType.PRIVATE)
                                .build());
        userRepository.save(user);
    }

    public void banUser(String userId, Date banToDate) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid userId");
        }
        User user =
                userRepository
                        .findUserById(new ObjectId(userId))
                        .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        user.setBanUntil(banToDate);
        userRepository.save(user);
    }

    public void unbanUser(String userId) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid userId");
        }
        User user =
                userRepository
                        .findUserById(new ObjectId(userId))
                        .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        user.setBanUntil(Date.from(Instant.now().minus(1, ChronoUnit.DAYS)));
        userRepository.save(user);
    }

    public void deleteModeratorAccount(String userId) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid userId");
        }
        User user =
                userRepository
                        .findById(new ObjectId(userId))
                        .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        if (user.getRole().equals(Role.MODERATOR)) {
            userRepository.delete(user);
        } else {
            throw new ActionNotAllowedException("User is not a moderator.");
        }
    }

    public void deleteUserAccount(String userId) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid userId");
        }
        User user =
                userRepository
                        .findById(new ObjectId(userId))
                        .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        if (user.getRole().equals(Role.USER)) {
            userRepository.delete(user);
            userActivityRepository.findByUserId(userId).ifPresent(userActivityRepository::delete);
            otpRepository.findByEmail(user.getEmail()).ifPresent(otpRepository::delete);
            notificationRepository.deleteByNotificationUserId(userId);
            postRepository.deleteByUserId(userId);
            reelRepository.deleteByUserId(userId);
            storyRepository.deleteByUserId(userId);
        } else {
            throw new ActionNotAllowedException("this action is not allowed.");
        }
        log.info("Deleting account for userId: {}", userId);
    }

    public void deleteAccount(User user) {
        if (user.getRole().equals(Role.USER)) {
            userRepository.delete(user);
            userActivityRepository
                    .findByUserId(user.getId().toHexString())
                    .ifPresent(userActivityRepository::delete);
            otpRepository.findByEmail(user.getEmail()).ifPresent(otpRepository::delete);
            notificationRepository.deleteByNotificationUserId(user.getId().toHexString());
            postRepository.deleteByUserId(user.getId().toHexString());
            reelRepository.deleteByUserId(user.getId().toHexString());
            storyRepository.deleteByUserId(user.getId().toHexString());
        } else {
            throw new ActionNotAllowedException("this action is not allowed.");
        }
        log.info("Deleting account for user: {}", user.getUsername());
    }
}
