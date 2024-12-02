package com.example.demo.services.impl;

import com.example.demo.model.Issuer;
import com.example.demo.repository.IssuerRepository;
import com.example.demo.services.IssuerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssuerServiceImpl implements IssuerService {

    private final IssuerRepository issuerRepository;

    public IssuerServiceImpl(IssuerRepository issuerRepository) {
        this.issuerRepository = issuerRepository;
    }

    @Override
    public List<Issuer> listAllIssuers() {
        return issuerRepository.findAll();
    }

    @Override
    public Issuer getIssuerByName(String name) {
        return issuerRepository.findById(name).orElse(null);
    }
}
