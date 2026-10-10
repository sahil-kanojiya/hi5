package com.app.hi5.exceptions;

public class ActionNotAllowedException extends RuntimeException {

    public ActionNotAllowedException() {
        super("Action Not Allowed!");
    }

    public ActionNotAllowedException(String message) {
        super(message);
    }
}
