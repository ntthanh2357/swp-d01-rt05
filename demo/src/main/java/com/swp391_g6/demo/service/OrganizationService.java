package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.Organization;
import com.swp391_g6.demo.repository.OrganizationRepository;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

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

}
