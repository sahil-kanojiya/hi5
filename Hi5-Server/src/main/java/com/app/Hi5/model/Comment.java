package com.app.Hi5.model;

import com.app.Hi5.model.Enum.CommentType;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "comment")
public class Comment {

    @Id private ObjectId id;

    @Field("relevant")
    private String relevantId;

    @Field("type")
    private CommentType type;

    @Field("user")
    private String userId;

    @Field("content")
    private String content;

    @CreatedDate
    @Field("created_at")
    private Date createdAt;

    @Field("likes")
    @Builder.Default
    private Set<String> likedUserIds = new LinkedHashSet<>();

    @Field("reports")
    @Builder.Default
    private Set<String> reportedUsersIds = new LinkedHashSet<>();
}
