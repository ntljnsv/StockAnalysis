package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.model.dto.PredictionDataDto;
import com.makcii.spring_backend.repository.DayDataRepository;
import com.makcii.spring_backend.services.DayDataService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DayDataServiceImpl implements DayDataService {

    private final DayDataRepository dayDataRepository;

    public DayDataServiceImpl(DayDataRepository dayDataRepository) {
        this.dayDataRepository = dayDataRepository;
    }

    @Override
    public List<DayData> findByIssuer(String issuer) {
        return dayDataRepository.findByIssuerName(issuer);
    }

    @Override
    public List<PredictionDataDto> getPredictionData(String issuerName, int lags) {
        Pageable pageable = PageRequest.of(0, lags);
        List<DayData> recentData = dayDataRepository.findRecentDataByIssuer(issuerName, pageable);

        if (recentData.size() < lags) {
            throw new IllegalArgumentException("Not enough data to generate lag features");
        }

        return recentData.stream().map(d -> new PredictionDataDto(
                d.getLastTransactionPrice(),
                0.0,
                0.0,
                0.0,
                0.0
        )).toList();
    }


}