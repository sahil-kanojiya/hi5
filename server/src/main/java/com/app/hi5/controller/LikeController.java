package com.app.hi5.controller;

import com.app.hi5.dto.request.LikeRequest;
import com.app.hi5.model.enums.LikeType;
import com.app.hi5.security.UserDetailsImpl;
import com.app.hi5.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/like")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<String> like(
            @RequestBody LikeRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        likeService.like(userDetails.getUser(), request.getRelevantId(), request.getType());
        return new ResponseEntity<>("saved successfully!", HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<String> unlike(
            @RequestParam("relevantId") String relevantId,
            @RequestParam("type") LikeType type,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        likeService.unlike(userDetails.getUser(), relevantId, type);
        return new ResponseEntity<>("unsaved successfully!", HttpStatus.OK);
    }
}
