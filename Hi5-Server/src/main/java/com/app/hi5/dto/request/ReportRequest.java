package com.app.hi5.dto.request;

import com.app.hi5.model.enums.ReportReason;
import com.app.hi5.model.enums.ReportType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {

    private String relevantId;
    private ReportReason reason;
    private ReportType type;
}
