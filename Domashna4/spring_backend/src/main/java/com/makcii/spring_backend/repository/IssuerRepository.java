package com.makcii.spring_backend.repository;

import com.makcii.spring_backend.model.Issuer;
import com.makcii.spring_backend.model.dto.IssuerPriceDto;
import com.makcii.spring_backend.model.dto.IssuerStatsDto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface IssuerRepository extends JpaRepository<Issuer, String> {

    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerPriceDto(i.name, " +
            "(SELECT d.lastTransactionPrice FROM DayData d WHERE d.issuer = i ORDER BY d.date DESC LIMIT 1)) " +
            "FROM Issuer i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR :searchTerm = ''")
    List<IssuerPriceDto> searchIssuersByNameContaining(String searchTerm);


    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerStatsDto(i.name, d.lastTransactionPrice, d.volume) " +
            "FROM Issuer i " +
            "JOIN DayData d ON d.issuer = i " +
            "WHERE d.date = (SELECT MAX(dd.date) FROM DayData dd WHERE dd.date <= CURRENT_DATE AND dd.date >= CURRENT_DATE - 3 DAY) " +
            "ORDER BY d.lastTransactionPrice DESC")
    List<IssuerStatsDto> getTopIssuersByHighestLatestPrice(Pageable pageable);


    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerStatsDto(i.name, d.lastTransactionPrice, d.volume) " +
            "FROM Issuer i " +
            "JOIN DayData d ON d.issuer = i " +
            "WHERE d.date = (SELECT MAX(dd.date) FROM DayData dd WHERE dd.date <= CURRENT_DATE AND dd.date >= CURRENT_DATE - 3 DAY) " +
            "ORDER BY d.lastTransactionPrice ASC")
    List<IssuerStatsDto> getTopIssuersByLowestLatestPrice(Pageable pageable);


    @Query("SELECT new com.makcii.spring_backend.model.dto.IssuerStatsDto(i.name, d.lastTransactionPrice, d.volume) " +
            "FROM Issuer i " +
            "JOIN DayData d ON d.issuer = i " +
            "WHERE d.date = (SELECT MAX(dd.date) FROM DayData dd WHERE dd.date <= CURRENT_DATE AND dd.date >= CURRENT_DATE - 3 DAY) " +
            "ORDER BY d.volume DESC")
    List<IssuerStatsDto> getTopIssuersByHighestLatestVolume(Pageable pageable);
}