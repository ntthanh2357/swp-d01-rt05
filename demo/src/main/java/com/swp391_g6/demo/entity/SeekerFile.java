package com.swp391_g6.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seeker_files")
public class SeekerFile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;
    
    @Column(name = "seeker_id", nullable = false)
    private String seekerId;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "original_name", nullable = false)
    private String originalName;
    
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private FileCategory category;
    
    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate;
    
    @Column(name = "status")
    private String status = "active";
    
    public enum FileCategory {
        LANGUAGE_CERTS("language_certs"),
        PERSONAL_DOCS("personal_docs"), 
        ACADEMIC_DOCS("academic_docs");
        
        private final String value;
        
        FileCategory(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
    
    // Constructors
    public SeekerFile() {}
    
    public SeekerFile(String seekerId, String fileName, String originalName, String filePath, 
                     Long fileSize, String fileType, FileCategory category) {
        this.seekerId = seekerId;
        this.fileName = fileName;
        this.originalName = originalName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.category = category;
        this.uploadDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getFileId() { return fileId; }
    public void setFileId(Long fileId) { this.fileId = fileId; }
    
    public String getSeekerId() { return seekerId; }
    public void setSeekerId(String seekerId) { this.seekerId = seekerId; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public FileCategory getCategory() { return category; }
    public void setCategory(FileCategory category) { this.category = category; }
    
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
