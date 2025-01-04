package com.makcii.spring_backend.model.dto;

import jakarta.validation.constraints.NotBlank;


public class RegisterRequest {

    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotBlank(message = "Repeated password cannot be blank")
    private String repeatedPassword;

    public @NotBlank(message = "Password cannot be blank") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password cannot be blank") String password) {
        this.password = password;
    }

    public @NotBlank(message = "Username cannot be blank") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "Username cannot be blank") String username) {
        this.username = username;
    }

    public @NotBlank(message = "Repeated password cannot be blank") String getRepeatedPassword() {
        return repeatedPassword;
    }

    public void setRepeatedPassword(@NotBlank(message = "Repeated password cannot be blank") String repeatedPassword) {
        this.repeatedPassword = repeatedPassword;
    }
}

