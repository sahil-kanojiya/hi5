package com.app.hi5.exceptions;

public class InvalidOtpException extends RuntimeException {

    public InvalidOtpException() {
        super("Invalid OTP!");
    }

    public InvalidOtpException(String message) {
        super(message);
    }
}
