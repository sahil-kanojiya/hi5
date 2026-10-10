package com.app.hi5.model;

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
@Document(collection = "reel")
public class Reel {

    @Id private ObjectId id;

    @Field("user")
    private String userId;

    @Field("video_url")
    private String videoUrl;

    @Field("duration")
    private Long duration;

    @Field("description")
    private String description;

    @Field("is_private")
    @Builder.Default
    private Boolean isPrivate = false;

    @Field("is_comments_disabled")
    @Builder.Default
    private Boolean isCommentsDisabled = false;

    @CreatedDate
    @Field("created_at")
    private Date createdAt;

    @Field("likes")
    @Builder.Default
    private Set<String> likedUserIds = new LinkedHashSet<>();

    @Field("comments")
    @Builder.Default
    private Set<String> commentIds = new LinkedHashSet<>();

    @Field("reports")
    @Builder.Default
    private Set<String> reportedUsersIds = new LinkedHashSet<>();

    @Field("saved")
    @Builder.Default
    private Set<String> savedUserIds = new LinkedHashSet<>();
}
