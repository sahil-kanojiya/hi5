package com.app.Hi5.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckEmailAvailabilityRequest {

    @NotBlank(message = "Email cannot be null or blank")
    @Pattern(regexp = "^[\\w-.]+@[\\w-]+(?:\\.[a-zA-Z]{2,})+$", message = "Invalid email format")
    private String email;
}
