package com.app.Hi5.dto.request;

import com.app.Hi5.model.Enum.CommentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {

    private String relevantId;
    private String content;
    private CommentType type;
}
