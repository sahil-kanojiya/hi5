package com.app.hi5.dto.payload;

import com.app.hi5.model.Notification;
import com.app.hi5.model.User;
import com.app.hi5.model.enums.NotificationType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPayload {

    private String id;

    private String notificationUserId;

    private String userId;

    private NotificationType type;

    private String relevantId;

    private Date createdAt;

    private String username;

    private String fullname;

    private String profilePictureUrl;

    public static NotificationPayload convertToPayload(Notification notification, User u) {
        return NotificationPayload.builder()
                .id(notification.getId().toHexString())
                .notificationUserId(notification.getNotificationUserId())
                .userId(notification.getUserId())
                .type(notification.getType())
                .relevantId(notification.getRelevantId())
                .createdAt(notification.getCreatedAt())
                .username(u.getUsername())
                .fullname(u.getFullname())
                .profilePictureUrl(u.getProfileImageUrl())
                .build();
    }
}
