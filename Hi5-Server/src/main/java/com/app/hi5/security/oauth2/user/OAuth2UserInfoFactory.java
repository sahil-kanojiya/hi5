package com.app.hi5.security.oauth2.user;

import com.app.hi5.exceptions.OAuth2AuthenticationProcessingException;
import com.app.hi5.model.enums.IdentityProvider;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(
            String registrationId, Map<String, Object> attributes) {
        log.info("OAuth2UserInfoFactory invoked.");
        log.debug("Registration ID: {}", registrationId);
        log.debug("Attributes: {}", attributes);

        if (registrationId.equalsIgnoreCase(IdentityProvider.GOOGLE.name())) {
            log.info("Creating GoogleOAuth2UserInfo for registration ID: {}", registrationId);
            return new GoogleOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase(IdentityProvider.GITHUB.name())) {
            log.info("Creating GithubOAuth2UserInfo for registration ID: {}", registrationId);
            return new GithubOAuth2UserInfo(attributes);
        } else {
            log.error("Unsupported registration ID: {}", registrationId);
            throw new OAuth2AuthenticationProcessingException(
                    "Sorry! Login with " + registrationId + " is not supported yet.");
        }
    }
}
