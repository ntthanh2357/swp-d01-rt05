package com.swp391_g6.demo.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.swp391_g6.demo.service.MyUserDetailsService;
import com.swp391_g6.demo.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("=== JWT Filter Processing ===");
        System.out.println("Request URI: " + path);
        System.out.println("Request method: " + request.getMethod());

        // Skip JWT processing for auth endpoints
        if (path.startsWith("/api/auth/")) {
            System.out.println("Skipping JWT processing for auth endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            email = jwtUtil.extractEmail(jwt);
            System.out.println("Found Bearer token, extracted email: " + email);
        } else {
            System.out.println("No Bearer token found in Authorization header");
            System.out.println("Authorization header: " + authHeader);
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                System.out.println("Processing JWT for email: " + email);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                System.out.println("UserDetails authorities: " + userDetails.getAuthorities());

                if (jwtUtil.validateToken(jwt)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentication set successfully");
                } else {
                    System.out.println("JWT token validation failed");
                }
            } catch (Exception e) {
                // Log the error but don't block the request
                System.err.println("Error processing JWT token: " + e.getMessage());
                e.printStackTrace();
            }
        }

        filterChain.doFilter(request, response);
    }

}
