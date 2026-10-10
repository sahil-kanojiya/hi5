package com.app.Hi5.controller;

import com.app.Hi5.dto.request.ReportRequest;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/report")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<String> report(
            @RequestBody ReportRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        reportService.reportPost(
                userDetails.getUser(),
                request.getRelevantId(),
                request.getType(),
                request.getReason());
        return new ResponseEntity<>("reported successfully.", HttpStatus.CREATED);
    }

    //    @PreAuthorize("hasRole('ADMIN')")
    //    @GetMapping
    //    public List<PostReportDTO> getPostReportStats(@RequestParam(defaultValue = "1") int page,
    //                                                  @RequestParam(defaultValue = "10") int
    // limit) {
    //        // Calculate skip value: (page - 1) * limit
    //        int skip = (page - 1) * limit;
    //        return reportService.getPostReportStats(skip, limit);
    //    }

}
