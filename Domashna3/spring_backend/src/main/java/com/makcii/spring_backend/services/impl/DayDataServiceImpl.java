package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.model.dto.PredictionDataDto;
import com.makcii.spring_backend.model.exceptions.NoDataInPeriodException;
import com.makcii.spring_backend.repository.DayDataRepository;
import com.makcii.spring_backend.services.DayDataService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DayDataServiceImpl implements DayDataService {

    private final DayDataRepository dayDataRepository;

    public DayDataServiceImpl(DayDataRepository dayDataRepository) {
        this.dayDataRepository = dayDataRepository;
    }

    @Override
    public List<DayData> getAllData() {
        return dayDataRepository.findAll();
    }

    @Override
    public DayData getDayById(Long id) {
        return dayDataRepository.findById(id).orElse(null);
    }

    @Override
    public List<DayData> findByIssuer(String issuer) {
        return dayDataRepository.findByIssuerName(issuer);
    }

    @Override
    public List<DayData> getIssuerDataInPeriod(String issuer, LocalDate startDate, LocalDate endDate) {
        List<DayData> data = dayDataRepository.findByIssuerNameAndDateBetween(issuer, startDate, endDate);
        if (data == null || data.isEmpty()) {
            throw new NoDataInPeriodException(issuer, startDate, endDate);
        }
        return data;
    }

    @Override
    public List<DayData> getLatest100DaysByIssuer(String issuerName) {
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Order.desc("date")));
        return dayDataRepository.findTop100ByIssuerNameOrderByDateDesc(issuerName, pageable);
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