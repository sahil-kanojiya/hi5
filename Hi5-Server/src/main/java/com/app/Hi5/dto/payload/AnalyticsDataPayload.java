package com.app.Hi5.dto.payload;

import com.app.Hi5.dto.response.StatsResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDataPayload {

    private Long totalUsers;
    private Long totalModerators;
    private Long totalPosts;
    private Long totalReels;
    private Long activeUsers;
    private Long bannedUsers;
    private StatsResponse userGrowthDayStatsResponse;
    private StatsResponse userGrowthMonthStatsResponse;
    private StatsResponse userGrowthYearStatsResponse;
    private StatsResponse contentEngagementGrowthDayStatsResponse;
    private StatsResponse contentEngagementGrowthMonthStatsResponse;
    private StatsResponse contentEngagementGrowthYearStatsResponse;
}
