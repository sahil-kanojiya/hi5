package com.app.Hi5.controller;

import com.app.Hi5.dto.request.*;
import com.app.Hi5.dto.response.*;
import com.app.Hi5.model.User;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/user")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/get-me")
    public ResponseEntity<GetMeResponse> getMe(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info(
                "Received request to get user details for username: {}", userDetails.getUsername());
        User user = userDetails.getUser();
        log.info("User details fetched successfully for username: {}", user.getUsername());
        return GetMeResponse.builder()
                .id(user.getId().toHexString())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .fullname(user.getFullname())
                .profilePictureUrl(user.getProfileImageUrl())
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .build()
                .toResponseEntity();
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<UserSearchResponse>> getUsersByPrefix(
            @PathVariable("keyword") String keyword,
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserSearchResponse> responses =
                userService.getUsersByKeyword(keyword, page, size, userDetails.getUser());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable("userId") String userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserProfileResponse response = userService.getProfile(userId, userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/update-images")
    public ResponseEntity<UpdateImagesResponse> updateUserImages(
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "coverPicture", required = false) MultipartFile coverPicture,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        UpdateImagesResponse response =
                userService.updateUserImages(userDetails.getUser(), profilePicture, coverPicture);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<String> updateUser(
            @RequestBody @Valid UpdateUserRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.updateUser(
                userDetails.getUser(),
                request.getFullname(),
                request.getBio(),
                request.getLink(),
                request.getDateOfBirth(),
                request.getGender());
        return new ResponseEntity<>("User Updated Successfully.", HttpStatus.OK);
    }

    @PostMapping("/follow/{user_id}")
    public ResponseEntity<FollowUserResponse> followUser(
            @PathVariable("user_id") String userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        FollowUserResponse response = userService.follow(userDetails.getUser(), userId);
        return response.toResponseEntity();
    }

    @PostMapping("/unfollow/{user_id}")
    public ResponseEntity<FollowUserResponse> unfollowUser(
            @PathVariable("user_id") String userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        FollowUserResponse response = userService.unfollow(userDetails.getUser(), userId);
        return response.toResponseEntity();
    }

    @PostMapping("/follow/allow")
    public ResponseEntity<String> allowFollowRequest(
            @RequestBody FollowRequestActionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (request.getNotificationId() != null) {
            userService.allowFollowRequestByNotificationId(
                    request.getNotificationId(), userDetails.getUser());
        } else if (request.getUserId() != null) {
            userService.allowFollowRequestByUserId(request.getUserId(), userDetails.getUser());
        } else {
            return ResponseEntity.badRequest()
                    .body("Either notificationId or userId must be provided");
        }
        return ResponseEntity.ok("Follow request allowed");
    }

    @PostMapping("/follow/deny")
    public ResponseEntity<String> denyFollowRequest(
            @RequestBody FollowRequestActionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (request.getNotificationId() != null) {
            userService.denyFollowRequestByNotificationId(
                    request.getNotificationId(), userDetails.getUser());
        } else if (request.getUserId() != null) {
            userService.denyFollowRequestByUserId(request.getUserId(), userDetails.getUser());
        } else {
            return ResponseEntity.badRequest()
                    .body("Either notificationId or userId must be provided");
        }
        return ResponseEntity.ok("Follow request denied");
    }

    @DeleteMapping("/follow/cancel/{userId}")
    public ResponseEntity<String> cancelFollowRequest(
            @PathVariable String userId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.cancelFollowRequest(userId, userDetails.getUser());
        return ResponseEntity.ok("Follow request canceled");
    }

    @GetMapping("/follow/sent/requests")
    public ResponseEntity<List<ConnectionRequestResponse>> getSentFollowRequests(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ConnectionRequestResponse> responseList =
                userService.getSentFollowRequestsList(userDetails.getUser(), page, size);
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/follow/received/requests")
    public ResponseEntity<List<ConnectionRequestResponse>> getReceivedFollowRequests(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ConnectionRequestResponse> responseList =
                userService.getReceivedFollowRequestsList(userDetails.getUser(), page, size);
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/followers")
    public ResponseEntity<List<UserCardResponse>> getFollowers(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserCardResponse> responseList =
                userService.getFollowersList(userDetails.getUser(), page, size);
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/followings")
    public ResponseEntity<List<UserCardResponse>> getFollowings(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserCardResponse> responseList =
                userService.getFollowingsList(userDetails.getUser(), page, size);
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<UserCardResponse>> suggestUsers(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserCardResponse> responseList = userService.getSuggestedUsers(userDetails.getUser());
        System.out.println("responseList = " + responseList);
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @GetMapping("/settings")
    public ResponseEntity<SettingsResponse> getSettings(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        SettingsResponse response = userService.getUserSettings(userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/settings")
    public ResponseEntity<String> changeSettings(
            @RequestBody SettingsRequest settingsRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.saveUserSettings(settingsRequest, userDetails.getUser());
        return new ResponseEntity<>("Settings Changed.", HttpStatus.OK);
    }

    @PostMapping("/change-username")
    public ResponseEntity<String> checkUsername(
            @RequestBody @Valid ChangeUsernameRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.changeUsername(request.getUsername(), userDetails.getUser());
        return new ResponseEntity<>("Username changed successfully.", HttpStatus.OK);
    }

    @DeleteMapping("/myaccount")
    public ResponseEntity<String> deleteAccount(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.deleteAccount(userDetails.getUser());
        return new ResponseEntity<>("Account Deleted", HttpStatus.OK);
    }
}
