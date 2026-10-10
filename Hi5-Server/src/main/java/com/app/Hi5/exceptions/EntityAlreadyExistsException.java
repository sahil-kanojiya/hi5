package com.app.Hi5.exceptions;

public class EntityAlreadyExistsException extends RuntimeException {

    public EntityAlreadyExistsException() {
        super("Entity Already Exsists!");
    }

    public EntityAlreadyExistsException(String message) {
        super(message);
    }
}
