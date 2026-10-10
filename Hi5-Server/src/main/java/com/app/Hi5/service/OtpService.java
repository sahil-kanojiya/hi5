package com.app.Hi5.service;

import com.app.Hi5.exceptions.EntityAlreadyExistsException;
import com.app.Hi5.model.Enum.OtpType;
import com.app.Hi5.model.Otp;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.OtpRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.Conversion;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class OtpService {

    private final SecureRandom RANDOM;
    private final OtpRepository otpRepository;
    private final MailerService mailerService;
    private final UserRepository userRepository;
    private final IdentificationTokenService identificationTokenService;
    private final long otpExpirationTime;
    private final UserDetailsService userDetailsService;
    private final BCryptPasswordEncoder passwordEncoder;

    public OtpService(
            SecureRandom random,
            OtpRepository otpRepository,
            MailerService mailerService,
            UserRepository userRepository,
            IdentificationTokenService identificationTokenService,
            @Value("${otp.expiration-time}") String otpExpirationTimeStr,
            UserDetailsService userDetailsService,
            BCryptPasswordEncoder passwordEncoder) {
        this.RANDOM = random;
        this.otpRepository = otpRepository;
        this.mailerService = mailerService;
        this.userRepository = userRepository;
        this.identificationTokenService = identificationTokenService;
        this.otpExpirationTime = Conversion.convertToMilliseconds(otpExpirationTimeStr);
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    private String generateRandomOtp() {
        String otp = String.valueOf(RANDOM.nextInt(900000) + 100000);
        log.debug("Generated OTP: {}", otp);
        return otp;
    }

    private Otp createOrUpdateOtp(String email, OtpType type) {
        String otp = generateRandomOtp();
        Date now = new Date();
        Date expiry = new Date(now.getTime() + otpExpirationTime);

        Otp otpEntity = otpRepository.findByEmail(email).orElse(new Otp());
        otpEntity.setOtp(otp);
        otpEntity.setEmail(email);
        otpEntity.setOtpType(type);
        otpEntity.setCreatedAt(now);
        otpEntity.setExpiresAt(expiry);

        otpRepository.save(otpEntity);
        log.info("OTP saved for email: {} with type: {}. Expires at: {}", email, type, expiry);
        return otpEntity;
    }

    public void generateAndSendOtpForRegister(String email) {
        log.info("Generating OTP for registration for email: {}", email);
        Optional<User> optionalUser = userRepository.findByEmailAndIsActiveTrue(email);
        if (optionalUser.isPresent()) {
            log.warn("Email already exists for registration: {}", email);
            throw new EntityAlreadyExistsException("Email already exists.");
        }
        Otp otpEntity = createOrUpdateOtp(email, OtpType.REGISTER);
        if (!mailerService.sendOtpForRegistration(email, otpEntity.getOtp())) {
            log.error("Failed to send OTP for registration to email: {}", email);
            throw new MailSendException(
                    "An error occurred while sending the OTP for registration. Please try again.");
        }
        log.info("OTP sent for registration to email: {}", email);
    }

    public String generateIdentificationTokenAndSendOtpForLogin(
            String email, String username, String password) {
        log.info("Generating OTP for login for email: {} and username: {}", email, username);
        if (email == null) {
            User user =
                    userRepository
                            .findByUsernameAndIsActiveTrue(username)
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Invalid username or password!"));
            email = user.getEmail();
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid email/username or password");
        }
        //        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email,
        // password));

        Otp otpEntity = createOrUpdateOtp(email, OtpType.LOGIN);
        if (!mailerService.sendOtpForLogin(email, otpEntity.getOtp())) {
            log.error("Failed to send OTP for login to email: {}", email);
            throw new MailSendException(
                    "An error occurred while sending the OTP for login. Please try again.");
        }
        log.info("OTP sent for login to email: {}", email);
        return identificationTokenService.generateToken(email);
    }

    public void generateAndSendOtpForForgetPassword(String email, String username) {
        log.info(
                "Generating OTP for forget password for email: {} and username: {}",
                email,
                username);
        if (email != null) {
            userRepository
                    .findByEmailAndIsActiveTrue(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Invalid email or username!"));
        } else {
            User user =
                    userRepository
                            .findByUsernameAndIsActiveTrue(username)
                            .orElseThrow(
                                    () ->
                                            new UsernameNotFoundException(
                                                    "Invalid email or username!"));
            email = user.getEmail();
        }
        Otp otpEntity = createOrUpdateOtp(email, OtpType.FORGOT_PASSWORD);
        if (!mailerService.sendOtpForForgetPassword(email, otpEntity.getOtp())) {
            log.error("Failed to send OTP for forget password to email: {}", email);
            throw new MailSendException(
                    "An error occurred while sending the OTP for password recovery. Please try"
                            + " again.");
        }
        log.info("OTP sent for forget password to email: {}", email);
    }

    public boolean isValid(String email, String otp, OtpType type) {
        log.debug("Validating OTP: {} for email: {} with type: {}", otp, email, type);
        Optional<Otp> optionalOtp = otpRepository.findByOtpAndEmail(otp, email);
        if (optionalOtp.isPresent()) {
            Otp otpEntity = optionalOtp.get();
            if (otpEntity.getOtpType().equals(type) && otpEntity.getExpiresAt().after(new Date())) {
                otpRepository.delete(otpEntity);
                log.info("OTP validated successfully for email: {}", email);
                return true;
            }
        }
        log.warn("Invalid OTP or expired OTP for email: {}", email);
        return false;
    }
}
