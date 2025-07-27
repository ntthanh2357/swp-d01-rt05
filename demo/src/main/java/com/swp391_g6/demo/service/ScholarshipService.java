package com.swp391_g6.demo.service;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.repository.ScholarshipRepository;

@Service
public class ScholarshipService {

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public List<Scholarship> getActiveScholarships() {
        return scholarshipRepository.findActiveScholarships();
    }

    public List<Scholarship> getAllScholarships() {
        return scholarshipRepository.findAll();
    }

    public Scholarship getScholarshipById(String scholarshipId) {
        return scholarshipRepository.findById(scholarshipId)
                .orElseThrow(() -> new IllegalArgumentException("Scholarship not found with id: " + scholarshipId));
    }

    public Scholarship addScholarship(String title, String description, String organizationName, String categoryId,
            Double amount, String currency, Integer duration, Date applicationDeadline,
            String eligibilityCriteria, String countries, String educationLevels, String fieldsOfStudy,
            String createdBy, String applicableIntake, String fundingType, Integer viewsCount,
            String languageRequirements) {

        String scholarshipId = idGeneratorService.generateScholarshipId();
        Scholarship scholarship = new Scholarship();
        scholarship.setScholarshipId(scholarshipId);
        scholarship.setTitle(title);
        scholarship.setDescription(description);
        scholarship.setOrganization(organizationService.getOrganizationByName(organizationName));
        scholarship.setCategoryId(categoryId);
        scholarship.setAmount(amount);
        scholarship.setCurrency(currency);
        scholarship.setDuration(duration);
        scholarship.setApplicationDeadline(applicationDeadline);
        scholarship.setEligibilityCriteria(eligibilityCriteria);
        scholarship.setCountries(countries);
        scholarship.setEducationLevels(educationLevels);
        scholarship.setFieldsOfStudy(fieldsOfStudy);
        scholarship.setCreatedBy(createdBy);

        // ✅ Gán các trường mới
        scholarship.setApplicableIntake(applicableIntake);
        scholarship.setFundingType(fundingType);
        scholarship.setViewsCount(viewsCount);
        scholarship.setLanguageRequirements(languageRequirements);

        return scholarshipRepository.save(scholarship);
    }

    public void updateScholarship(Scholarship scholarship) {
        scholarshipRepository.save(scholarship);
    }

    public void deleteScholarship(String scholarshipId) {
        scholarshipRepository.deleteById(scholarshipId);
    }

    public int countNewScholarships() {
        return scholarshipRepository.countNewScholarships();
    }
}
