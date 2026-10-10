package com.app.Hi5.model;

import com.app.Hi5.model.Enum.OtpType;
import java.util.Date;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "otp")
public class Otp {

    @Id private ObjectId id;

    @Field("otp")
    private String otp;

    @Field("type")
    private OtpType otpType;

    @Indexed(unique = true)
    @Field("user_email")
    private String email;

    @Field("created_at")
    @CreatedDate
    private Date createdAt;

    @Field("expires_at")
    private Date expiresAt;
}
