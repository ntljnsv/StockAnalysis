package com.makcii.spring_backend.repository;

import com.makcii.spring_backend.model.Issuer;
import com.makcii.spring_backend.model.dto.IssuerPriceDto;
import com.makcii.spring_backend.model.dto.IssuerStatsDto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IssuerRepository extends JpaRepository<Issuer, String> {
    Optional<Issuer> findByName(String name);
    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerPriceDto(i.name, " +
            "(SELECT d.lastTransactionPrice FROM DayData d WHERE d.issuer = i ORDER BY d.date DESC LIMIT 1)) " +
            "FROM Issuer i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR :searchTerm = ''")
    List<IssuerPriceDto> searchIssuersByNameContaining(String searchTerm);

    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerStatsDto(i.name, d.lastTransactionPrice, d.volume) " +
            "FROM Issuer i " +
            "JOIN DayData d ON d.issuer = i " +
            "WHERE d.date = CURRENT_DATE - 1 DAY " +
            "ORDER BY d.lastTransactionPrice DESC")
    List<IssuerStatsDto> getTopIssuersByHighestPriceYesterday(Pageable pageable);


    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerStatsDto(i.name, d.lastTransactionPrice, d.volume) " +
            "FROM Issuer i " +
            "JOIN DayData d ON d.issuer = i " +
            "WHERE d.date = CURRENT_DATE - 1 DAY " +
            "ORDER BY d.lastTransactionPrice ASC")
    List<IssuerStatsDto> getTopIssuersByLowestPriceYesterday(Pageable pageable);


    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerStatsDto(i.name, d.lastTransactionPrice, d.volume) " +
            "FROM Issuer i " +
            "JOIN DayData d ON d.issuer = i " +
            "WHERE d.date = CURRENT_DATE - 1 DAY " +
            "ORDER BY d.volume DESC")
    List<IssuerStatsDto> getTopIssuersByHighestVolumeYesterday(Pageable pageable);
}
