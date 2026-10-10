package com.app.hi5.security;

import com.app.hi5.model.User;
import com.app.hi5.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Attempting to load user with email: {}", email);

        User user =
                userRepository
                        .findByEmailAndIsActiveTrue(email)
                        .orElseThrow(
                                () -> {
                                    log.warn("User with email '{}' not found", email);
                                    return new UsernameNotFoundException(
                                            "User with email '" + email + "' not found");
                                });

        log.debug("Successfully resolved user details for: {}", user.getUsername());
        log.info("Successfully loaded user with email: {}", email);
        return UserDetailsImpl.builder().user(user).build();
    }
}
