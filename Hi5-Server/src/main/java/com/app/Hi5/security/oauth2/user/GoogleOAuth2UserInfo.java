package com.app.Hi5.security.oauth2.user;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class GoogleOAuth2UserInfo extends OAuth2UserInfo {

    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
        log.info("GoogleOAuth2UserInfo instantiated with attributes: {}", attributes);
    }

    @Override
    public String getId() {
        String id = (String) attributes.get("sub");
        log.debug("Retrieved Google user ID: {}", id);
        return id;
    }

    @Override
    public String getName() {
        String name = (String) attributes.get("name");
        log.debug("Retrieved Google user name: {}", name);
        return name;
    }

    @Override
    public String getEmail() {
        String email = (String) attributes.get("email");
        log.debug("Retrieved Google user email: {}", email);
        return email;
    }

    @Override
    public String getImageUrl() {
        String imageUrl = (String) attributes.get("picture");
        log.debug("Retrieved Google user image URL: {}", imageUrl);
        return imageUrl;
    }
}
