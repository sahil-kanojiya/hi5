package com.app.hi5.dto.request;

import com.app.hi5.model.enums.LikeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeRequest {

    private String relevantId;
    private LikeType type;
}
