package com.app.Hi5.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewStoryUserResponse {

    private String id;
    private String fullname;
    private String profilePictureUrl;
    private Long totalStorys;
    private Long totalSeenStorys;
}
