package com.app.Hi5.exceptions;

public class InvalidIdentificationTokenException extends RuntimeException {

    public InvalidIdentificationTokenException() {
        super("Invalid Identification Token!");
    }

    public InvalidIdentificationTokenException(String message) {
        super(message);
    }
}
