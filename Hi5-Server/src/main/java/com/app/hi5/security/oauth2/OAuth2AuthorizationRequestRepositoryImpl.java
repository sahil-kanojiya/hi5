package com.app.hi5.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OAuth2AuthorizationRequestRepositoryImpl
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private final Map<String, OAuth2AuthorizationRequest> requestStore = new ConcurrentHashMap<>();

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        String state = request.getParameter("state");
        if (state != null) {
            log.info("Loading OAuth2AuthorizationRequest for state: {}", state);
            return requestStore.get(state);
        }
        return null;
    }

    @Override
    public void saveAuthorizationRequest(
            OAuth2AuthorizationRequest authorizationRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        if (authorizationRequest != null) {
            log.info(
                    "Saving OAuth2AuthorizationRequest for state: {}",
                    authorizationRequest.getState());
            requestStore.put(authorizationRequest.getState(), authorizationRequest);
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(
            HttpServletRequest request, HttpServletResponse response) {
        String state = request.getParameter("state");
        if (state != null) {
            log.info("Removing OAuth2AuthorizationRequest for state: {}", state);
            return requestStore.remove(state);
        }
        return null;
    }
}
