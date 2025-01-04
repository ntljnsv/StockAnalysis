package com.makcii.spring_backend.model.dto;


public class WatchlistDto {

    private final String issuerName;
    private final Double lastTransactionPrice;
    private final String recommendation;

    public WatchlistDto(String issuerName, Double lastTransactionPrice, String recommendation) {
        this.issuerName = issuerName;
        this.lastTransactionPrice = lastTransactionPrice;
        this.recommendation = recommendation;
    }

    public String getIssuerName() {
        return issuerName;
    }

    public Double getLastTransactionPrice() {
        return lastTransactionPrice;
    }

    public String getRecommendation() {
        return recommendation;
    }
}
