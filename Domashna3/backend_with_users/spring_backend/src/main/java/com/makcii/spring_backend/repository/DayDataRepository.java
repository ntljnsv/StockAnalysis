package com.makcii.spring_backend.repository;

import com.makcii.spring_backend.model.DayData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DayDataRepository extends JpaRepository<DayData, Long> {
    List<DayData> findByIssuerName(String issuer);
}
