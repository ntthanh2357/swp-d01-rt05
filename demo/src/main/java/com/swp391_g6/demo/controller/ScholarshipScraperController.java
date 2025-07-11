package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.service.ScholarshipService;
import com.swp391_g6.demo.util.JwtUtil;
import com.swp391_g6.demo.entity.User;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/scholarship-scraper")
public class ScholarshipScraperController {

    @Autowired
    private ScholarshipService scholarshipService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/scrape-and-save")
    public Map<String, Object> scrapeAndSave(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        String token = body.get("token");
        Map<String, Object> result = new HashMap<>();

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null || !"admin".equals(user.getRole())) {
            result.put("error", "Access denied");
            return result;
        }

        try {
            Document doc = Jsoup.connect(url).get();
            String title = doc.title();
            String description = doc.select("meta[name=description]").attr("content");

            Scholarship scholarship = new Scholarship();
            scholarship.setTitle(title);
            scholarship.setDescription(description);
            scholarship.setCreatedBy(user.getUserId());
            // Set other fields as needed, or let admin edit after scraping

            Scholarship saved = scholarshipService.addScholarship(scholarship);
            result.put("scholarship", saved);
        } catch (IOException e) {
            result.put("error", "Failed to fetch or parse the page.");
        }
        return result;
    }
}