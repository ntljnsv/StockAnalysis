package com.makcii.spring_backend.services;

import com.makcii.spring_backend.model.Issuer;

import java.util.List;

public interface IssuerService {
    List<Issuer> listAllIssuers();
    Issuer getIssuerByName(String name);
}
