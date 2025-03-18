package com.makcii.spring_backend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.ArrayList;
import java.util.Date;


public class JwtUtils {

    private static final String SECRET_KEY = "eyJhbGciOiJIUzUxMiJ9ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbmlzaCBOYXRoIiwNCiAgImlhdCI6IDE1MTYyMzkwaMjINCn0C8BclxP976ZGtshJwqvMoaYxutZrO9NGn9f1DPRrUda5koXYKaHMQsyafPGRnTeI4RR1dgoGe5CGaFlwmtoXyQaa";

    public static String generateToken(Authentication authentication) {
        return Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static Authentication getAuthenticationFromToken(String token) {
        String username = Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        return new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
    }
}
