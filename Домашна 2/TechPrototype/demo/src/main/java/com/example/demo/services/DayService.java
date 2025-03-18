package com.example.demo.services;

import com.example.demo.model.Day;

import java.util.List;

public interface DayService {
    List<Day> getAllData();
    Day getDayById(Long id);
    List<Day> findByIssuer(String issuer);
}
