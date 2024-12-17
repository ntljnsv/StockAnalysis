package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.services.DayDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
}

