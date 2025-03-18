package com.example.demo.services.impl;

import com.example.demo.model.Day;
import com.example.demo.model.Issuer;
import com.example.demo.repository.DayRepository;
import com.example.demo.repository.IssuerRepository;
import com.example.demo.services.CsvParserService;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvParserServiceImpl implements CsvParserService {

    private final DayRepository dayRepository;
    private final IssuerRepository issuerRepository;

    public CsvParserServiceImpl(DayRepository dayRepository, IssuerRepository issuerRepository) {
        this.dayRepository = dayRepository;
        this.issuerRepository = issuerRepository;
    }

    @PostConstruct
    @Transactional
    public void init() {
        parseAndSaveCsv("issuer_data_cleaned.csv");
    }

    @Transactional
    public void parseAndSaveCsv(String filePath) {
        ClassPathResource resource = new ClassPathResource(filePath);
        List<Day> stockDataList = new ArrayList<>();

        try (CSVReader csvReader = new CSVReader(new InputStreamReader(resource.getInputStream()))) {
            String[] line;
            boolean isHeader = true;

            while ((line = csvReader.readNext()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                Day stockData = parseCsvRow(line);
                if (stockData != null) {
                    stockDataList.add(stockData);
                }
            }
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException(e);
        }

        dayRepository.saveAll(stockDataList);
        System.out.println("CSV data successfully parsed and saved to the database.");
    }

    private Day parseCsvRow(String[] columns) {
        try {
            Day stockData = new Day();
            String issuerName = columns[0].trim();

            Issuer issuer = issuerRepository.findByName(issuerName).orElse(null);
            if (issuer == null) {
                issuer = new Issuer(issuerName);
                issuer = issuerRepository.save(issuer);
            }

            stockData.setIssuer(issuer);
            stockData.setDate(columns[1].trim());
            stockData.setLastTransactionPrice(parseNumeric(columns[2]));
            stockData.setMaxPrice(parseNumeric(columns[3]));
            stockData.setMinPrice(parseNumeric(columns[4]));
            stockData.setAvgPrice(parseNumeric(columns[5]));
            stockData.setPercentageChange(parseNumeric(columns[6]));
            stockData.setQuantity(parseNumeric(columns[7]));
            stockData.setTurnover(parseNumeric(columns[8]));
            stockData.setTotalTurnover(parseNumeric(columns[9]));
            return stockData;
        } catch (Exception e) {
            System.err.println("Error parsing row: " + String.join(",", columns));
            e.printStackTrace();
            return null;
        }
    }

    private double parseNumeric(String value) {
        if (value == null || value.isBlank()) {
            return 0.0;
        }
        return Double.parseDouble(value.trim().replace(".", "").replace(",", "."));
    }
}
