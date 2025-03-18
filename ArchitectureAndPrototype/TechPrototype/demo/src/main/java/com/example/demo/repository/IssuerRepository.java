package com.example.demo.repository;

import com.example.demo.model.Issuer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssuerRepository extends JpaRepository<Issuer, String> {
    Optional<Issuer> findByName(String name);
}
