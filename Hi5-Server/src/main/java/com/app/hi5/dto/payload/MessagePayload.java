package com.app.hi5.dto.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessagePayload {

    private String chatId;

    private String imageUrl;

    private String videoUrl;

    private String message;

    private String senderUserId;

    private String receiverUserId;
}
