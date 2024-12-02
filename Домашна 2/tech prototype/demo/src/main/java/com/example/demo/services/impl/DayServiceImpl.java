package com.example.demo.services.impl;

import com.example.demo.model.Day;
import com.example.demo.repository.DayRepository;
import com.example.demo.services.DayService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class DayServiceImpl implements DayService {

    private final DayRepository dayRepository;

    public DayServiceImpl(DayRepository dayRepository) {
        this.dayRepository = dayRepository;
    }

    @Override
    public List<Day> getAllData() {
        return dayRepository.findAll();
    }

    @Override
    public Day getDayById(Long id) {
        return dayRepository.findById(id).orElse(null);
    }
}
