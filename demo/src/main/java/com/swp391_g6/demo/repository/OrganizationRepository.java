package com.swp391_g6.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swp391_g6.demo.entity.Organization;

import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, String> {

    Optional<Organization> findByName(String name);

}
