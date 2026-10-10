package com.app.Hi5.utility;

import com.app.Hi5.exceptions.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
public class Validator {

    private Validator() {}

    public static void validateEitherEmailOrUsernameExsistsAndValidateFormate(
            String email, String username) throws ValidationException {
        log.info(
                "Starting validation for email or username: email = {}, username = {}",
                email,
                username);

        // Check if both email and username are provided
        if (username != null && email != null) {
            log.warn("Both email and username are provided. Only one is allowed.");
            throw new ValidationException(
                    "Either username or email must be provided, Both not accepted.");
        }

        // If username is null, email should be validated
        if (username == null) {
            if (email == null) {
                log.warn("Neither username nor email is provided.");
                throw new ValidationException("Either username or email must be provided.");
            }
            if (email.isBlank()) {
                log.warn("Email is blank.");
                throw new ValidationException("Email cannot be blank.");
            }

            // Validate email format
            if (!email.matches("^[\\w-.]+@[\\w-]+(?:\\.[a-zA-Z]{2,})+$")) {
                log.warn("Invalid email format detected for: {}", email);
                throw new ValidationException("Invalid email format.");
            }
        } else {
            // If username is provided, validate that it is not blank
            if (username.isBlank()) {
                log.warn("Username is blank.");
                throw new ValidationException("Username cannot be blank.");
            }
        }

        log.info("Validation passed successfully for email = {}, username = {}", email, username);
    }

    public static void validateReelMultipartFilesExsists(MultipartFile file)
            throws ValidationException {
        log.info("Starting validation for multiparts for reel");

        // Check if video file exists and is not empty
        if (file == null || file.isEmpty()) {
            log.warn("Video file is missing or empty.");
            throw new ValidationException("Video file must be provided.");
        }

        log.info("Both thumbnail image and video file are provided and valid.");
    }
}
