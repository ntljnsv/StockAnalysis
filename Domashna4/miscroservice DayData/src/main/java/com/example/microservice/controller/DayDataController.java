package com.example.microservice.controller;


import com.example.microservice.model.DayData;
import com.example.microservice.model.exceptions.NoDataInPeriodException;
import com.example.microservice.service.DayDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "/dayData/microservice")
@CrossOrigin(origins="*")
public class DayDataController {

    private final DayDataService dayService;

    public DayDataController(DayDataService dayDataService) {
        this.dayService = dayDataService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<DayData>> getAllStockData() {
        return ResponseEntity.ok(dayService.getAllData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DayData> getStockDataById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(dayService.getDayById(id));
    }

    @GetMapping("/issuer/{name}/period")
    public ResponseEntity<List<DayData>> getStockDataForIssuerInPeriod(@PathVariable("name") String issuer,
                                                                       @RequestParam LocalDate startDate,
                                                                       @RequestParam LocalDate endDate) {
        try {
            return ResponseEntity.ok(dayService.getIssuerDataInPeriod(issuer, startDate, endDate));
        } catch (NoDataInPeriodException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping("/issuer/{name}/latest")
    public ResponseEntity<List<DayData>> getLatest100Days(@PathVariable("name") String issuer) {
        List<DayData> latestDayData = dayService.getLatest100DaysByIssuer(issuer);
        return new ResponseEntity<>(latestDayData, HttpStatus.OK);
    }
}

