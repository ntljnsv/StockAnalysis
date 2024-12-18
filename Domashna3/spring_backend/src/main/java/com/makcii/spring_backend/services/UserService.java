package com.makcii.spring_backend.services;


import com.makcii.spring_backend.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService {
    User register(String username, String password, String repeatPassword);
    User login(String username, String password);
}

