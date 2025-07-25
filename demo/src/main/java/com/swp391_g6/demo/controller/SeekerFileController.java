package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.entity.SeekerFile;
import com.swp391_g6.demo.entity.SeekerFile.FileCategory;
import com.swp391_g6.demo.service.SeekerFileService;
import com.swp391_g6.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seeker/files")
public class SeekerFileController {
    
    @Autowired
    private SeekerFileService seekerFileService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Upload file
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String categoryStr,
            HttpServletRequest request) {
        
        try {
            // Validate JWT
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Token không hợp lệ"));
            }
            
            final String jwt = authHeader.substring(7);
            final String userId = jwtUtil.getUserIdFromToken(jwt);
            
            if (userId == null || !jwtUtil.validateToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Token không hợp lệ"));
            }
            
            // Parse category
            FileCategory category;
            try {
                category = FileCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Category không hợp lệ"));
            }
            
            // Upload file
            SeekerFile savedFile = seekerFileService.uploadFile(userId, file, category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Upload file thành công");
            response.put("file", Map.of(
                "id", savedFile.getFileId(),
                "name", savedFile.getOriginalName(),
                "size", savedFile.getFileSize(),
                "type", savedFile.getFileType(),
                "category", savedFile.getCategory().getValue(),
                "uploadDate", savedFile.getUploadDate()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Lỗi khi upload file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Lỗi server: " + e.getMessage()));
        }
    }
    
    // Get files by seeker
    @GetMapping("/my-files")
    public ResponseEntity<?> getMyFiles(HttpServletRequest request) {
        try {
            // Validate JWT
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Token không hợp lệ"));
            }
            
            final String jwt = authHeader.substring(7);
            final String userId = jwtUtil.getUserIdFromToken(jwt);
            
            if (userId == null || !jwtUtil.validateToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Token không hợp lệ"));
            }
            
            List<SeekerFile> files = seekerFileService.getFilesBySeeker(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("files", files.stream().map(file -> Map.of(
                "id", file.getFileId(),
                "name", file.getOriginalName(),
                "size", file.getFileSize(),
                "type", file.getFileType(),
                "category", file.getCategory().getValue(),
                "uploadDate", file.getUploadDate()
            )).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Lỗi server: " + e.getMessage()));
        }
    }
    
    // Delete file
    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId, HttpServletRequest request) {
        try {
            // Validate JWT
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Token không hợp lệ"));
            }
            
            final String jwt = authHeader.substring(7);
            final String userId = jwtUtil.getUserIdFromToken(jwt);
            
            if (userId == null || !jwtUtil.validateToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Token không hợp lệ"));
            }
            
            seekerFileService.deleteFile(userId, fileId);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Xóa file thành công"));
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Lỗi khi xóa file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Lỗi server: " + e.getMessage()));
        }
    }
    
    // Download/view file
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId, HttpServletRequest request) {
        try {
            // Validate JWT
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            final String jwt = authHeader.substring(7);
            final String userId = jwtUtil.getUserIdFromToken(jwt);
            
            if (userId == null || !jwtUtil.validateToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            SeekerFile file = seekerFileService.getFile(userId, fileId);
            if (file == null) {
                return ResponseEntity.notFound().build();
            }
            
            Path filePath = Paths.get(file.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + file.getOriginalName() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
