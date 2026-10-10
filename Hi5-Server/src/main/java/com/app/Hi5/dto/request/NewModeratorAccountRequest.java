package com.app.Hi5.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewModeratorAccountRequest {

    private String email;
    private String password;
    private String username;
}
