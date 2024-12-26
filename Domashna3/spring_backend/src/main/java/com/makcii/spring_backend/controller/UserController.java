package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.User;
import com.makcii.spring_backend.model.dto.WatchlistDto;
import com.makcii.spring_backend.services.UserService;
import jakarta.websocket.server.PathParam;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins="*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/{username}/watchlist")
    public ResponseEntity<List<WatchlistDto>> getUserWatchlist (@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserWatchlist(username));
    }

    @PostMapping("/{username}/watchlist/add")
    public ResponseEntity<User> addIssuerToWatchlist (@PathVariable String username,
                                                      @RequestBody Map<String, String> requestBody) {

        String issuerName = requestBody.get("issuerName");

        return ResponseEntity.ok(userService.addIssuerToWatchlist(username, issuerName));
    }

    @DeleteMapping("/{username}/watchlist/remove")
    public ResponseEntity<User> removeIssuerFromWatchlist(@PathVariable String username,
                                                          @RequestParam String issuerName) {
        return ResponseEntity.ok(userService.removeIssuerFromWatchlist(username, issuerName));
    }

}
