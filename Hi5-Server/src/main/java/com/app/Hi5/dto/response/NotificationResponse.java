package com.app.Hi5.dto.response;

import com.app.Hi5.model.Enum.NotificationType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private String id;

    private String notificationUserId;

    private String userId;

    private NotificationType type;

    private String relevantId;

    private Date createdAt;

    private String username;

    private String fullname;

    private String profilePictureUrl;
}
