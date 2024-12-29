package com.makcii.spring_backend.controller;

import com.makcii.spring_backend.model.Issuer;
import com.makcii.spring_backend.model.dto.IssuerPriceDto;
import com.makcii.spring_backend.model.dto.IssuerStatsDto;
import com.makcii.spring_backend.services.IssuerService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/issuers")
@Validated
@CrossOrigin(origins="*")
public class IssuerController {
    private final IssuerService issuerService;

    public IssuerController(IssuerService issuerService) {
        this.issuerService = issuerService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Issuer>> getAllStockData() {
        return ResponseEntity.ok(issuerService.listAllIssuers());
    }

    @GetMapping("/{name}")
    public ResponseEntity<Issuer> getStockDataById(@PathVariable("name") String name) {
        return ResponseEntity.ok(issuerService.getIssuerByName(name));
    }

    @GetMapping("/search")
    public ResponseEntity<List<IssuerPriceDto>> getIssuersAndLatestPrices(@RequestParam String searchTerm) {
        return ResponseEntity.ok(issuerService.getIssuersAndLatestPrices(searchTerm));
    }

    @GetMapping("/top")
    public ResponseEntity<Map<String, List<IssuerStatsDto>>> getTopLatestIssuers() {
        return ResponseEntity.ok(issuerService.getTopLatestIssuers());
    }
}
