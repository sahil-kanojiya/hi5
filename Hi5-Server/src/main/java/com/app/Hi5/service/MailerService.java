package com.app.Hi5.service;

import com.app.Hi5.utility.EmailTemplates;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailerService {

    private final JavaMailSender mailSender;

    public boolean sendOtpForRegistration(String email, String otp) {
        String content =
                EmailTemplates.REGISTER_OTP_HTML_TEMPLATE
                        .replace("%email%", email)
                        .replace("%otp%", otp);
        //        log.info("Sending OTP for registration to email: {}", email);
        log.info("Sending OTP for registration to email: {} otp: {}", email, otp);
        return sendFormattedEmail(email, "Complete Your Registration - OTP Code", content);
    }

    public boolean sendOtpForLogin(String email, String otp) {
        String content =
                EmailTemplates.LOGIN_OTP_HTML_TEMPLATE
                        .replace("%email%", email)
                        .replace("%otp%", otp);
        //        log.info("Sending OTP for login to email: {}", email);
        log.info("Sending OTP for login to email: {} otp: {}", email, otp);
        return sendFormattedEmail(email, "Login Verification - Your OTP Code", content);
    }

    public boolean sendOtpForForgetPassword(String email, String otp) {
        String content =
                EmailTemplates.FORGOT_PASSWORD_OTP_HTML_TEMPLATE
                        .replace("%email%", email)
                        .replace("%otp%", otp);
        //        log.info("Sending OTP for forget password to email: {}", email);
        log.info("Sending OTP for forget password to email: {} otp:{}", email, otp);
        return sendFormattedEmail(email, "Password Reset Request - OTP Code", content);
    }

    public boolean sendFormattedEmail(String email, String subject, String content) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(content, true);
            helper.setFrom("hi5connect567@gmail.com", "Hi5");
            //            helper.setFrom("superhero1000@gmail.com","Hi5");
            helper.getMimeMessage().addHeader("X-Priority", "1"); // 1 = High, 3 = Normal, 5 = Low
            helper.setReplyTo("hi5connect567@gmail.com", "Hi5");
            //            helper.setReplyTo("superhero100.1000@gmail.com","Hi5");

            //            mailSender.send(message);

            log.info("Email successfully sent to: {} with subject: {}", email, subject);
            return true;
        } catch (Exception e) {
            log.error(
                    "Failed to send email to {} with subject '{}': {}",
                    email,
                    subject,
                    e.getMessage(),
                    e);
            return false;
        }
    }

    public boolean sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);

            log.info("Simple email successfully sent to: {} with subject: {}", to, subject);
            return true;
        } catch (Exception e) {
            log.error(
                    "Failed to send simple email to {} with subject '{}': {}",
                    to,
                    subject,
                    e.getMessage());
            return false;
        }
    }
}
