package com.swp391_g6.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class FileUploadService {

    private final Cloudinary cloudinary;

    // File size limits (in bytes)
    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final long MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

    // Allowed file types
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif");

    private static final List<String> ALLOWED_DOCUMENT_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    public FileUploadService(@Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    public Map<String, Object> uploadFile(MultipartFile file, String userId) throws IOException {
        // Validate file
        validateFile(file);

        String fileType = getFileCategory(file.getContentType());

        System.out.println("File content type: " + file.getContentType());
        System.out.println("Detected file category: " + fileType);



        // Configure upload options
        Map<String, Object> uploadOptions = ObjectUtils.asMap(
                "folder", "chat/" + fileType + "s",
                "public_id", userId + "_" + System.currentTimeMillis(),
                "resource_type", fileType.equals("image") ? "image" : "raw");

        // Upload to Cloudinary
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);

        System.out.println("Upload successful. URL: " + uploadResult.get("secure_url"));

        // Return file info
        return Map.of(
                "fileUrl", uploadResult.get("secure_url").toString(),
                "fileName", file.getOriginalFilename(),
                "fileType", file.getContentType(),
                "fileSize", file.getSize(),
                "messageType", fileType, // Đảm bảo trả về đúng messageType
                "publicId", uploadResult.get("public_id").toString());
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("Không thể xác định loại file");
        }

        boolean isImage = ALLOWED_IMAGE_TYPES.contains(contentType);
        boolean isDocument = ALLOWED_DOCUMENT_TYPES.contains(contentType);

        if (!isImage && !isDocument) {
            throw new IllegalArgumentException("Loại file không được hỗ trợ: " + contentType);
        }

        long fileSize = file.getSize();
        if (isImage && fileSize > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Kích thước hình ảnh vượt quá 10MB");
        }

        if (isDocument && fileSize > MAX_DOCUMENT_SIZE) {
            throw new IllegalArgumentException("Kích thước tài liệu vượt quá 50MB");
        }
    }

    private String getFileCategory(String contentType) {
        System.out.println("Checking content type: " + contentType);

        if (ALLOWED_IMAGE_TYPES.contains(contentType)) {
            return "image";
        } else if (ALLOWED_DOCUMENT_TYPES.contains(contentType)) {
            return "document";
        }
        throw new IllegalArgumentException("Unsupported file type: " + contentType);
    }

    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            System.err.println("Error deleting file: " + e.getMessage());
        }
    }
}