package com.app.Hi5.exceptions;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException() {
        super("User not found!");
    }

    public EntityNotFoundException(String message) {
        super(message);
    }
}
