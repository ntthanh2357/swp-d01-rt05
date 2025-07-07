package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.service.OrganizationService;
import com.swp391_g6.demo.util.JwtUtil;
import com.swp391_g6.demo.entity.Organization;
import com.swp391_g6.demo.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OrganizationService organizationService;

    @PostMapping("/get-all")
    public ResponseEntity<?> getAllOrganizations(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            System.out.println("Token is required for user management");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        List<Organization> organizations = organizationService.getAllOrganizations();
        return ResponseEntity.ok(organizations);
    }

}
