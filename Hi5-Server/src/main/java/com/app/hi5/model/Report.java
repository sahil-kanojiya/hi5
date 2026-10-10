package com.app.hi5.model;

import com.app.hi5.model.enums.ReportReason;
import com.app.hi5.model.enums.ReportType;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
