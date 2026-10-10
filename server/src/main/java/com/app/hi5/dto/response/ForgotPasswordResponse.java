package com.app.hi5.dto.response;

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
public class ForgotPasswordResponse {

    private HttpStatus status;
    private int statusCode;
    private String message;

    public ResponseEntity<ForgotPasswordResponse> toResponseEntity() {
        return new ResponseEntity<>(this, this.status);
    }
}
