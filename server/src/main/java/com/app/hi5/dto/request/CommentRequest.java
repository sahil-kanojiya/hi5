package com.app.hi5.dto.request;

import com.app.hi5.model.enums.CommentType;
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
