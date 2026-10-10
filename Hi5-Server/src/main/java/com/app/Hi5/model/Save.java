package com.app.Hi5.model;

import com.app.Hi5.model.Enum.SaveType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "save")
public class Save {

    @Id private ObjectId id;

    @Field("user")
    private String userId;

    @Field("relevant")
    private String relevantId;

    @Field("type")
    private SaveType saveType;

    @Field("is_saved")
    private Boolean isSaved;

    @LastModifiedDate
    @Field("created_at")
    private Date createdAt;
}
