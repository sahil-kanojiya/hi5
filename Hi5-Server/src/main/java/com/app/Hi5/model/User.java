package com.app.Hi5.model;

import com.app.Hi5.model.Enum.Gender;
import com.app.Hi5.model.Enum.IdentityProvider;
import com.app.Hi5.model.Enum.ProfileType;
import com.app.Hi5.model.Enum.Role;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "user")
public class User {

    //  Primary Details
    @Id private ObjectId id;

    @Field("email")
    @Indexed(unique = true)
    private String email;

    @Field("password")
    private String password;

    @Field("username")
    @Indexed(unique = true)
    @Builder.Default
    private String username = "";

    @Field("identity_provider")
    @Builder.Default
    private IdentityProvider identityProvider = IdentityProvider.SELF;

    @Field("created_at")
    @CreatedDate
    private Date createdAt;

    //  Access Grant (Role)
    @Field("role")
    @Builder.Default
    private Role role = Role.USER;

    @Field("banned_until")
    @Builder.Default
    private Date banUntil = Date.from(Instant.now().minus(1, ChronoUnit.DAYS));

    @Field("active")
    @Builder.Default
    private Boolean isActive = false;

    //  User Details
    @Field("full_name")
    @Builder.Default
    private String fullname = "";

    @Field("bio")
    @Builder.Default
    private String bio = "";

    @Field("link")
    @Builder.Default
    private String link = "";

    @Field("date_of_birth")
    @Builder.Default
    private Date dateOfBirth = new Date();

    @Field("gender")
    @Builder.Default
    private Gender gender = Gender.PREFER_NOT_TO_SAY;

    @Field("profile_image_url")
    @Builder.Default
    private String profileImageUrl = "/resource/user/profileImage/default.png";

    @Field("cover_image_url")
    @Builder.Default
    private String coverImageUrl = "/resource/user/coverImage/default.png";

    //  Settings
    @Builder.Default
    @Field("two_factor_authentication")
    private Boolean twoFactorAuthentication = false;

    @Builder.Default
    @Field("profile_type")
    private ProfileType profileType = ProfileType.PUBLIC;

    @Builder.Default
    @Field("follow_request_behaviour_auto")
    private Boolean followRequestBehaviourAuto = false;

    @Builder.Default
    @Field("is_allowed_network_post_notification")
    private Boolean isAllowedNetworkPostNotification = true;

    @Builder.Default
    @Field("is_allowed_network_reel_notification")
    private Boolean isAllowedNetworkReelNotification = true;

    @Builder.Default
    @Field("is_allowed_network_story_notification")
    private Boolean isAllowedNetworkStoryNotification = true;

    @Builder.Default
    @Field("is_allowed_posts_like_notification")
    private Boolean isAllowedPostsLikeNotification = true;

    @Builder.Default
    @Field("is_allowed_reels_like_notification")
    private Boolean isAllowedReelsLikeNotification = true;

    @Builder.Default
    @Field("is_allowed_storys_like_notification")
    private Boolean isAllowedStorysLikeNotification = true;

    @Builder.Default
    @Field("is_allowed_comments_like_notification")
    private Boolean isAllowedCommentsLikeNotification = true;

    @Builder.Default
    @Field("is_allowed_posts_comment_notification")
    private Boolean isAllowedPostsCommentNotification = true;

    @Builder.Default
    @Field("is_allowed_reels_comment_notification")
    private Boolean isAllowedReelsCommentNotification = true;

    @Builder.Default
    @Field("is_allowed_users_follow_notification")
    private Boolean isAllowedUsersFollowNotification = true;

    @Builder.Default
    @Field("is_allowed_users_follow_request_notification")
    private Boolean isAllowedUsersFollowRequestNotification = true;

    //    User Activity Data
    @Field("follow_requests_sent")
    @Builder.Default
    private Set<String> followRequestSentUserIds = new LinkedHashSet<>();

    @Field("follow_requests_received")
    @Builder.Default
    private Set<String> followRequestReceivedUserIds = new LinkedHashSet<>();

    @Field("followers")
    @Builder.Default
    private Set<String> followerUserIds = new LinkedHashSet<>();

    @Field("followings")
    @Builder.Default
    private Set<String> followingUserIds = new LinkedHashSet<>();

    @Field("posts")
    @Builder.Default
    private Set<String> userPostIds = new LinkedHashSet<>();

    @Field("reels")
    @Builder.Default
    private Set<String> userReelIds = new LinkedHashSet<>();

    @Field("saved_posts")
    @Builder.Default
    private Set<String> savedPostIds = new LinkedHashSet<>();

    @Field("saved_reels")
    @Builder.Default
    private Set<String> savedReelsIds = new LinkedHashSet<>();
}
