package com.app.Hi5.model;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;
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
@Document(collection = "story")
public class Story {

    @Id private ObjectId id;

    @Field("user")
    private String userId;

    @Field("image_url")
    private String imageUrl;

    @Field("video_url")
    private String videoUrl;

    @CreatedDate
    @Field("created_at")
    private Date createdAt;

    @Field("likes")
    @Builder.Default
    private Set<String> likedUserIds = new LinkedHashSet<>();

    @Field("watched_users")
    @Builder.Default
    private Set<String> watchedUserIds = new LinkedHashSet<>();
}
