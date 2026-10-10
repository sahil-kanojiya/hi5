package com.app.Hi5.controller;

import com.app.Hi5.dto.response.LikedUserCardResponse;
import com.app.Hi5.dto.response.PostResponse;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.PostService;
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
@RequestMapping("/api/post")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<String> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "video", required = false) MultipartFile videoFile,
            @RequestParam("isPrivate") Boolean isPrivate,
            @RequestParam("isCommentsDisabled") Boolean isCommentsDisabled,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String body =
                postService.makePost(
                        userDetails.getUser(),
                        content,
                        imageFile,
                        videoFile,
                        isPrivate,
                        isCommentsDisabled);
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @DeleteMapping("/{post_id}")
    public ResponseEntity<String> deletePost(
            @PathVariable("post_id") String postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        postService.deletePost(userDetails.getUser(), postId);
        return new ResponseEntity<>("post deleted successfully!", HttpStatus.OK);
    }

    @GetMapping
    public List<PostResponse> getAllRandomPosts(
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findRandomPosts(userDetails.getUser(), size);
    }

    @GetMapping("/following")
    public List<PostResponse> getAllFollowigsPosts(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findFollowigsPosts(userDetails.getUser(), size, page);
    }

    @GetMapping("/shared")
    public PostResponse getSharedPost(
            @RequestParam("postId") String postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findPost(postId, userDetails.getUser());
    }

    @GetMapping("/user/{userId}")
    public List<PostResponse> getUserPosts(
            @PathVariable("userId") String userId,
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findUserPosts(userId, size, page, userDetails.getUser());
    }

    @GetMapping("/saved")
    public List<PostResponse> getUserPosts(
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findUserSavedPosts(size, page, userDetails.getUser());
    }

    @GetMapping("/user/like/{postId}")
    public List<LikedUserCardResponse> getLikedUsers(
            @PathVariable("postId") String postId,
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findLikedUsers(postId, size, page, userDetails.getUser());
    }
}
