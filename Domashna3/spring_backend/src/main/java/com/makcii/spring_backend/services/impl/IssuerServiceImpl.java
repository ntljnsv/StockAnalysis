package com.makcii.spring_backend.services.impl;

import com.makcii.spring_backend.model.Issuer;
import com.makcii.spring_backend.model.dto.IssuerPriceDto;
import com.makcii.spring_backend.model.dto.IssuerStatsDto;
import com.makcii.spring_backend.repository.IssuerRepository;
import com.makcii.spring_backend.services.IssuerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Override
    public List<IssuerPriceDto> getIssuersAndLatestPrices(String searchTerm) {

        return issuerRepository.searchIssuersByNameContaining(searchTerm);
    }

    @Override
    public Map<String, List<IssuerStatsDto>> getTopIssuersYesterday() {
        Map<String, List<IssuerStatsDto>> topIssuers = new HashMap<>();
        Pageable top10 = PageRequest.of(0, 10);

        List<IssuerStatsDto> highestPrices = issuerRepository.getTopIssuersByHighestPriceYesterday(top10);
        List<IssuerStatsDto> lowestPrices = issuerRepository.getTopIssuersByLowestPriceYesterday(top10);
        List<IssuerStatsDto> highestVolume = issuerRepository.getTopIssuersByHighestVolumeYesterday(top10);

        topIssuers.put("highestPrices", highestPrices);
        topIssuers.put("lowestPrices", lowestPrices);
        topIssuers.put("highestVolume", highestVolume);

        return topIssuers;
    }


}
