package com.swp391_g6.demo.repository;

import com.swp391_g6.demo.entity.SeekerFile;
import com.swp391_g6.demo.entity.SeekerFile.FileCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeekerFileRepository extends JpaRepository<SeekerFile, Long> {
    
    List<SeekerFile> findBySeekerIdAndStatus(String seekerId, String status);
    
    List<SeekerFile> findBySeekerIdAndCategoryAndStatus(String seekerId, FileCategory category, String status);
    
    void deleteBySeekerIdAndFileId(String seekerId, Long fileId);
    
    SeekerFile findBySeekerIdAndFileId(String seekerId, Long fileId);
}
