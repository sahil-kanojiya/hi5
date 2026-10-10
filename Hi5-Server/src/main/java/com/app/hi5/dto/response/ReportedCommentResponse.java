package com.app.hi5.dto.response;

import com.app.hi5.model.enums.CommentType;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportedCommentResponse {

    private String id;
    private String commentId;
    private String relevantId;
    private CommentType type;
    private String userId;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private Date banUntil;
    private String content;
    private Date createdAt;
    private Integer likesCount;
    private CommentTypePostResponse postResponse;
    private CommentTypeReelResponse reelResponse;
    private Long totalReportsCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentTypePostResponse {
        private String id;
        private String postId;
        private String userId;
        private String content;
        private String imageUrl;
        private String videoUrl;
        private Date createdAt;
        private Integer likesCount;
        private Integer commentsCount;

        @JsonProperty("isPrivate")
        private Boolean isPrivate;

        @JsonProperty("isCommentsDisabled")
        private Boolean isCommentsDisabled;

        private String username;
        private String fullname;
        private String profilePictureUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentTypeReelResponse {
        private String id;
        private String reelId;
        private String userId;
        private String description;
        private String videoUrl;
        private Date createdAt;
        private Integer likesCount;
        private Integer commentsCount;

        @JsonProperty("isPrivate")
        private Boolean isPrivate;

        @JsonProperty("isCommentsDisabled")
        private Boolean isCommentsDisabled;

        private String username;
        private String fullname;
        private String profilePictureUrl;
    }
}
