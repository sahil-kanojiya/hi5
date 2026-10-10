package com.app.hi5.model;

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
@Document(collection = "message")
public class Message {

    @Id private ObjectId id;

    @Field("chat")
    private String chatId;

    @Field("image_url")
    private String imageUrl;

    @Field("video_url")
    private String videoUrl;

    @Field("message")
    private String message;

    @Field("sender_user")
    private String senderUserId;

    @Field("receiver_user")
    private String receiverUserId;

    @CreatedDate
    @Field("created_at")
    private Date createdAt;

    @Field("is_deleted_by_created_user")
    @Builder.Default
    private Boolean isDeletedBySender = false;

    @Field("is_deleted_by_receiver_user")
    @Builder.Default
    private Boolean isDeletedByReceiver = false;
}
