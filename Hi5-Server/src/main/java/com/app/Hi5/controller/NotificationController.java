package com.app.Hi5.controller;

import com.app.Hi5.dto.response.NotificationResponse;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
@RequestMapping("/api/notification")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getComments(
            @RequestParam("page") Integer page,
            @RequestParam("size") Integer size,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<NotificationResponse> list =
                notificationService.getNotificationList(page, size, userDetails.getUser());
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAll(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        notificationService.deleteAllNotifications(userDetails.getUser().getId().toHexString());
        return new ResponseEntity<>("deleted all notifications", HttpStatus.ACCEPTED);
    }
}
