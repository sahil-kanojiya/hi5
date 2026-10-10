package com.app.hi5.security.oauth2.user;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class GithubOAuth2UserInfo extends OAuth2UserInfo {

    public GithubOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
        log.info("GithubOAuth2UserInfo instantiated with attributes: {}", attributes);
    }

    @Override
    public String getId() {
        String id = (String) attributes.get("id");
        log.debug("Retrieved GitHub user ID: {}", id);
        return id;
    }

    @Override
    public String getName() {
        String name = (String) attributes.get("name");
        log.debug("Retrieved GitHub user name: {}", name);
        return name;
    }

    @Override
    public String getEmail() {
        String email = (String) attributes.get("email");
        log.debug("Retrieved GitHub user email: {}", email);
        return email;
    }

    @Override
    public String getImageUrl() {
        String imageUrl = (String) attributes.get("avatar_url");
        log.debug("Retrieved GitHub user avatar URL: {}", imageUrl);
        return imageUrl;
    }
}
