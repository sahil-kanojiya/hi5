package com.app.hi5.exceptions;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException() {
        super("User not found!");
    }

    public EntityNotFoundException(String message) {
        super(message);
    }
}
