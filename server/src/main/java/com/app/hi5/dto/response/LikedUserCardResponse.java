package com.app.hi5.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikedUserCardResponse {

    private String id;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private Date createdAt;
}
