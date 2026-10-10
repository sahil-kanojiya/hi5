package com.app.hi5.repository;

import com.app.hi5.model.Otp;
import java.util.Optional;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpRepository extends MongoRepository<Otp, ObjectId> {

    Optional<Otp> findByOtpAndEmail(String otp, String email);

    Optional<Otp> findByEmail(String email);
}
