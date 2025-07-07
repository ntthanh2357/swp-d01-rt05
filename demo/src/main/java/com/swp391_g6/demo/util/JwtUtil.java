package com.swp391_g6.demo.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

import org.springframework.stereotype.Component;

import com.swp391_g6.demo.entity.User;

@Component
public class JwtUtil {

    @org.springframework.beans.factory.annotation.Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    @org.springframework.beans.factory.annotation.Value("${jwt.secret.key}")
    private String SECRET_KEY;

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .claim("userId", user.getUserId())  // Thêm userId vào token
                .claim("name", user.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Thêm phương thức để lấy userId từ token
    public String getUserIdFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .get("userId", String.class);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public User extractUserFromToken(String token) {
        try {
            String userId = getUserIdFromToken(token);
            String email = extractEmail(token);
            String role = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .get("role", String.class);

            User user = new User();
            user.setEmail(email); 
            user.setRole(role);
            user.setUserId(userId);
            return user;
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String refreshToken(String token) {
        return null;
    }
}