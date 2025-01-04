package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.model.dto.RegisterRequest;
import com.makcii.spring_backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/register")
@CrossOrigin(origins="*")
public class RegisterController {

    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String>  registerUser(@Valid @RequestBody RegisterRequest registerRequest) {

        try {
            User registeredUser = userService.register(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getRepeatedPassword()
            );

            return ResponseEntity.ok("User registered successfully: " + registeredUser.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
