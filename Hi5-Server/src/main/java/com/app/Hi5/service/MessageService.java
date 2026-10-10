package com.app.Hi5.service;

import com.app.Hi5.model.Message;
import com.app.Hi5.repository.MessageRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public List<Message> getMessagesByChatId(String chatId) {
        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
    }

    public Message save(
            String chatId,
            String imageUrl,
            String videoUrl,
            String message,
            String senderUserId,
            String receiverUserId) {
        return messageRepository.save(
                Message.builder()
                        .chatId(chatId)
                        .imageUrl(imageUrl)
                        .videoUrl(videoUrl)
                        .message(message)
                        .senderUserId(senderUserId)
                        .receiverUserId(receiverUserId)
                        .build());
    }
}
