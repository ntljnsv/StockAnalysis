package com.makcii.spring_backend.model.exceptions;

public class UserNotFoundException extends RuntimeException{

    public UserNotFoundException() {
        super("User not found");
    }
}
