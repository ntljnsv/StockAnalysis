package com.example.demo.services;

import java.io.IOException;

public interface CsvParserService {

    void parseAndSaveCsv(String filePath) throws IOException;
}
