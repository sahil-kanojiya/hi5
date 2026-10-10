package com.app.hi5.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckUsernameAvailabilityRequest {

    @NotBlank(message = "Username cannot be null or blank")
    private String username;
}
