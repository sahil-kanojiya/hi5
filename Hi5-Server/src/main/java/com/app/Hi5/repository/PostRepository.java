package com.app.Hi5.repository;

import com.app.Hi5.model.Post;
import java.util.Date;
import java.util.List;
import java.util.Set;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, ObjectId> {

    @Aggregation(pipeline = {"{ $match: { is_private : false } }", "{ $sample: { size: ?0 } }"})
    List<Post> findRandomPosts(int numberOfPosts);

    Page<Post> findByUserIdInOrderByCreatedAtDesc(Set<String> userIds, Pageable pageable);

    Page<Post> findByUserIdInAndIsPrivateFalseOrderByCreatedAtDesc(
            Set<String> userIds, Pageable pageable);

    Page<Post> findByIdIn(Set<ObjectId> ids, Pageable pageable);

    long countByCreatedAtBetween(Date startDate, Date endDate);

    void deleteByUserId(String userId);

    //    Page<Post> findAllByIdIn(List<ObjectId> ids, Pageable pageable);

    //    @Aggregation(pipeline = {
    //            "{ $match: { 'user': { $in: ?1 } } }", // Filter posts by users
    //            "{ $sort: { 'created_at': -1 } }",
    //            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as:
    // 'user_details' } }", // Join user details
    //            "{ $unwind: '$user_details' }", // Unwind user details
    //            "{ $project: { " +
    //                    "'id': '$_id', " +
    //                    "'content': 1, " +
    //                    "'image_url': 1, " +
    //                    "'video_url': 1, " +
    //                    "'created_at': 1, " +
    //                    "'likesCount': { $size: '$likes' }, " +
    //                    "'commentsCount': { $size: '$comments' }, " +
    //                    "'isLiked': { $cond: { if: { $in: [?0, '$likes'] }, then: true, else:
    // false } }, " +
    //                    "'isSaved': { $cond: { if: { $in: [?0, '$saved_by_users'] }, then: true,
    // else: false } }, " +
    //                    "'isReported': { $cond: { if: { $in: [?0, '$reported_by_users'] }, then:
    // true, else: false } }" +
    //                    "'userID': '$user_details._id', " +
    //                    "'username': '$user_details.username', " +
    //                    "'fullname': '$user_details.fullname', " +
    //                    "'profilePictureUrl': '$user_details.profile_picture_url' " +
    //                    "} }",
    //            "{ $skip: ?2 }", // Skip based on the page (e.g., page * pageSize)
    //            "{ $limit: ?3 }" // Limit based on the page size
    //    })
    //    List<PostResponseDTO> findPostsByUserIdsWithPaginationAndOrder(
    //            String currentUserId, Set<String> userIds, int skip, int limit);
    //
    //
    //    @Aggregation(pipeline = {
    //            "{ $match: { '_id': { $in: ?1 } } }",
    //            "{ $sort: { 'created_at': -1 } }",
    //            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as:
    // 'user_details' } }", // Join user details
    //            "{ $unwind: '$user_details' }",
    //            "{ $project: { " +
    //                    "'id': '$_id', " +
    //                    "'content': 1, " +
    //                    "'image_url': 1, " +
    //                    "'video_url': 1, " +
    //                    "'created_at': 1, " +
    //                    "'likesCount': { $size: '$likes' }, " +
    //                    "'commentsCount': { $size: '$comments' }, " +
    //                    "'isLiked': { $cond: { if: { $in: [?0, '$likes'] }, then: true, else:
    // false } }, " +
    //                    "'isSaved': { $cond: { if: { $in: [?0, '$saved_by_users'] }, then: true,
    // else: false } }, " +
    //                    "'isReported': { $cond: { if: { $in: [?0, '$reported_by_users'] }, then:
    // true, else: false } }" +
    //                    "'userID': '$user_details._id', " +
    //                    "'username': '$user_details.username', " +
    //                    "'fullname': '$user_details.fullname', " +
    //                    "'profilePictureUrl': '$user_details.profile_picture_url' " +
    //                    "} }",
    //            "{ $skip: ?2 }",
    //            "{ $limit: ?3 }"
    //    })
    //    List<PostResponseDTO> findSavedPostsWithPagination(
    //            String currentUserId, Set<String> postIds, int skip, int limit
    //    );
    //
    //    @Aggregation(pipeline = {
    //            "{ $match: { '_id': ?0 } }",  // Filter for the specific post by its ID
    //            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as:
    // 'user_details' } }", // Join with users collection
    //            "{ $unwind: '$user_details' }", // Unwind user_details array
    //            "{ $project: { " +
    //                    "'id': '$_id', " +
    //                    "'content': 1, " +
    //                    "'image_url': 1, " +
    //                    "'video_url': 1, " +
    //                    "'created_at': 1, " +
    //                    "'userID': '$user_details._id', " +
    //                    "'username': '$user_details.username', " +
    //                    "'fullname': '$user_details.fullname', " +
    //                    "'profilePictureUrl': '$user_details.profile_picture_url' " +
    //                    "} }"
    //    })
    //    PostReportPartialDTO findPostByIdWithUserDetails(String postId);

}
