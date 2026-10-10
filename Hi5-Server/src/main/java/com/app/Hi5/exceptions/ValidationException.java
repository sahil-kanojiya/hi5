package com.app.Hi5.exceptions;

public class ValidationException extends RuntimeException {

    public ValidationException() {
        super("Validation Error");
    }

    public ValidationException(String message) {
        super(message);
    }
}
