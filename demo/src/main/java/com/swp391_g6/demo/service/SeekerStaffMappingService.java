package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.repository.SeekerStaffMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class SeekerStaffMappingService {

    @Autowired
    private SeekerStaffMappingRepository mappingRepository;

    public SeekerStaffMapping assignStaffToSeeker(String seekerId, String staffId) {
        SeekerStaffMapping mapping = new SeekerStaffMapping(seekerId, staffId, new Timestamp(System.currentTimeMillis()));
        return mappingRepository.save(mapping);
    }

    public SeekerStaffMapping getMappingBySeeker(String seekerId) {
        return mappingRepository.findBySeekerId(seekerId);
    }

    public List<SeekerStaffMapping> getMappingsByStaff(String staffId) {
        return mappingRepository.findByStaffId(staffId);
    }

    public void removeMapping(String seekerId) {
        mappingRepository.deleteBySeekerId(seekerId);
    }
}