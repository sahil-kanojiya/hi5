package com.app.hi5.dto.response;

import com.app.hi5.dto.enums.LikeStatus;
import com.app.hi5.dto.enums.ReportStatus;
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
public class CommentResponse {

    private String id;

    private String relevantId;

    private CommentType type;

    private String userId;

    private String username;

    private String fullname;

    private String profilePictureUrl;

    private String content;

    private Date createdAt;

    private Integer likesCount;

    @JsonProperty("likeStatus")
    private LikeStatus likeStatus;

    @JsonProperty("reportStatus")
    private ReportStatus reportStatus;
}
