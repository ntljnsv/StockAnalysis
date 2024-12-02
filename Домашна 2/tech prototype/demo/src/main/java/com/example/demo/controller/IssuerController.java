package com.example.demo.controller;

import com.example.demo.model.Day;
import com.example.demo.model.Issuer;
import com.example.demo.services.IssuerService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
