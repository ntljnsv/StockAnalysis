package com.makcii.spring_backend.model.dto;

public class IssuerPriceDto {

    private final String issuerName;
    private final Double latestPrice;

    public IssuerPriceDto(String issuerName, Double latestPrice) {
        this.issuerName = issuerName;
        this.latestPrice = latestPrice;
    }

    public String getIssuerName() {
        return issuerName;
    }

    public Double getLatestPrice() {
        return latestPrice;
    }
}
