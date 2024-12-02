package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@Table(name = "data")
@NoArgsConstructor
@AllArgsConstructor
public class Day {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
