package com.app.Hi5.security;

import com.app.Hi5.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        try {
            System.out.println("Access Denied Exception: " + accessDeniedException.getMessage());

            UsernamePasswordAuthenticationToken token =
                    (UsernamePasswordAuthenticationToken) request.getUserPrincipal();
            UserDetailsImpl userDetails = (UserDetailsImpl) token.getPrincipal();
            User user = userDetails.getUser();

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");

            if (!userDetails.isAccountNonLocked()) {
                Date banUntil = user.getBanUntil();
                System.out.println("User is banned until: " + banUntil);

                SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
                isoFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
                String formattedDate = isoFormat.format(banUntil);

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("error", "Access Denied");
                responseBody.put("message", "Your account is banned.");
                responseBody.put("banUntil", formattedDate);

                response.setContentType("application/json");
                response.getWriter().write(objectMapper.writeValueAsString(responseBody));
                //                response.getWriter().write("{\"error\": \"Access Denied\",
                // \"message\": \"Your account is banned.\", \"banUntil\": \"" + banUntil + "\"}");
            } else {
                response.getWriter().write("{\"error\": \"Access Denied\"}");
            }
        } catch (Exception ex) {
            System.out.println("Failed to retrieve user details: " + ex.getMessage());

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Access Denied\"}");
        }
    }
}
