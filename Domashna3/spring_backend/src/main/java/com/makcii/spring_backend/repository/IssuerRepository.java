package com.makcii.spring_backend.repository;

import com.makcii.spring_backend.model.Issuer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssuerRepository extends JpaRepository<Issuer, String> {
    Optional<Issuer> findByName(String name);
}
