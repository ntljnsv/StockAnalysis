package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.repository.DayDataRepository;
import com.makcii.spring_backend.services.DayDataService;
import org.springframework.stereotype.Service;

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
}