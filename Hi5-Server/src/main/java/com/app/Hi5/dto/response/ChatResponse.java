package com.app.Hi5.dto.response;

import com.app.Hi5.model.Enum.ActivityStatus;
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
