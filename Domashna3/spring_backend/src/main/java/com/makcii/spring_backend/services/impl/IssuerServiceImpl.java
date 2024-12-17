package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.Issuer;
import com.makcii.spring_backend.repository.IssuerRepository;
import com.makcii.spring_backend.services.IssuerService;
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
