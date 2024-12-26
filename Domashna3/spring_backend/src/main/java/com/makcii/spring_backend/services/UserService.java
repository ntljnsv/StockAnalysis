package com.makcii.spring_backend.services;


import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.model.dto.WatchlistDto;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface UserService extends UserDetailsService {
    User register(String username, String password, String repeatPassword);
    List<WatchlistDto> getUserWatchlist(String username);
    User addIssuerToWatchlist(String username, String issuerName);
    User removeIssuerFromWatchlist(String username, String issuerName);
}

