package com.makcii.spring_backend.model.dto;

public class PredictionDataDto {

    private Double lastTransactionPrice;
    private Double percentageChange;
    private Double volume;
    private Double turnover;
    private Double totalTurnover;

    public PredictionDataDto(Double lastTransactionPrice, Double percentageChange, Double volume, Double turnover, Double totalTurnover) {
        this.lastTransactionPrice = lastTransactionPrice;
        this.percentageChange = percentageChange;
        this.volume = volume;
        this.turnover = turnover;
        this.totalTurnover = totalTurnover;
    }

    public Double getLastTransactionPrice() {
        return lastTransactionPrice;
    }

    public void setLastTransactionPrice(Double lastTransactionPrice) {
        this.lastTransactionPrice = lastTransactionPrice;
    }

    public Double getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(Double percentageChange) {
        this.percentageChange = percentageChange;
    }

    public Double getVolume() {
        return volume;
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public Double getTurnover() {
        return turnover;
    }

    public void setTurnover(Double turnover) {
        this.turnover = turnover;
    }

    public Double getTotalTurnover() {
        return totalTurnover;
    }

    public void setTotalTurnover(Double totalTurnover) {
        this.totalTurnover = totalTurnover;
    }
}
