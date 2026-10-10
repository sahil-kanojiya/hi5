package com.app.Hi5.security.oauth2;

import com.app.Hi5.model.User;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.security.AuthTokenService;
import com.app.Hi5.service.IdentificationTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthTokenService authTokenService;
    private final IdentificationTokenService identificationTokenService;
    private final UserRepository userRepository;
    private final String loginRedirectUrl;
    private final String signupRedirectUrl;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(
            AuthTokenService authTokenService,
            IdentificationTokenService identificationTokenService,
            UserRepository userRepository,
            @Value("${oauth2.login-redirect-url}") String loginRedirectUrl,
            @Value("${oauth2.signup-redirect-url}") String signupRedirectUrl) {
        this.authTokenService = authTokenService;
        this.identificationTokenService = identificationTokenService;
        this.userRepository = userRepository;
        this.loginRedirectUrl = loginRedirectUrl;
        this.signupRedirectUrl = signupRedirectUrl;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");
        log.info("Authentication successful for user with email: {}", email);

        Optional<User> user = userRepository.findByEmailAndIsActiveTrue(email);

        if (user.isPresent()) {
            log.info("Existing user found: {}", email);
            String token = authTokenService.generateToken(email);

            Cookie tokenCookie = new Cookie("Token", token);
            tokenCookie.setHttpOnly(true);
            tokenCookie.setSecure(true);
            tokenCookie.setPath("/");
            tokenCookie.setMaxAge(60 * 60);
            response.addCookie(tokenCookie);

            log.info("Generated auth token for user: {}", email);
            log.info("Redirecting user to login page with token.");
            getRedirectStrategy().sendRedirect(request, response, loginRedirectUrl.concat(token));
        } else {
            // New user
            log.info("New user detected, generating identification token.");
            String token =
                    identificationTokenService.generateToken(oAuth2User.getAttribute("email"));

            Cookie tokenCookie = new Cookie("Token", token);
            tokenCookie.setHttpOnly(true);
            tokenCookie.setSecure(true);
            tokenCookie.setPath("/");
            tokenCookie.setMaxAge(60 * 60);
            response.addCookie(tokenCookie);

            log.info("Generated identification token for new user: {}", email);
            log.info("Redirecting new user to signup page with token.");
            getRedirectStrategy().sendRedirect(request, response, signupRedirectUrl.concat(token));
        }
    }
}
