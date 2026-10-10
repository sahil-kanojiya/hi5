package com.app.Hi5.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckUsernameAvailabilityResponse {

    @JsonProperty("isAvailable")
    private boolean isAvailable;

    private HttpStatus status;
    private int statusCode;
    private String message;

    public ResponseEntity<CheckUsernameAvailabilityResponse> toResponseEntity() {
        return new ResponseEntity<>(this, this.status);
    }
}
