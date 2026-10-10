package com.app.hi5.dto.response;

import com.app.hi5.dto.enums.FollowStatus;
import com.app.hi5.dto.enums.LikeStatus;
import com.app.hi5.dto.enums.ReportStatus;
import com.app.hi5.dto.enums.SaveStatus;
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
public class ReelResponse {

    private String id;

    private String description;
    private String videoUrl;
    private Date createdAt;

    @JsonProperty("likeStatus")
    private LikeStatus likeStatus;

    private Integer likesCount;

    private Integer commentsCount;

    @JsonProperty("reportStatus")
    private ReportStatus reportStatus;

    @JsonProperty("saveStatus")
    private SaveStatus saveStatus;

    @JsonProperty("followStatus")
    private FollowStatus followStatus;

    @JsonProperty("isPrivate")
    private Boolean isPrivate;

    @JsonProperty("isCommentsDisabled")
    private Boolean isCommentsDisabled;

    private String userId;
    private String username;
    private String fullname;
    private String profilePictureUrl;
}
