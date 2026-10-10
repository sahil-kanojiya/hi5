package com.app.Hi5.dto.response;

import com.app.Hi5.dto.enums.FollowStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUserResponse {

    private FollowStatus currentStatus;
    private String message;
    private HttpStatus status;
    private int statusCode;

    public ResponseEntity<FollowUserResponse> toResponseEntity() {
        return new ResponseEntity<>(this, this.status);
    }
}
