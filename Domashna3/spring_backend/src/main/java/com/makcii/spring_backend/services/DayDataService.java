package com.makcii.spring_backend.services;

import com.makcii.spring_backend.model.DayData;

import java.util.List;

public interface DayDataService {
    List<DayData> getAllData();
    DayData getDayById(Long id);
    List<DayData> findByIssuer(String issuer);
}
