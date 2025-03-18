package com.makcii.spring_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name = "issuers")
@NoArgsConstructor
@AllArgsConstructor
public class Issuer {

    @Id
    @Column(name = "issuer_name")
    private String name;

    @OneToMany(mappedBy = "issuer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DayData> days;

    @Column(name = "current_recommendation")
    private String currentRecommendation;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<DayData> getDays() {
        return days;
    }

    public void setDays(List<DayData> days) {
        this.days = days;
    }

    public String getCurrentRecommendation() {
        return currentRecommendation;
    }

    public void setCurrentRecommendation(String currentRecommendation) {
        this.currentRecommendation = currentRecommendation;
    }
}
