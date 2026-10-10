package com.app.hi5.repository;

import com.app.hi5.model.Reel;
import java.util.Date;
import java.util.List;
import java.util.Set;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReelRepository extends MongoRepository<Reel, ObjectId> {

    @Aggregation(pipeline = {"{ $match: { is_private : false } }", "{ $sample: { size: ?0 } }"})
    List<Reel> findRandomReels(int numberOfReels);

    Page<Reel> findByUserIdInOrderByCreatedAtDesc(Set<String> userIds, Pageable pageable);

    Page<Reel> findByUserIdInAndIsPrivateFalseOrderByCreatedAtDesc(
            Set<String> userIds, Pageable pageable);

    Page<Reel> findByIdIn(Set<ObjectId> ids, Pageable pageable);

    long countByCreatedAtBetween(Date startDate, Date endDate);

    void deleteByUserId(String userId);
}
