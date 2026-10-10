package com.app.hi5.service;

import com.app.hi5.model.UserActivity;
import com.app.hi5.model.enums.ActivityStatus;
import com.app.hi5.repository.UserActivityRepository;
import java.util.Date;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserActivityRepository userActivityRepository;

    public void updateUserActivity(String userId, ActivityStatus status) {
        Optional<UserActivity> userActivityOpt = userActivityRepository.findByUserId(userId);
        UserActivity userActivity =
                userActivityOpt.orElse(
                        UserActivity.builder()
                                .userId(userId)
                                .activityStatus(status)
                                .lastActiveTime(new Date())
                                .build());
        userActivity.setActivityStatus(status);
        userActivity.setLastActiveTime(new Date());
        userActivityRepository.save(userActivity);
        log.info("User activity updated: {}", userActivity);
        //        messagingTemplate
        //        from chats find users chats   and     send to those users only
    }
}
