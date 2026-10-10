package com.app.hi5.dto.response;

import com.app.hi5.model.enums.ActivityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatResponse {

    private String chatId;
    private String receiverId;
    private String receiverFullname;
    private String receiverUsername;
    private String receiverProfileImageUrl;
    private ActivityStatus receiverStatus;
}
