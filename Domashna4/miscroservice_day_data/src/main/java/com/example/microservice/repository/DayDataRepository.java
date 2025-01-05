package com.example.microservice.repository;


import com.example.microservice.model.DayData;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DayDataRepository extends JpaRepository<DayData, Long> {
    List<DayData> findByIssuerAndDateBetween(String name, LocalDate startDate, LocalDate endDate);

    @Query("SELECT d FROM DayData d WHERE d.issuer = :issuerName ORDER BY d.date DESC")
    List<DayData> findTop100ByIssuerNameOrderByDateDesc(@Param("issuerName") String issuerName, Pageable pageable);
}
