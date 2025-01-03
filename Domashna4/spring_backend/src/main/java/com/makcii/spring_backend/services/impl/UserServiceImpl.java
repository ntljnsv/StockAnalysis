package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.Issuer;
import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.model.dto.WatchlistDto;
import com.makcii.spring_backend.model.exceptions.PasswordDifferentException;
import com.makcii.spring_backend.model.exceptions.UserAlreadyExistsException;
import com.makcii.spring_backend.model.exceptions.UserNotFoundException;
import com.makcii.spring_backend.repository.DayDataRepository;
import com.makcii.spring_backend.repository.UserRepository;
import com.makcii.spring_backend.services.IssuerService;
import com.makcii.spring_backend.services.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DayDataRepository dayDataRepository;
    private final IssuerService issuerService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, DayDataRepository dayDataRepository, IssuerService issuerService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dayDataRepository = dayDataRepository;
        this.issuerService = issuerService;
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
    public List<WatchlistDto> getUserWatchlist(String username) {

        User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);

        List<String> issuerNames = user.getWatchList()
                .stream()
                .map(Issuer::getName)
                .toList();

        return dayDataRepository.getUserWatchlistData(issuerNames);
    }

    @Override
    public List<WatchlistDto> addIssuerToWatchlist(String username, String issuerName) {

        User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);

        Issuer issuer = issuerService.getIssuerByName(issuerName);

        user.getWatchList().add(issuer);
        userRepository.save(user);

        return getUserWatchlist(username);
    }

    @Override
    public List<WatchlistDto> removeIssuerFromWatchlist(String username, String issuerName) {

        User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);

        Issuer issuer = issuerService.getIssuerByName(issuerName);

        user.getWatchList().remove(issuer);
        userRepository.save(user);

        return getUserWatchlist(username);
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    }
}


