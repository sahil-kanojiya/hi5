package com.app.Hi5.dto.request;

import com.app.Hi5.model.Enum.ReportReason;
import com.app.Hi5.model.Enum.ReportType;
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
