package com.app.Hi5.model;

import com.app.Hi5.model.Enum.ReportReason;
import com.app.Hi5.model.Enum.ReportType;
import java.util.Date;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "report")
public class Report {

    @Id private ObjectId id;

    @Field("relevant")
    private String relevantId;

    private ReportType type;

    @Field("user")
    private String reportedUserId;

    @Field("reason")
    private ReportReason reason;

    @Field("created_at")
    @CreatedDate
    private Date createdAt;
}
