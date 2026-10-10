package com.app.hi5.dto.response;

import com.app.hi5.model.enums.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDetailResponse {
    private ReportReason reason;
    private Long count;
}
