package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@Table(name = "[име на табела во базата]")
@NoArgsConstructor
@AllArgsConstructor
public class Day {
// za koj den kolku bilo za koj issuer/izdavach
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "The day must have a date")
    private Date date;

    @NotNull(message = "There should be an issuer")
    private Long issuerId;

    private Integer profit;

}
