package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.SeekerStaffMapping;
import com.swp391_g6.demo.entity.Staff;
import com.swp391_g6.demo.repository.SeekerStaffMappingRepository;
import com.swp391_g6.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Random;

@Service
public class SeekerStaffMappingService {

    @Autowired
    private SeekerStaffMappingRepository mappingRepository;

    @Autowired
    private StaffRepository staffRepository;

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

    /**
     * Random mapping seeker với một staff có sẵn
     * @param seekerId ID của seeker
     * @return SeekerStaffMapping object nếu thành công, null nếu không có staff nào
     */
    public SeekerStaffMapping randomAssignStaffToSeeker(String seekerId) {
        // Lấy tất cả staff có sẵn
        List<Staff> availableStaffs = staffRepository.findAll();
        
        if (availableStaffs.isEmpty()) {
            return null; // Không có staff nào
        }
        
        // Random chọn một staff
        Random random = new Random();
        Staff randomStaff = availableStaffs.get(random.nextInt(availableStaffs.size()));
        
        // Tạo mapping mới
        SeekerStaffMapping mapping = new SeekerStaffMapping(
            seekerId, 
            randomStaff.getStaffId(), 
            new Timestamp(System.currentTimeMillis())
        );
        
        // Set status là active
        mapping.setStatus(SeekerStaffMapping.Status.active);
        
        return mappingRepository.save(mapping);
    }

    /**
     * Kiểm tra xem seeker đã được mapping với staff nào chưa
     * @param seekerId ID của seeker
     * @return true nếu đã có mapping, false nếu chưa
     */
    public boolean hasExistingMapping(String seekerId) {
        return mappingRepository.findBySeekerId(seekerId) != null;
    }
}