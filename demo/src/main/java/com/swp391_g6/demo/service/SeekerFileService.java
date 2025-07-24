package com.swp391_g6.demo.service;

import com.swp391_g6.demo.entity.SeekerFile;
import com.swp391_g6.demo.entity.SeekerFile.FileCategory;
import com.swp391_g6.demo.repository.SeekerFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class SeekerFileService {
    
    @Autowired
    private SeekerFileRepository seekerFileRepository;
    
    @Value("${file.upload.directory:uploads/seeker-files}")
    private String uploadDirectory;
    
    public SeekerFile uploadFile(String seekerId, MultipartFile file, FileCategory category) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Save file to filesystem
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);
        
        // Save file info to database
        SeekerFile seekerFile = new SeekerFile(
            seekerId,
            uniqueFileName,
            originalFilename,
            filePath.toString(),
            file.getSize(),
            file.getContentType(),
            category
        );
        
        return seekerFileRepository.save(seekerFile);
    }
    
    public List<SeekerFile> getFilesBySeeker(String seekerId) {
        return seekerFileRepository.findBySeekerIdAndStatus(seekerId, "active");
    }
    
    public List<SeekerFile> getFilesBySeekerAndCategory(String seekerId, FileCategory category) {
        return seekerFileRepository.findBySeekerIdAndCategoryAndStatus(seekerId, category, "active");
    }
    
    public void deleteFile(String seekerId, Long fileId) throws IOException {
        SeekerFile file = seekerFileRepository.findBySeekerIdAndFileId(seekerId, fileId);
        if (file != null) {
            // Delete from filesystem
            Path filePath = Paths.get(file.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            
            // Mark as deleted in database
            file.setStatus("deleted");
            seekerFileRepository.save(file);
        }
    }
    
    public SeekerFile getFile(String seekerId, Long fileId) {
        return seekerFileRepository.findBySeekerIdAndFileId(seekerId, fileId);
    }
}
