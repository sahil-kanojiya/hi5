package com.app.hi5.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterOtpVerificationRequest {

    @NotBlank(message = "Email cannot be null or blank")
    @Pattern(regexp = "^[\\w-.]+@[\\w-]+(?:\\.[a-zA-Z]{2,})+$", message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password cannot be null or blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
}
