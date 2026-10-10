package com.app.Hi5.filter;

import com.app.Hi5.security.AuthTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {

    private final AuthTokenService authTokenService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            System.out.println("authHeader" + authHeader);
            token = authHeader.substring(7);
            System.out.println("token" + token);
            email = authTokenService.extractSub(token);
            log.info("Extracted token from request header, email: {}", email);
        } else {
            log.warn("Authorization header is missing or invalid in the request");
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Attempting to authenticate user with email: {}", email);

            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if (authTokenService.validateToken(token)) {
                    log.info("Token validated successfully for user: {}", email);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    log.debug("Authentication set for user: {}", email);
                } else {
                    log.warn("Invalid token for user: {}", email);
                }
            } catch (Exception e) {
                log.error("Error occurred while authenticating user {}: {}", email, e.getMessage());
            }
        } else {
            if (email == null) {
                log.warn("No email found in token for request");
            }
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                log.info("User is already authenticated: {}", email);
            }
        }

        filterChain.doFilter(request, response);
    }
}
