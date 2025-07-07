package com.swp391_g6.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.entity.User;

public interface SeekerRepository extends JpaRepository<Seeker, String> {

    Seeker findByUser(User user);
}
