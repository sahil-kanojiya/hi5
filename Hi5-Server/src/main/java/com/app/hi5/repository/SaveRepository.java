package com.app.hi5.repository;

import com.app.hi5.model.Save;
import com.app.hi5.model.enums.SaveType;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaveRepository extends MongoRepository<Save, ObjectId> {

    Optional<Save> findByUserIdAndRelevantIdAndSaveType(
            String userId, String relevantId, SaveType saveType);

    Page<Save> findByUserIdAndSaveTypeAndIsSavedTrueOrderByCreatedAtDesc(
            String userId, SaveType saveType, Pageable pageable);
}
