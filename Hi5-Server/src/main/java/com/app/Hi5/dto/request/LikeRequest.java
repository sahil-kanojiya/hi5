package com.app.Hi5.dto.request;

import com.app.Hi5.model.Enum.LikeType;
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
