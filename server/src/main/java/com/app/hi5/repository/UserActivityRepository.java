package com.app.hi5.repository;

import com.app.hi5.model.UserActivity;
import com.app.hi5.model.enums.ActivityStatus;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserActivityRepository extends MongoRepository<UserActivity, ObjectId> {

    Optional<UserActivity> findByUserId(String userId);

    long countByActivityStatus(ActivityStatus status);
}
