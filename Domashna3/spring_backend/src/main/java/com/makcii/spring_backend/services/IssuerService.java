package com.makcii.spring_backend.services;

import com.makcii.spring_backend.model.Issuer;
import com.makcii.spring_backend.model.dto.IssuerPriceDto;
import com.makcii.spring_backend.model.dto.IssuerStatsDto;

import java.util.List;
import java.util.Map;

public interface IssuerService {
    List<Issuer> listAllIssuers();
    Issuer getIssuerByName(String name);
    List<IssuerPriceDto> getIssuersAndLatestPrices(String searchTerm);
    Map<String, List<IssuerStatsDto>> getTopLatestIssuers();
}
