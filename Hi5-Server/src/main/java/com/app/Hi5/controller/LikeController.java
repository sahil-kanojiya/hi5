package com.app.Hi5.controller;

import com.app.Hi5.dto.request.LikeRequest;
import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
