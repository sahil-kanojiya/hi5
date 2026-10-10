package com.app.hi5.dto.response;

import com.app.hi5.model.enums.ProfileType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettingsResponse {

    @JsonProperty("twoFactorAuthentication")
    private Boolean twoFactorAuthentication;

    @JsonProperty("profileType")
    private ProfileType profileType;

    @JsonProperty("followRequestBehaviourAuto")
    private Boolean followRequestBehaviourAuto;

    @JsonProperty("isAllowedNetworkPostNotification")
    private Boolean isAllowedNetworkPostNotification;

    @JsonProperty("isAllowedNetworkReelNotification")
    private Boolean isAllowedNetworkReelNotification;

    @JsonProperty("isAllowedNetworkStoryNotification")
    private Boolean isAllowedNetworkStoryNotification;

    @JsonProperty("isAllowedPostsLikeNotification")
    private Boolean isAllowedPostsLikeNotification;

    @JsonProperty("isAllowedReelsLikeNotification")
    private Boolean isAllowedReelsLikeNotification;

    @JsonProperty("isAllowedStorysLikeNotification")
    private Boolean isAllowedStorysLikeNotification;

    @JsonProperty("isAllowedCommentsLikeNotification")
    private Boolean isAllowedCommentsLikeNotification;

    @JsonProperty("isAllowedPostsCommentNotification")
    private Boolean isAllowedPostsCommentNotification;

    @JsonProperty("isAllowedReelsCommentNotification")
    private Boolean isAllowedReelsCommentNotification;

    @JsonProperty("isAllowedUsersFollowNotification")
    private Boolean isAllowedUsersFollowNotification;

    @JsonProperty("isAllowedUsersFollowRequestNotification")
    private Boolean isAllowedUsersFollowRequestNotification;
}
