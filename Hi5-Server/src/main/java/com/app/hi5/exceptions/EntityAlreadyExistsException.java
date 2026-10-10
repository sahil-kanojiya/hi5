package com.app.hi5.exceptions;

public class EntityAlreadyExistsException extends RuntimeException {

    public EntityAlreadyExistsException() {
        super("Entity Already Exists!");
    }

    public EntityAlreadyExistsException(String message) {
        super(message);
    }
}
