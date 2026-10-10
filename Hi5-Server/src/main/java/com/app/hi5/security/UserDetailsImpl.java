package com.app.hi5.security;

import com.app.hi5.model.User;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Slf4j
@Data
@Builder
public class UserDetailsImpl implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        log.info("Fetching authorities for user: {}", user.getEmail());
        List<GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        log.info("Authorities for user {}: {}", user.getEmail(), authorities);
        return authorities;
    }

    @Override
    public String getUsername() {
        log.info("Fetching email:as username for user: {}", user.getEmail());
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        log.info("Fetching password for user: {}", user.getEmail());
        return user.getPassword();
    }

    @Override
    public boolean isEnabled() {
        boolean isEnabled = user.getIsActive();
        log.info("Checking if user {} is enabled: {}", user.getEmail(), isEnabled);
        return isEnabled;
    }

    @Override
    public boolean isAccountNonLocked() {
        boolean isAccountNonLocked =
                user.getBanUntil() == null || user.getBanUntil().before(new Date());
        log.info(
                "Checking if account for user {} is non-locked: {}",
                user.getEmail(),
                isAccountNonLocked);
        return isAccountNonLocked;
    }

    //    default support from spring boot security
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
