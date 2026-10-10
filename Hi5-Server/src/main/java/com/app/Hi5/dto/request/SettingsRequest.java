package com.app.Hi5.dto.request;

import com.app.Hi5.model.Enum.ProfileType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingsRequest {

    @NotNull(message = "Two-factor authentication setting is required")
    private Boolean twoFactorAuthentication;

    @NotNull(message = "Profile type is required")
    private ProfileType profileType;

    @NotNull(message = "Follow request behavior setting is required")
    private Boolean followRequestBehaviourAuto;

    @NotNull(message = "Network post notification setting is required")
    private Boolean isAllowedNetworkPostNotification;

    @NotNull(message = "Network reel notification setting is required")
    private Boolean isAllowedNetworkReelNotification;

    @NotNull(message = "Network story notification setting is required")
    private Boolean isAllowedNetworkStoryNotification;

    @NotNull(message = "Post like notification setting is required")
    private Boolean isAllowedPostsLikeNotification;

    @NotNull(message = "Reels like notification setting is required")
    private Boolean isAllowedReelsLikeNotification;

    @NotNull(message = "Story like notification setting is required")
    private Boolean isAllowedStorysLikeNotification;

    @NotNull(message = "Comment like notification setting is required")
    private Boolean isAllowedCommentsLikeNotification;

    @NotNull(message = "Post comment notification setting is required")
    private Boolean isAllowedPostsCommentNotification;

    @NotNull(message = "Reels comment notification setting is required")
    private Boolean isAllowedReelsCommentNotification;

    @NotNull(message = "User follow notification setting is required")
    private Boolean isAllowedUsersFollowNotification;

    @NotNull(message = "User follow request notification setting is required")
    private Boolean isAllowedUsersFollowRequestNotification;
}
