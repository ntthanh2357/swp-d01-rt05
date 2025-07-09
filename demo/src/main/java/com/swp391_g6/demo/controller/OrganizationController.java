package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.dto.OrganizationDTO;
import com.swp391_g6.demo.service.OrganizationService;
import com.swp391_g6.demo.util.JwtUtil;
import com.swp391_g6.demo.entity.Organization;
import com.swp391_g6.demo.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // [POST] /api/organizations/get-active - Get active organizations (public)
    @PostMapping("/get-active")
    public ResponseEntity<?> getActiveOrganizations() {
        List<Organization> organizations = organizationService.getAllOrganizations();
        List<OrganizationDTO> dtos = organizations.stream()
                .map(OrganizationDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // [POST] /api/organizations/search - Search organizations
    @PostMapping("/search")
    public ResponseEntity<?> searchOrganizations(@RequestBody Map<String, String> searchCriteria) {
        String name = searchCriteria.get("name");
        String country = searchCriteria.get("country");
        String organizationType = searchCriteria.get("organizationType");

        List<Organization> organizations = organizationService.searchOrganizations(name, country, organizationType);
        List<OrganizationDTO> dtos = organizations.stream()
                .map(OrganizationDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<?> getAllOrganizationsPublic() {
        List<Organization> organizations = organizationService.getAllOrganizations();
        List<OrganizationDTO> dtos = organizations.stream().map(OrganizationDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrganizationById(@PathVariable("id") String id) {
        Organization org = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(new OrganizationDTO(org));
    }

}
