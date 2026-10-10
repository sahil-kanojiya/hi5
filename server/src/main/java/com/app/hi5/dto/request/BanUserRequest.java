package com.app.hi5.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BanUserRequest {

    @NotNull(message = "Date of Birth cannot be null or blank")
    @Future(message = "Date must be in the future")
    private Date banToDate;
}
