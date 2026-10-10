package com.app.hi5.repository;

import com.app.hi5.model.Message;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId> {

    List<Message> findByChatIdOrderByCreatedAtAsc(String chatId);
}
