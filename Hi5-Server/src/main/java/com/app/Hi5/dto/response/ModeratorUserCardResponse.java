package com.app.Hi5.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModeratorUserCardResponse {

    private String id;
    private String username;
    private String email;
    private Date createdAt;
}
