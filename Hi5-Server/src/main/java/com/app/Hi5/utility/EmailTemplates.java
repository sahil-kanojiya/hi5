package com.app.Hi5.utility;

public final class EmailTemplates {

    private EmailTemplates() {}

    public static final String REGISTER_OTP_HTML_TEMPLATE =
            "<div style=\"background-color: #f9f9f9; padding: 20px; font-family: 'Poppins', Arial,"
                + " sans-serif; color: #333333; text-align: center;\"><div"
                + " style=\"background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 8px"
                + " rgba(0, 0, 0, 0.1); padding: 25px; max-width: 500px; margin: 0 auto;\"><div"
                + " style=\"margin-bottom: 15px;\"><a href=\"http://localhost:3000\""
                + " target=\"_blank\"><img src=\"https://i.postimg.cc/mrp62ZFC/Hi5-1.png\""
                + " alt=\"Hi5 Logo\" style=\"max-width: 140px;\"></a></div><div style=\"font-size:"
                + " 18px; line-height: 1.6; color: #444444; margin: 20px 0;\"><p>Hi"
                + " <strong>%email%</strong>,</p><p>Welcome to <span style=\"color: #007bff;"
                + " font-weight: 600;\">Hi5</span>! Use the code below to verify your email and"
                + " activate your account:</p></div><div style=\"font-size: 28px; font-weight: 600;"
                + " color: #ffffff; background-color: #007bff; padding: 15px; margin: 25px 0;"
                + " border-radius: 8px; letter-spacing: 1.5px;\">%otp%</div><div style=\"font-size:"
                + " 14px; color: #555555; line-height: 1.5; margin: 15px 0;\"><p>The code is valid"
                + " for <strong style=\"color: #007bff;\">5 minutes</strong>. Enter it in the"
                + " verification field on our website to complete the process.</p><p>Need help?"
                + " Feel free to reach out to us.</p></div><div style=\"font-size: 13px; color:"
                + " #888888; margin-top: 20px;\"><p>If you didn’t request this email, no action is"
                + " needed.</p><p>Contact <a href=\"http://localhost:3000/contact\" style=\"color:"
                + " #007bff; text-decoration: none;\">Support</a> for assistance.</p><p>Hi5 ・ 123"
                + " Imaginary Street ・ Surat, Gujarat, 395006</p></div></div></div>";

    public static final String LOGIN_OTP_HTML_TEMPLATE =
            "<div style=\"background-color: #f9f9f9; padding: 20px; font-family: 'Poppins', Arial,"
                + " sans-serif; color: #333333; text-align: center;\"><div"
                + " style=\"background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 8px"
                + " rgba(0, 0, 0, 0.1); padding: 25px; max-width: 500px; margin: 0 auto;\"><div"
                + " style=\"margin-bottom: 15px;\"><a href=\"http://localhost:3000\""
                + " target=\"_blank\"><img src=\"https://i.postimg.cc/mrp62ZFC/Hi5-1.png\""
                + " alt=\"Hi5 Logo\" style=\"max-width: 140px;\"></a></div><div style=\"font-size:"
                + " 18px; line-height: 1.6; color: #444444; margin: 20px 0;\"><p>Hi"
                + " <strong>%email%</strong>,</p><p>Welcome back to <span style=\"color: #007bff;"
                + " font-weight: 600;\">Hi5</span>! Use the OTP below to log in to your"
                + " account:</p></div><div style=\"font-size: 28px; font-weight: 600; color:"
                + " #ffffff; background-color: #007bff; padding: 15px; margin: 25px 0;"
                + " border-radius: 8px; letter-spacing: 1.5px;\">%otp%</div><div style=\"font-size:"
                + " 14px; color: #555555; line-height: 1.5; margin: 15px 0;\"><p>The code is valid"
                + " for <strong style=\"color: #007bff;\">5 minutes</strong>. Enter it in the login"
                + " field on our website to access your account.</p></div><div style=\"font-size:"
                + " 13px; color: #888888; margin-top: 20px;\"><p>If you didn’t request this email,"
                + " please secure your account by updating your password.</p><p>Contact <a"
                + " href=\"http://localhost:3000/contact\" style=\"color: #007bff; text-decoration:"
                + " none;\">Support</a> for assistance.</p><p>Hi5 ・ 123 Imaginary Street ・ Surat,"
                + " Gujarat, 395006</p></div></div></div>";

    public static final String FORGOT_PASSWORD_OTP_HTML_TEMPLATE =
            "<div style=\"background-color: #f9f9f9; padding: 20px; font-family: 'Poppins', Arial,"
                + " sans-serif; color: #333333; text-align: center;\"><div"
                + " style=\"background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 8px"
                + " rgba(0, 0, 0, 0.1); padding: 25px; max-width: 500px; margin: 0 auto;\"><div"
                + " style=\"margin-bottom: 15px;\"><a href=\"http://localhost:3000\""
                + " target=\"_blank\"><img src=\"https://i.postimg.cc/mrp62ZFC/Hi5-1.png\""
                + " alt=\"Hi5 Logo\" style=\"max-width: 140px;\"></a></div><div style=\"font-size:"
                + " 18px; line-height: 1.6; color: #444444; margin: 20px 0;\"><p>Hi"
                + " <strong>%email%</strong>,</p><p>You requested to reset your password for <span"
                + " style=\"color: #007bff; font-weight: 600;\">Hi5</span>. Use the OTP below to"
                + " proceed:</p></div><div style=\"font-size: 28px; font-weight: 600; color:"
                + " #ffffff; background-color: #007bff; padding: 15px; margin: 25px 0;"
                + " border-radius: 8px; letter-spacing: 1.5px;\">%otp%</div><div style=\"font-size:"
                + " 14px; color: #555555; line-height: 1.5; margin: 15px 0;\"><p>The code is valid"
                + " for <strong style=\"color: #007bff;\">5 minutes</strong>. Enter it on the"
                + " password reset page to continue.</p><p>If you didn’t request a password reset,"
                + " ignore this email or secure your account immediately.</p></div><div"
                + " style=\"font-size: 13px; color: #888888; margin-top: 20px;\"><p>Contact <a"
                + " href=\"http://localhost:3000/contact\" style=\"color: #007bff; text-decoration:"
                + " none;\">Support</a> for assistance.</p><p>Hi5 ・ 123 Imaginary Street ・ Surat,"
                + " Gujarat, 395006</p></div></div></div>";
}
