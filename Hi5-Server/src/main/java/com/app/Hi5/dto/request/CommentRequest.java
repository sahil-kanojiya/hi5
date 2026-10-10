package com.app.Hi5.dto.request;

import com.app.Hi5.model.Enum.CommentType;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {

    private String relevantId;
    private String content;
    private CommentType type;
}
