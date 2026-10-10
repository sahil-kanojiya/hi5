package com.app.Hi5.repository;

import com.app.Hi5.model.Chat;
import java.util.List;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends MongoRepository<Chat, ObjectId> {

    List<Chat> findByChatUserIdsContaining(String userId);

    @Query(
            "{ $expr: { $or: [ { $and: [ { $eq: [ { $arrayElemAt: ['$chat_users', 0] }, ?0 ] }, {"
                + " $eq: [ { $arrayElemAt: ['$chat_users', 1] }, ?1 ] } ] }, { $and: [ { $eq: [ {"
                + " $arrayElemAt: ['$chat_users', 0] }, ?1 ] }, { $eq: [ { $arrayElemAt:"
                + " ['$chat_users', 1] }, ?0 ] } ] } ] } }")
    Optional<Chat> findByChatUserIdsContaining(String userId1, String userId2);
}
