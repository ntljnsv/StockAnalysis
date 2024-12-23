package com.makcii.spring_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "issuers")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Issuer {

    @Id
    @Column(name = "issuer_name")
    private String name;

    @OneToMany(mappedBy = "issuer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DayData> days;

		@Column(name = "current_recommendation")
		private String currentRecommendation;

}
