package com.makcii.spring_backend.repository;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.model.dto.WatchlistDto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DayDataRepository extends JpaRepository<DayData, Long> {
    List<DayData> findByIssuerName(String issuer);

    @Query("SELECT new com.makcii.spring_backend.model.dto.WatchlistDto(d.issuer.name, d.lastTransactionPrice, d.issuer.currentRecommendation) " +
            "FROM DayData d " +
            "WHERE d.issuer.name IN :issuerNames AND d.date = (SELECT MAX(d2.date) FROM DayData d2 WHERE d2.issuer = d.issuer)")
    List<WatchlistDto> getUserWatchlistData(@Param("issuerNames") List<String> issuerNames);


    @Query("SELECT d FROM DayData d WHERE d.issuer.name = :issuerName ORDER BY d.date DESC")
    List<DayData> findRecentDataByIssuer(@Param("issuerName") String issuerName, Pageable pageable);
}
