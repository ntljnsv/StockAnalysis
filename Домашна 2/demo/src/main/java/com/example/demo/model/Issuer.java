package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "[име на табела во базата]")
@NoArgsConstructor
@AllArgsConstructor
public class Issuer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //todo
    // Додадете уште барем два атрибути во класата. По потреба, можете да ги анотирате со
    // ограничувања како @NotNull, @Column(unique = true), @NotEmpty, @Positive.

    @NotNull(message = "Issuer must have a name")
    private String IssuerName;
    @Positive(message = "Price must be greater than zero")
    private Integer priceRN;
//    @NotNull(message = "Issuer must have a date")
//    private Date date;

    private Integer maxPrice;
    private Integer minPrice;

}
