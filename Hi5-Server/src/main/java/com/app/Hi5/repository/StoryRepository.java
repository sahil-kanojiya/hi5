package com.app.Hi5.repository;

import com.app.Hi5.model.Story;
import java.util.Date;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StoryRepository extends MongoRepository<Story, ObjectId> {

    @Query("{ 'userId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    List<Story> findStoriesFromLast24Hours(String userId, Date from, Date to, Sort sort);

    void deleteByUserId(String userId);
}
