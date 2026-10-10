package com.app.Hi5.security.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final String errorRedirectUrl;

    public OAuth2AuthenticationFailureHandler(
            @Value("${oauth2.error-redirect-url}") String errorRedirectUrl) {
        this.errorRedirectUrl = errorRedirectUrl;
    }

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception)
            throws IOException, ServletException {
        log.error("OAuth2 authentication failed: {}", exception.getMessage(), exception);

        String errorMessage =
                java.net.URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8);
        String redirectUrl = errorRedirectUrl + "?error=" + errorMessage;
        log.info("Redirecting user to: {}", redirectUrl);

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
