package com.example.microservice.service.impl;


import com.example.microservice.model.DayData;
import com.example.microservice.model.exceptions.NoDataInPeriodException;
import com.example.microservice.repository.DayDataRepository;
import com.example.microservice.service.DayDataService;
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
    public List<DayData> getIssuerDataInPeriod(String issuer, LocalDate startDate, LocalDate endDate) {
        List<DayData> data = dayDataRepository.findByIssuerAndDateBetween(issuer.toUpperCase(), startDate, endDate);
        if (data == null || data.isEmpty()) {
            throw new NoDataInPeriodException(issuer, startDate, endDate);
        }
        return data;
    }

    @Override
    public List<DayData> getLatest100DaysByIssuer(String issuerName) {
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Order.desc("date")));
        return dayDataRepository.findTop100ByIssuerNameOrderByDateDesc(issuerName.toUpperCase(), pageable);
    }


}