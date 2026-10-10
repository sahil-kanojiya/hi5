package com.app.Hi5.dto.request;

import com.app.Hi5.model.Enum.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {

    @NotBlank(message = "Full name cannot be null or blank")
    private String fullname;

    @NotNull(message = "Username cannot be null")
    private String link;

    @NotNull(message = "Username cannot be null")
    private String bio;

    @NotNull(message = "Date of Birth cannot be null or blank")
    @Past(message = "Date of Birth must be in the past")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date DateOfBirth;

    @NotNull(
            message =
                    "Gender cannot be null or blank. Valid responses are 'MALE', 'FEMALE', 'OTHER',"
                            + " or 'PREFER_NOT_TO_SAY'.")
    private Gender gender;
}
