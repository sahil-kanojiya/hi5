package com.app.Hi5.dto.response;

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
public class AuthTokenResponse {

    private String authToken;
    private HttpStatus status;
    private int statusCode;
    private String message;

    public ResponseEntity<AuthTokenResponse> toResponseEntity() {
        return new ResponseEntity<>(this, this.status);
    }
}

// @NotBlank(message = "Username cannot be null or blank")
// private String username;
//
// @NotBlank(message = "Full name cannot be null or blank")
// private String fullname;
//
// @Past(message = "Date of Birth must be in the past")
// @DateTimeFormat(pattern = "yyyy-MM-dd")
// private Date DateOfBirth;
//
// @NotNull(message = "Gender cannot be null or blank. Valid responses are 'MALE', 'FEMALE',
// 'OTHER', or 'PREFER_NOT_TO_SAY'.")
// private Gender gender;
