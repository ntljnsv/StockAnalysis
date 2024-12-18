package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.model.exceptions.PasswordDifferentException;
import com.makcii.spring_backend.model.exceptions.UserAlreadyExistsException;
import com.makcii.spring_backend.model.exceptions.UserNotFoundException;
import com.makcii.spring_backend.repository.UserRepository;
import com.makcii.spring_backend.services.UserService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
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

        User user = new User(username, password);

        return userRepository.save(user);
    }

    @Override
    public User login(String username, String password) {
        return this.userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException());
    }

}


