package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@Table(name = "data") // DATUM treba maybe
@NoArgsConstructor
@AllArgsConstructor
public class Day {
// za koj den kolku bilo za koj issuer/izdavach
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Column(name = "publisher", nullable = false)
//    private String publisher;
//
//    @Column(name = "date", nullable = false)
//    private String date;
//
//    @Column(name = "last_transaction_price")
//    private String lastTransactionPrice;
//
//    @Column(name = "max_price")
//    private String maxPrice;
//
//    @Column(name = "min_price")
//    private String minPrice;
//
//    @Column(name = "avg_price")
//    private String avgPrice;
//
//    @Column(name = "percentage_change")
//    private String percentageChange;
//
//    @Column(name = "quantity")
//    private Double quantity;
//
//    @Column(name = "turnover")
//    private Double turnover;
//
//    @Column(name = "total_turnover")
//    private Double totalTurnover;

    @Column(name = "Издавач", nullable = false)
    private String issuer;

    @Column(name = "Датум", nullable = false)
    private String date;

    @Column(name = "Цена на последна трансакција")
    private String lastTransactionPrice;

    @Column(name = "Мак.")
    private String maxPrice;

    @Column(name = "Мин.")
    private String minPrice;

    @Column(name = "Просечна џена")
    private String avgPrice;

    @Column(name = "%пром.")
    private String percentageChange;

    @Column(name = "Количина")
    private Double quantity;

    @Column(name = "Промет во БЕСТ во денари")
    private Double turnover;

    @Column(name = "Вкупен промет во денари")
    private Double totalTurnover;

}
