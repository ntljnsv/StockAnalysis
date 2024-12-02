package com.example.demo.repository;

import com.example.demo.model.Day;
import com.example.demo.model.Issuer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssuerRepository extends JpaRepository<Issuer, String> {
}
