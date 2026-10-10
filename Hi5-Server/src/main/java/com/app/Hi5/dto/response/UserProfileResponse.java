package com.app.Hi5.dto.response;

import com.app.Hi5.dto.enums.FollowStatus;
import com.app.Hi5.model.Enum.Gender;
import com.app.Hi5.model.Enum.ProfileType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private String id;
    private String username;
    private String fullname;
    private String email;
    private String profilePictureUrl;
    private String coverPictureUrl;
    private String bio;
    private String link;
    private Date dateOfBirth;
    private Gender gender;
    private Long followersCount;
    private Long followingsCount;
    private Long postsCount;
    private FollowStatus followStatus;
    private ProfileType profileType;
}
