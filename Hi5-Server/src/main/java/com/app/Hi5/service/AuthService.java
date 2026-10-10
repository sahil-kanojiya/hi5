package com.app.Hi5.service;

import com.app.Hi5.exceptions.EntityAlreadyExistsException;
import com.app.Hi5.exceptions.InvalidIdentificationTokenException;
import com.app.Hi5.exceptions.InvalidOtpException;
import com.app.Hi5.model.Enum.Gender;
import com.app.Hi5.model.Enum.OtpType;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.security.AuthTokenService;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthTokenService authTokenService;
    private final OtpService otpService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final IdentificationTokenService identificationTokenService;
    private final UserDetailsService userDetailsService;

    public boolean checkEmailExists(String email) {
        log.debug("Checking if email exists: {}", email);
        boolean exists = userRepository.findByEmailAndIsActiveTrue(email).isPresent();
        log.info("Email {} exists: {}", email, exists);
        return exists;
    }

    public boolean checkUsernameExists(String username) {
        log.debug("Checking if username exists: {}", username);
        boolean exists = userRepository.findByUsernameAndIsActiveTrue(username).isPresent();
        log.info("Username {} exists: {}", username, exists);
        return exists;
    }

    public String registerUser(String email, String password, String otp) {
        log.debug("Attempting to register user with email: {}", email);
        if (userRepository.findByEmailAndIsActiveTrue(email).isPresent()) {
            log.error("Email already exists: {}", email);
            throw new EntityAlreadyExistsException("email already exists!");
        }
        if (!otpService.isValid(email, otp, OtpType.REGISTER)) {
            log.error("Invalid OTP for email: {}", email);
            throw new InvalidOtpException(
                    "The provided OTP is invalid or has expired. Please request a new OTP.");
        }
        User user = User.builder().email(email).password(passwordEncoder.encode(password)).build();
        userRepository.save(user);
        log.info("User registered with email: {}", email);
        return identificationTokenService.generateToken(email);
    }

    public String verifyIdentificationTokenAndActivateAccount(
            String identificationToken,
            String username,
            String fullname,
            Date dateOfBirth,
            Gender gender) {
        log.debug(
                "Verifying identification token and activating account for username: {}", username);
        if (!identificationTokenService.validateToken(identificationToken)) {
            log.error("Invalid identification token provided.");
            throw new InvalidIdentificationTokenException("Identification token is invalid.");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            log.error("Username already exists: {}", username);
            throw new EntityAlreadyExistsException("username already exists!");
        }
        User user =
                userRepository
                        .findByEmail(identificationTokenService.extractSub(identificationToken))
                        .orElseThrow(
                                () -> new UsernameNotFoundException("Invalid email or username!"));
        user.setUsername(username);
        user.setFullname(fullname);
        user.setDateOfBirth(dateOfBirth);
        user.setGender(gender);
        user.setIsActive(true);
        userRepository.save(user);
        log.info("User account activated for username: {}", username);
        return authTokenService.generateToken(user.getEmail());
    }

    public String generateAuthTokenIf2FAIsOffAndPassIsValid(
            String email, String username, String password) {
        log.debug("Generating auth token for email: {} or username: {}", email, username);
        User user;
        if (email != null) {
            user =
                    userRepository
                            .findByEmailAndIsActiveTrue(email)
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Invalid email or username!"));
        } else {
            user =
                    userRepository
                            .findByUsernameAndIsActiveTrue(username)
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Invalid email or username!"));
            email = user.getEmail();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid email/username or password");
        }

        if (!user.getTwoFactorAuthentication()) {
            log.info("2FA is off, returning auth token for email: {}", email);
            return authTokenService.generateToken(email);
        }
        log.info("2FA is enabled, auth token not generated for email: {}", email);
        return null;
    }

    public String verifyIdentificationTokenAndLoginUser(String identificationToken, String otp) {
        log.debug("Verifying identification token for login.");
        if (!identificationTokenService.validateToken(identificationToken)) {
            log.error("Invalid identification token provided.");
            throw new InvalidIdentificationTokenException(
                    "provided identification token is invalid.");
        }
        String email = identificationTokenService.extractSub(identificationToken);
        if (!otpService.isValid(email, otp, OtpType.LOGIN)) {
            log.error("Invalid OTP for login: {}", email);
            throw new InvalidOtpException(
                    "The provided OTP is invalid or has expired. Please request a new OTP.");
        }
        log.info("Login successful for email: {}", email);
        return authTokenService.generateToken(email);
    }

    public void forgotPassword(String email, String username, String password, String otp) {
        log.debug("Handling forgot password for email: {} or username: {}", email, username);
        User user;
        if (email != null) {
            user =
                    userRepository
                            .findByEmailAndIsActiveTrue(email)
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Invalid email or username!"));
        } else {
            user =
                    userRepository
                            .findByUsernameAndIsActiveTrue(username)
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Invalid email or username!"));
            email = user.getEmail();
        }
        if (!otpService.isValid(email, otp, OtpType.FORGOT_PASSWORD)) {
            log.error("Invalid OTP for password reset: {}", email);
            throw new InvalidOtpException(
                    "The provided OTP is invalid or has expired. Please request a new OTP.");
        } else {
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            log.info("Password successfully updated for email: {}", email);
        }
    }
}
