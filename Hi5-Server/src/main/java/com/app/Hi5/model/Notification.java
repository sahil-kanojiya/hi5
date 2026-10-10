package com.app.Hi5.model;

import com.app.Hi5.model.Enum.NotificationType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notification")
public class Notification {

    @Id private ObjectId id;

    @Field("user")
    private String notificationUserId;

    @Field("user_id")
    private String userId;

    @Field("type")
    private NotificationType type;

    @Field("relevant")
    private String relevantId;

    @Field("created_at")
    @CreatedDate
    private Date createdAt;
}
