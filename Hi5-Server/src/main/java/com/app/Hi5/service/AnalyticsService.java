package com.app.Hi5.service;

import com.app.Hi5.dto.payload.AnalyticsDataPayload;
import com.app.Hi5.dto.response.StatsResponse;
import com.app.Hi5.model.Enum.ActivityStatus;
import com.app.Hi5.model.Enum.Role;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.UserActivityRepository;
import com.app.Hi5.repository.UserRepository;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final UserActivityRepository userActivityRepository;

    @Scheduled(fixedRate = 5000)
    public void sendAnalyticsReport() {
        try {
            log.debug("Sending scheduled analytics report");
            simpMessagingTemplate.convertAndSend(
                    "/analytics",
                    AnalyticsDataPayload.builder()
                            .totalUsers(userRepository.countByRole(Role.USER))
                            .totalModerators(userRepository.countByRole(Role.MODERATOR))
                            .totalPosts(postRepository.count())
                            .totalReels(reelRepository.count())
                            .activeUsers(
                                    userActivityRepository.countByActivityStatus(
                                            ActivityStatus.ONLINE))
                            .bannedUsers(userRepository.countByBanUntilAfter(new Date()))
                            .userGrowthDayStatsResponse(getUserCountForLast7Days())
                            .userGrowthMonthStatsResponse(getUserCountForLast12Months())
                            .userGrowthYearStatsResponse(getUserCountForLast6Years())
                            .contentEngagementGrowthDayStatsResponse(
                                    getContentImpressionsCountForLast7Days())
                            .contentEngagementGrowthMonthStatsResponse(
                                    getContentImpressionsCountForLast12Months())
                            .contentEngagementGrowthYearStatsResponse(
                                    getContentImpressionsCountForLast6Years())
                            .build());
        } catch (Exception e) {
            log.error("Failed to send analytics: {}", e.getMessage());
        }
    }

    public StatsResponse getUserCountForLast7Days() {
        return getStatsForPeriod(Calendar.DAY_OF_YEAR, 6, "EEE, dd MMM");
    }

    public StatsResponse getUserCountForLast12Months() {
        return getStatsForPeriod(Calendar.MONTH, 11, "MMM yyyy");
    }

    public StatsResponse getUserCountForLast6Years() {
        return getStatsForPeriod(Calendar.YEAR, 5, "yyyy");
    }

    private StatsResponse getStatsForPeriod(int calendarField, int periods, String dateFormat) {
        StatsResponse statsResponse =
                StatsResponse.builder().x(new ArrayList<>()).y(new ArrayList<>()).build();
        Calendar calendar = Calendar.getInstance();
        if (calendarField == Calendar.YEAR) {
            calendar.set(Calendar.MONTH, 0);
            calendar.set(Calendar.DAY_OF_YEAR, 1);
        } else if (calendarField == Calendar.MONTH) {
            calendar.set(Calendar.DAY_OF_MONTH, 1);
        }
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        for (int i = periods; i >= 0; i--) {
            Calendar periodStart = (Calendar) calendar.clone();
            periodStart.add(calendarField, -i);
            Date startDate = periodStart.getTime();
            Calendar periodEnd = (Calendar) periodStart.clone();
            periodEnd.add(calendarField, 1);
            Date endDate = periodEnd.getTime();
            long count = userRepository.countByCreatedAtBetweenAndIsActiveTrue(startDate, endDate);
            statsResponse.getX().add(new SimpleDateFormat(dateFormat).format(startDate));
            statsResponse.getY().add(count);
        }
        return statsResponse;
    }

    public StatsResponse getContentImpressionsCountForLast7Days() {
        return getContentImpressionsForPeriod(Calendar.DAY_OF_YEAR, 6, "EEE, dd MMM");
    }

    public StatsResponse getContentImpressionsCountForLast12Months() {
        return getContentImpressionsForPeriod(Calendar.MONTH, 11, "MMM yyyy");
    }

    public StatsResponse getContentImpressionsCountForLast6Years() {
        return getContentImpressionsForPeriod(Calendar.YEAR, 5, "yyyy");
    }

    private StatsResponse getContentImpressionsForPeriod(
            int calendarField, int periods, String dateFormat) {
        StatsResponse statsResponse =
                StatsResponse.builder().x(new ArrayList<>()).y(new ArrayList<>()).build();
        Calendar calendar = Calendar.getInstance();
        if (calendarField == Calendar.YEAR) {
            calendar.set(Calendar.MONTH, 0);
            calendar.set(Calendar.DAY_OF_YEAR, 1);
        } else if (calendarField == Calendar.MONTH) {
            calendar.set(Calendar.DAY_OF_MONTH, 1);
        }
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        for (int i = periods; i >= 0; i--) {
            Calendar periodStart = (Calendar) calendar.clone();
            periodStart.add(calendarField, -i);
            Date startDate = periodStart.getTime();
            Calendar periodEnd = (Calendar) periodStart.clone();
            periodEnd.add(calendarField, 1);
            Date endDate = periodEnd.getTime();
            long count =
                    postRepository.countByCreatedAtBetween(startDate, endDate)
                            + reelRepository.countByCreatedAtBetween(startDate, endDate);
            statsResponse.getX().add(new SimpleDateFormat(dateFormat).format(startDate));
            statsResponse.getY().add(count);
        }
        return statsResponse;
    }
}
