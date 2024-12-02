package com.example.demo.controller;

import com.example.demo.model.Day;
import com.example.demo.services.DayService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
@Validated
@CrossOrigin(origins="*")
public class DayController {

    private final DayService dayService;

    public DayController(DayService dayService) {
        this.dayService = dayService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Day>> getAllStockData() {
        return ResponseEntity.ok(dayService.getAllData());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Day> getStockDataById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(dayService.getDayById(id));
    }
}
