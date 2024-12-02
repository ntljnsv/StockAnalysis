package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "Issuers")
@NoArgsConstructor
@AllArgsConstructor
public class Issuer {
    @Id
    private String name;

}
