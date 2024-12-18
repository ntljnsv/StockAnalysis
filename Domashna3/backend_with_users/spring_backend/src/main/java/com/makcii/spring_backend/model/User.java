package com.makcii.spring_backend.model;


import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "logged_user")
public class User {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @ManyToMany
    private List<Issuer> issuers;

    @Column(unique = true)
    private String username;
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.issuers = new ArrayList<>();
    }

    public User() {
        this.issuers = new ArrayList<>();
        this.username = "";
        this.password = "";
    }
}
