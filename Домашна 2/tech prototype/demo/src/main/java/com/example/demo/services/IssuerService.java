package com.example.demo.services;

import com.example.demo.model.Issuer;

import java.util.List;

public interface IssuerService {
    List<Issuer> listAllIssuers();
    Issuer getIssuerByName(String name);
}
