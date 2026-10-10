package com.app.hi5.dto.response;

import com.app.hi5.model.enums.Role;
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
public class GetMeResponse {

    private String id;
    private String email;
    private String username;
    private Role role;
    private String fullname;
    private String profilePictureUrl;
    private HttpStatus status;
    private int statusCode;

    public ResponseEntity<GetMeResponse> toResponseEntity() {
        return new ResponseEntity<>(this, this.status);
    }
}
