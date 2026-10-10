package com.app.hi5.exceptions;

public class InvalidIdentificationTokenException extends RuntimeException {

    public InvalidIdentificationTokenException() {
        super("Invalid Identification Token!");
    }

    public InvalidIdentificationTokenException(String message) {
        super(message);
    }
}
