package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.dto.WatchlistDto;
import com.makcii.spring_backend.services.UserService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<WatchlistDto>> addIssuerToWatchlist (@PathVariable String username,
                                                      @RequestBody Map<String, String> requestBody) {

        String issuerName = requestBody.get("issuerName");

        List<WatchlistDto> data = userService.addIssuerToWatchlist(username, issuerName);
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/{username}/watchlist/remove")
    public ResponseEntity<List<WatchlistDto>> removeIssuerFromWatchlist(@PathVariable String username,
                                                          @RequestParam String issuerName) {

        List<WatchlistDto> data = userService.removeIssuerFromWatchlist(username, issuerName);
        return ResponseEntity.ok(data);
    }

}
