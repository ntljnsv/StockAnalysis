package com.makcii.spring_backend.services;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.model.dto.PredictionDataDto;

import java.time.LocalDate;
import java.util.List;

public interface DayDataService {
    List<DayData> findByIssuer(String issuer);
    List<PredictionDataDto> getPredictionData(String issuerName, int lags);
}
