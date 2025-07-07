package com.swp391_g6.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class IdGenerator {

    @Id
    private String name;

    private long currentValue;

    public IdGenerator() {
    }

    public IdGenerator(String name, long currentValue) {
        this.name = name;
        this.currentValue = currentValue;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(long currentValue) {
        this.currentValue = currentValue;
    }

}
