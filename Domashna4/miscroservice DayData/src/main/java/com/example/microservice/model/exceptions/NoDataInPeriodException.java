package com.example.microservice.model.exceptions;

import java.time.LocalDate;

public class NoDataInPeriodException extends RuntimeException{
    public NoDataInPeriodException(String issuer, LocalDate startDate, LocalDate endDate) {
        super(String.format("No data available for %s from %s to %s", issuer, startDate, endDate));
    }
}
