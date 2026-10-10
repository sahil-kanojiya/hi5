package com.app.hi5.dto.request;

import com.app.hi5.model.enums.SaveType;
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
