package com.app.Hi5.controller;

import com.app.Hi5.dto.request.ActivateAccountRequest;
import com.app.Hi5.dto.request.CheckEmailAvailabilityRequest;
import com.app.Hi5.dto.request.CheckUsernameAvailabilityRequest;
import com.app.Hi5.dto.request.ForgotPasswordOtpRequest;
import com.app.Hi5.dto.request.ForgotPasswordOtpVerificationRequest;
import com.app.Hi5.dto.request.LoginRequest;
import com.app.Hi5.dto.request.RegisterOtpRequest;
import com.app.Hi5.dto.request.RegisterOtpVerificationRequest;
import com.app.Hi5.dto.response.AuthTokenResponse;
import com.app.Hi5.dto.response.CheckEmailAvailabilityResponse;
import com.app.Hi5.dto.response.CheckUsernameAvailabilityResponse;
import com.app.Hi5.dto.response.ForgotPasswordResponse;
import com.app.Hi5.dto.response.IdentificationTokenResponse;
import com.app.Hi5.dto.response.OtpStatusResponse;
import com.app.Hi5.service.AuthService;
import com.app.Hi5.service.OtpService;
import com.app.Hi5.utility.Validator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/check-email")
    public ResponseEntity<CheckEmailAvailabilityResponse> checkEmail(
            @RequestBody @Valid CheckEmailAvailabilityRequest request) {
        log.info("Checking availability for email: {}", request.getEmail());
        CheckEmailAvailabilityResponse response = new CheckEmailAvailabilityResponse();
        if (authService.checkEmailExists(request.getEmail())) {
            log.warn("Email already exists: {}", request.getEmail());
            response.setAvailable(false);
            response.setStatus(HttpStatus.CONFLICT);
            response.setStatusCode(HttpStatus.CONFLICT.value());
            response.setMessage("Email already exists.");
        } else {
            log.info("Email is available: {}", request.getEmail());
            response.setAvailable(true);
            response.setStatus(HttpStatus.OK);
            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Email is available.");
        }
        return response.toResponseEntity();
    }

    @PostMapping("/check-username")
    public ResponseEntity<CheckUsernameAvailabilityResponse> checkUsername(
            @RequestBody @Valid CheckUsernameAvailabilityRequest request) {
        log.info("Checking availability for username: {}", request.getUsername());
        CheckUsernameAvailabilityResponse response = new CheckUsernameAvailabilityResponse();
        if (authService.checkUsernameExists(request.getUsername())) {
            log.warn("Username already exists: {}", request.getUsername());
            response.setAvailable(false);
            response.setStatus(HttpStatus.CONFLICT);
            response.setStatusCode(HttpStatus.CONFLICT.value());
            response.setMessage("Username already exists.");
        } else {
            log.info("Username is available: {}", request.getUsername());
            response.setAvailable(true);
            response.setStatus(HttpStatus.OK);
            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Username is available.");
        }
        return response.toResponseEntity();
    }

    @PostMapping("/register")
    public ResponseEntity<OtpStatusResponse> generateOtpForRegister(
            @RequestBody @Valid RegisterOtpRequest request) {
        log.info("Generating OTP for registration for email: {}", request.getEmail());
        otpService.generateAndSendOtpForRegister(request.getEmail());
        return OtpStatusResponse.builder()
                .isSent(true)
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Registration OTP has been successfully sent to your email.")
                .build()
                .toResponseEntity();
    }

    @PostMapping("/register/{otp}")
    public ResponseEntity<IdentificationTokenResponse> registerUser(
            @PathVariable("otp") String otp,
            @RequestBody @Valid RegisterOtpVerificationRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        String identificationToken =
                authService.registerUser(request.getEmail(), request.getPassword(), otp);
        return IdentificationTokenResponse.builder()
                .identificationToken(identificationToken)
                .status(HttpStatus.CREATED)
                .statusCode(HttpStatus.CREATED.value())
                .message("User registration successful.")
                .build()
                .toResponseEntity();
    }

    @PostMapping("/activate")
    public ResponseEntity<AuthTokenResponse> activateUser(
            @RequestHeader(value = "IdentificationToken") String identificationToken,
            @RequestBody @Valid ActivateAccountRequest request) {
        log.info("Activating user with identification token: {}", identificationToken);
        String authToken =
                authService.verifyIdentificationTokenAndActivateAccount(
                        identificationToken,
                        request.getUsername(),
                        request.getFullname(),
                        request.getDateOfBirth(),
                        request.getGender());
        return AuthTokenResponse.builder()
                .authToken(authToken)
                .status(HttpStatus.CREATED)
                .statusCode(HttpStatus.CREATED.value())
                .message("User activation successful.")
                .build()
                .toResponseEntity();
    }

    @PostMapping("/login")
    public ResponseEntity<?> generateOtpForLogin(@RequestBody @Valid LoginRequest request) {
        log.info(
                "Login attempt for email or username: {}",
                request.getEmail() != null ? request.getEmail() : request.getUsername());
        Validator.validateEitherEmailOrUsernameExistsAndValidateFormat(
                request.getEmail(), request.getUsername());
        String token =
                authService.generateAuthTokenIf2FAIsOffAndPassIsValid(
                        request.getEmail(), request.getUsername(), request.getPassword());
        if (token != null) {
            log.info(
                    "Login successful for user: {}",
                    request.getEmail() != null ? request.getEmail() : request.getUsername());
            return AuthTokenResponse.builder()
                    .authToken(token)
                    .status(HttpStatus.CREATED)
                    .statusCode(HttpStatus.CREATED.value())
                    .message("User login successful.")
                    .build()
                    .toResponseEntity();
        }
        String identificationToken =
                otpService.generateIdentificationTokenAndSendOtpForLogin(
                        request.getEmail(), request.getUsername(), request.getPassword());
        log.info(
                "Login OTP sent for user: {}",
                request.getEmail() != null ? request.getEmail() : request.getUsername());
        return IdentificationTokenResponse.builder()
                .identificationToken(identificationToken)
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Login OTP has been successfully sent to your email.")
                .build()
                .toResponseEntity();
    }

    @PostMapping("/login/{otp}")
    public ResponseEntity<AuthTokenResponse> loginUser(
            @PathVariable("otp") String otp,
            @RequestHeader(value = "IdentificationToken") String identificationToken) {
        log.info("Logging in user with identification token: {}", identificationToken);
        String authToken =
                authService.verifyIdentificationTokenAndLoginUser(identificationToken, otp);
        return AuthTokenResponse.builder()
                .authToken(authToken)
                .status(HttpStatus.CREATED)
                .statusCode(HttpStatus.CREATED.value())
                .message("User login successful.")
                .build()
                .toResponseEntity();
    }

    @PostMapping("/forget-password")
    public ResponseEntity<OtpStatusResponse> generateOtpForLogin(
            @RequestBody @Valid ForgotPasswordOtpRequest request) {
        log.info(
                "Generating OTP for password recovery for email or username: {}",
                request.getEmail() != null ? request.getEmail() : request.getUsername());
        Validator.validateEitherEmailOrUsernameExistsAndValidateFormat(
                request.getEmail(), request.getUsername());
        otpService.generateAndSendOtpForForgetPassword(request.getEmail(), request.getUsername());
        return OtpStatusResponse.builder()
                .isSent(true)
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("OTP for password recovery has been sent to your email.")
                .build()
                .toResponseEntity();
    }

    @PostMapping("/forget-password/{otp}")
    public ResponseEntity<ForgotPasswordResponse> forgetPassword(
            @PathVariable("otp") String otp,
            @RequestBody @Valid ForgotPasswordOtpVerificationRequest request) {
        log.info(
                "Password recovery attempt for email or username: {}",
                request.getEmail() != null ? request.getEmail() : request.getUsername());
        Validator.validateEitherEmailOrUsernameExistsAndValidateFormat(
                request.getEmail(), request.getUsername());
        authService.forgotPassword(
                request.getEmail(), request.getUsername(), request.getPassword(), otp);
        return ForgotPasswordResponse.builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Password reset successful. You can now log in with your new password.")
                .build()
                .toResponseEntity();
    }
}
