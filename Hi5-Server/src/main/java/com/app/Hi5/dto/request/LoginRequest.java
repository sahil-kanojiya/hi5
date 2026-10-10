package com.app.Hi5.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    private String username;

    private String email;

    @NotBlank(message = "Password cannot be null or blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
}
