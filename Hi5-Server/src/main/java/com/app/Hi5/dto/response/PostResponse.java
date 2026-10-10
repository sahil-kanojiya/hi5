package com.app.Hi5.dto.response;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.dto.enums.SaveStatus;
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
public class PostResponse {

    private String id;
    private String userId;
    private String content;
    private String imageUrl;
    private String videoUrl;
    private Date createdAt;
    private Integer likesCount;
    private Integer commentsCount;

    @JsonProperty("likeStatus")
    private LikeStatus likeStatus;

    @JsonProperty("reportStatus")
    private ReportStatus reportStatus;

    @JsonProperty("saveStatus")
    private SaveStatus saveStatus;

    @JsonProperty("isPrivate")
    private Boolean isPrivate;

    @JsonProperty("isCommentsDisabled")
    private Boolean isCommentsDisabled;

    private String username;
    private String fullname;
    private String profilePictureUrl;
}
