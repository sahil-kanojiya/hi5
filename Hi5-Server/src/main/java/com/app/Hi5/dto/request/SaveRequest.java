package com.app.Hi5.dto.request;

import com.app.Hi5.model.Enum.SaveType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveRequest {

    private String relevantId;
    private SaveType type;
}
