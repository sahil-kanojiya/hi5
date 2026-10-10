package com.app.hi5.exceptions;

public class ValidationException extends RuntimeException {

    public ValidationException() {
        super("Validation Error");
    }

    public ValidationException(String message) {
        super(message);
    }
}
