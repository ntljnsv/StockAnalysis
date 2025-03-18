package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@Table(name = "DayData")
@NoArgsConstructor
@AllArgsConstructor
public class Day {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "issuer_name", nullable = false)
    private Issuer issuer;

    @Column(name = "Date", nullable = false)
    private String date;

    @Column(name = "LastTranscationPrice")
    private Double lastTransactionPrice;

    @Column(name = "Max")
    private Double maxPrice;

    @Column(name = "Min")
    private Double minPrice;

    @Column(name = "AveragePrice")
    private Double avgPrice;

    @Column(name = "PercentChange")
    private Double percentageChange;

    @Column(name = "Quantity")
    private Double quantity;

    @Column(name = "Turnover")
    private Double turnover;

    @Column(name = "TotalTurnover")
    private Double totalTurnover;

}
