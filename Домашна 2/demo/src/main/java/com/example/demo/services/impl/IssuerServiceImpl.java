package com.example.demo.services.impl;

import com.example.demo.repository.IssuerRepository;
import com.example.demo.services.IssuerService;
import org.springframework.stereotype.Service;

@Service
public class IssuerServiceImpl implements IssuerService {

    private final IssuerRepository issuerRepository;

    public IssuerServiceImpl(IssuerRepository issuerRepository) {
        this.issuerRepository = issuerRepository;
    }
}
