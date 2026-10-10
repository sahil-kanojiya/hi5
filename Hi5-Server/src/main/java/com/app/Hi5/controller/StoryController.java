package com.app.Hi5.controller;

import com.app.Hi5.dto.response.LikedUserCardResponse;
import com.app.Hi5.dto.response.MyStoryResponse;
import com.app.Hi5.dto.response.NewStoryUserResponse;
import com.app.Hi5.dto.response.StoryResponse;
import com.app.Hi5.dto.response.ViewedUserCardResponse;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.StoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/story")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @PostMapping
    public ResponseEntity<String> createStory(
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "video", required = false) MultipartFile videoFile,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String body = storyService.makeStory(userDetails.getUser(), imageFile, videoFile);
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @DeleteMapping("/{story_id}")
    public ResponseEntity<String> deleteStory(
            @PathVariable("story_id") String storyId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        storyService.deleteStory(userDetails.getUser(), storyId);
        return new ResponseEntity<>("story deleted successfully!", HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<List<MyStoryResponse>> getMyActiveStorys(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<MyStoryResponse> response = storyService.getMyActiveStorys(userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<NewStoryUserResponse>> getNewStoryUsers(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<NewStoryUserResponse> response = storyService.getNewStoryUsers(userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/{index}")
    public ResponseEntity<StoryResponse> getMyFolloingsActiveStorys(
            @PathVariable("userId") String userId,
            @PathVariable("index") Integer index,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        StoryResponse response =
                storyService.getMyFollowingsActiveStories(userId, index, userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/like/{storyId}")
    public List<LikedUserCardResponse> getLikedUsers(
            @PathVariable("storyId") String storyId,
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return storyService.findLikedUsers(storyId, size, page, userDetails.getUser());
    }

    @GetMapping("/user/views/{storyId}")
    public List<ViewedUserCardResponse> getViewers(
            @PathVariable("storyId") String storyId,
            @RequestParam("size") Integer size,
            @RequestParam("page") Integer page,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return storyService.findViewedUsers(storyId, size, page, userDetails.getUser());
    }
}
