package com.app.hi5.dto.response;

import com.app.hi5.dto.enums.FollowStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSearchResponse {

    private String id;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private FollowStatus followStatus;
}
