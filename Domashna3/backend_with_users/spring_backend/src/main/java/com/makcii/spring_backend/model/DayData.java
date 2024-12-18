package com.makcii.spring_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity
@Table(name = "day_data")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DayData {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "issuer_name", nullable = false)
    @JsonIgnore
    private Issuer issuer;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "last_transaction_price")
    private Double lastTransactionPrice;

    @Column(name = "max_price")
    private Double maxPrice;

    @Column(name = "min_price")
    private Double minPrice;

    @Column(name = "avg_price")
    private Double avgPrice;

    @Column(name = "percent_change")
    private Double percentageChange;

    @Column(name = "volume")
    private Double volume;

    @Column(name = "turnover")
    private Double turnover;

    @Column(name = "total_turnover")
    private Double totalTurnover;

}
