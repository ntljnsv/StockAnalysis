package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.DayData;
import com.makcii.spring_backend.services.DayDataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "/dayData")
@Validated
@CrossOrigin(origins="*")
public class DayController {

    private final DayDataService dayService;
    private final WebClient webClient;

    public DayController(DayDataService dayDataService, WebClient.Builder webClientBuilder) {

        this.dayService = dayDataService;
        this.webClient = webClientBuilder.baseUrl("http://localhost:9092/dayData/microservice").build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<DayData>> getAllStockData() {
        List<DayData> response = webClient.get()
                .uri("/all")
                .retrieve()
                .bodyToFlux(DayData.class)
                .collectList()
                .block();
        if (response == null) {
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DayData> getStockDataById(@PathVariable("id") Long id) {
        DayData response = webClient.get()
                .uri("/{id}", id)
                .retrieve()
                .bodyToMono(DayData.class)
                .block();
        if (response == null) {
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/issuer/{name}")
    public ResponseEntity<List<DayData>> getStockDataForIssuer(@PathVariable("name") String issuer) {
        return ResponseEntity.ok(dayService.findByIssuer(issuer));
    }

    @GetMapping("/issuer/{name}/period")
    public ResponseEntity<List<DayData>> getStockDataForIssuerInPeriod(@PathVariable("name") String issuer,
                                                                       @RequestParam LocalDate startDate,
                                                                       @RequestParam LocalDate endDate) {

        List<DayData> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/issuer/{name}/period")
                        .queryParam("startDate", startDate)
                        .queryParam("endDate", endDate)
                        .build(issuer))
                .retrieve()
                .bodyToFlux(DayData.class)
                .collectList()
                .block();
        if (response == null) {
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(response);
    }


    @GetMapping("/issuer/{name}/latest")
    public ResponseEntity<List<DayData>> getLatest100Days(@PathVariable("name") String issuer) {

        List<DayData> response = webClient.get()
                .uri("/issuer/{name}/latest", issuer)
                .retrieve()
                .bodyToFlux(DayData.class)
                .collectList()
                .block();
        if (response == null) {
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(response);
    }
}

