package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.model.exceptions.UserNotFoundException;
import com.makcii.spring_backend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    public ResponseEntity<User> login(String username, String password) {
        return ResponseEntity.ok(userService.login(username, password));
    }
}
