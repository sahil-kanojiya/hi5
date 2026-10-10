package com.app.hi5.repository;

import com.app.hi5.model.Comment;
import com.app.hi5.model.enums.CommentType;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, ObjectId> {

    Page<Comment> findByTypeAndRelevantId(
            CommentType commentType, String relevantId, PageRequest pageRequest);
}
