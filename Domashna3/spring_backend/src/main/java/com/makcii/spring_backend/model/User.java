package com.makcii.spring_backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "user_watch_list",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "issuer_name")
    )
    @JsonIgnore
    private List<Issuer> watchList;

    @Column(name="username",unique = true)
    private String username;

    @Column(name="password")
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.watchList = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Issuer> getWatchList() {
        return watchList;
    }

    public void setWatchList(List<Issuer> watchList) {
        this.watchList = watchList;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
