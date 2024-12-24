package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.model.exceptions.PasswordDifferentException;
import com.makcii.spring_backend.model.exceptions.UserAlreadyExistsException;
import com.makcii.spring_backend.model.exceptions.UserNotFoundException;
import com.makcii.spring_backend.repository.UserRepository;
import com.makcii.spring_backend.services.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(String username, String password, String repeatPassword) {
        if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
            throw new UserNotFoundException();
        }

        if (!password.equals(repeatPassword)) {
            throw new PasswordDifferentException();
        }

        if (this.userRepository.findByUsername(username).isPresent()) {
            throw new UserAlreadyExistsException();
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(username, hashedPassword);

        return userRepository.save(user);
    }

    @Override
    public User login(String username, String password) {
        User user = this.userRepository.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UserNotFoundException();
        }

        return user;
    }

}


