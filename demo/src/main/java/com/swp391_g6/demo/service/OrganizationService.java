package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.Organization;
import com.swp391_g6.demo.repository.OrganizationRepository;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Organization getOrganizationById(String organizationId) {
        return organizationRepository.findById(organizationId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found with id: " + organizationId));
    }

    public Organization getOrganizationByName(String name) {
        System.out.println("Searching for organization with name: " + name);
        return organizationRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found with name: " + name));
    }

    public List<Organization> searchOrganizations(String name, String country, String organizationType) {
        List<Organization> allOrganizations = organizationRepository.findAll();

        return allOrganizations.stream()
                .filter(org -> {
                    boolean matches = true;

                    if (name != null && !name.trim().isEmpty()) {
                        matches = matches && org.getName() != null &&
                                org.getName().toLowerCase().contains(name.toLowerCase());
                    }

                    if (country != null && !country.trim().isEmpty()) {
                        matches = matches && org.getCountry() != null &&
                                org.getCountry().toLowerCase().contains(country.toLowerCase());
                    }

                    if (organizationType != null && !organizationType.trim().isEmpty()) {
                        matches = matches && org.getOrganizationType() != null &&
                                org.getOrganizationType().toString().toLowerCase()
                                        .contains(organizationType.toLowerCase());
                    }

                    return matches;
                })
                .collect(Collectors.toList());
    }

}
