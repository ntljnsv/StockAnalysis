package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.model.exceptions.NoDataInPeriodException;
import com.makcii.spring_backend.services.DayDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "/dayData")
@Validated
@CrossOrigin(origins="*")
public class DayController {

    private final DayDataService dayService;

    public DayController(DayDataService dayDataService) {
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

    @GetMapping("/issuer/{name}")
    public ResponseEntity<List<DayData>> getStockDataForIssuer(@PathVariable("name") String issuer) {
        return ResponseEntity.ok(dayService.findByIssuer(issuer));
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

