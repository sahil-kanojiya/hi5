package com.app.Hi5.repository;

import com.app.Hi5.model.Enum.ActivityStatus;
import com.app.Hi5.model.UserActivity;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserActivityRepository extends MongoRepository<UserActivity, ObjectId> {

    Optional<UserActivity> findByUserId(String userId);

    long countByActivityStatus(ActivityStatus status);
}
