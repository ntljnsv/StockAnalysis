package com.example.microservice.service;


import com.example.microservice.model.DayData;
import java.time.LocalDate;
import java.util.List;

public interface DayDataService {
    List<DayData> getAllData();
    DayData getDayById(Long id);
    List<DayData> getIssuerDataInPeriod(String issuer, LocalDate startDate, LocalDate endDate);
    List<DayData> getLatest100DaysByIssuer(String issuerName);
}