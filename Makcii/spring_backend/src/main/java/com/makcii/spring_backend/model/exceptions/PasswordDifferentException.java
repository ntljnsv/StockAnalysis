package com.makcii.spring_backend.model.exceptions;


public class PasswordDifferentException extends RuntimeException{
    public PasswordDifferentException() {
        super("Password and repeated password do not match!");
    }
}
