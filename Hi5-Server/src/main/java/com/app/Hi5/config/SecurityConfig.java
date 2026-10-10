package com.app.Hi5.config;

import com.app.Hi5.filter.AuthTokenFilter;
import com.app.Hi5.security.AuthEntryPointHandler;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            BCryptPasswordEncoder passwordEncoder, UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource,
            AuthorizationRequestRepository<OAuth2AuthorizationRequest>
                    authorizationRequestRepository,
            DefaultOAuth2UserService oAuth2UserService,
            SimpleUrlAuthenticationSuccessHandler oauth2AuthenticationSuccessHandler,
            SimpleUrlAuthenticationFailureHandler oauth2AuthenticationFailureHandler,
            AuthTokenFilter authTokenFilter,
            AuthEntryPointHandler authenticationEntryPoint,
            AccessDeniedHandler accessDeniedHandler)
            throws Exception {
        http.cors(
                        httpSecurityCorsConfigurer ->
                                httpSecurityCorsConfigurer.configurationSource(
                                        corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        req ->
                                req.requestMatchers(
                                                "/oauth2/**",
                                                "/oauth2/authorization/**",
                                                "/oauth2/callback/**")
                                        .permitAll()
                                        .requestMatchers("/api/auth/**")
                                        .permitAll()
                                        .requestMatchers("/api/shared/**")
                                        .permitAll()
                                        .requestMatchers("/api/dummy/**")
                                        .permitAll()
                                        .requestMatchers("/hi5/ws", "/hi5/ws/**")
                                        .permitAll()
                                        .requestMatchers("/logo/**", "/resource/**")
                                        .permitAll()
                                        //
                                        // .requestMatchers("/**").permitAll()
                                        //
                                        // .requestMatchers("/error","/favicon.ico").permitAll()
                                        //
                                        // .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                        //
                                        // .requestMatchers("/actuator/**").hasRole("ADMIN")
                                        //
                                        // .requestMatchers("/resource/**").permitAll()
                                        //
                                        // .requestMatchers("/swagger-ui.html", "/v3/api-docs/**",
                                        // "/swagger-ui/**").permitAll()
                                        .anyRequest()
                                        .authenticated())
                .oauth2Login(
                        config ->
                                config.authorizationEndpoint(
                                                endpoint ->
                                                        endpoint.baseUri("/oauth2/authorize")
                                                                .authorizationRequestRepository(
                                                                        authorizationRequestRepository))
                                        .redirectionEndpoint(
                                                endpoint -> endpoint.baseUri("/oauth2/callback/*"))
                                        .userInfoEndpoint(
                                                userInfoEndpointConfig ->
                                                        userInfoEndpointConfig.userService(
                                                                oAuth2UserService))
                                        .successHandler(oauth2AuthenticationSuccessHandler)
                                        .failureHandler(oauth2AuthenticationFailureHandler))
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(
                        exception ->
                                exception
                                        .authenticationEntryPoint(authenticationEntryPoint)
                                        .accessDeniedHandler(accessDeniedHandler));
        return http.build();
    }
}
