package com.makcii.spring_backend.model.dto;

public class IssuerStatsDto {
    private final String issuerName;
    private final Double price;
    private final Double volume;

    public IssuerStatsDto(String name, Double price, Double volume) {
        this.issuerName = name;
        this.price = price;
        this.volume = volume;
    }

    public String getIssuerName() {
        return issuerName;
    }

    public Double getPrice() {
        return price;
    }

    public Double getVolume() {
        return volume;
    }
}
