package com.swp391_g6.demo.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.entity.IdGenerator;
import com.swp391_g6.demo.repository.IdGeneratorRepository;

@Service
public class IdGeneratorService {

    @Autowired
    private IdGeneratorRepository idGeneratorRepository;

    public String generateId(String type, boolean random, int length) {
        if (random) {
            return type + generateRandomNumber(length);
        } else {
            IdGenerator generator = idGeneratorRepository.findById(type)
                    .orElseGet(() -> {
                        IdGenerator g = new IdGenerator();
                        g.setName(type);
                        g.setCurrentValue(0);
                        return g;
                    });

            long nextValue = generator.getCurrentValue() + 1;
            generator.setCurrentValue(nextValue);
            idGeneratorRepository.save(generator);

            return type + String.format("%0" + length + "d", nextValue);
        }
    }

    private String generateRandomNumber(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }

        return sb.toString();
    }

    public String generateScholarshipId() {
        return generateId("SCHOLAR", false, 7);
    }
    
}
