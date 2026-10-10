package com.app.hi5.dto.response;

import com.app.hi5.dto.enums.LikeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryResponse {

    private String id;
    private String imageUrl;
    private String videoUrl;
    private Integer likeCount;
    private LikeStatus likeStatus;
}
