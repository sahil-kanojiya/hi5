package com.app.hi5.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private String id;

    private String chatId;

    private String imageUrl;

    private String videoUrl;

    private String message;

    private String senderUserId;

    private String receiverUserId;

    private Date createdAt;
}
