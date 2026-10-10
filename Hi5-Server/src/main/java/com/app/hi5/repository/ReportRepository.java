package com.app.hi5.repository;

import com.app.hi5.model.Report;
import com.app.hi5.model.enums.ReportReason;
import com.app.hi5.model.enums.ReportType;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends MongoRepository<Report, ObjectId> {

    @Aggregation(
            pipeline = {
                "{ $match: { type: ?0 } }",
                "{ $group: { _id: '$relevant', reportCount: { $sum: 1 } } }",
                "{ $project: { id: '$_id', reportCount: 1 } }",
                "{ $sort: { reportCount: -1 } }",
                "{ $skip: ?1 }",
                "{ $limit: ?2 }"
            })
    List<ReportCountResult> findReportCountsByType(ReportType type, int skip, int limit);

    @Aggregation(
            pipeline = {
                "{ $match: { type: ?0, relevant: ?1 } }",
                "{ $group: { _id: '$reason', count: { $sum: 1 } } }",
                "{ $project: { reason: '$_id', count: 1, _id: 0 } }",
                "{ $sort: { count: -1 } }"
            })
    List<ReasonCountResult> findReasonCountsByTypeAndRelevantId(ReportType type, String relevantId);

    @Aggregation(
            pipeline = {
                "{ $match: { type: ?0, relevant: ?1, reason: ?2 } }",
                "{ $project: { user: '$user', reportedAt: '$created_at', _id: 0 } }",
                "{ $sort: { reportedAt: -1 } }",
                "{ $skip: ?3 }",
                "{ $limit: ?4 }"
            })
    List<UserReportResult> findUsersByTypeRelevantAndReason(
            ReportType type, String relevantId, ReportReason reason, int skip, int limit);

    List<Report> findByRelevantIdAndType(String relevantId, ReportType type);

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class ReportCountResult {
        private String id;
        private long reportCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class ReasonCountResult {
        private ReportReason reason;
        private long count;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class UserReportResult {
        private String user;
        private Date reportedAt;
    }
}
