package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/register")
public class RegisterController {

    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    public ResponseEntity<User> registerUser(String username, String password, String repeatedPassword) {
        return ResponseEntity.ok(userService.register(username, password, repeatedPassword));
    }
}
