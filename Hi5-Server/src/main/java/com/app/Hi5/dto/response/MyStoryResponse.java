package com.app.Hi5.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyStoryResponse {

    private String id;
    private String imageUrl;
    private String videoUrl;
    private Date createdAt;
    private Integer likeCount;
    private Integer viewCount;
}
