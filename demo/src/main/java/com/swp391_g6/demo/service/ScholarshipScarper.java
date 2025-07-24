package com.swp391_g6.demo.service;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.entity.Scholarship;

@Service
public class ScholarshipScarper {
    public Scholarship scrapeFromUrl(String url) throws IOException {
        Document doc = Jsoup.connect(url).get();
        String title = doc.title();
        String description = doc.select("meta[name=description]").attr("content");

        Scholarship scholarship = new Scholarship();
        scholarship.setTitle(title);
        scholarship.setDescription(description);
        // Set các trường khác nếu cần
        return scholarship;
    }
}
