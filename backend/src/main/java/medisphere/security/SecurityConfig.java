package medisphere.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Login is public
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // Patient APIs
                        .requestMatchers("/api/patients/**")
                        .hasAnyRole("ADMIN", "DOCTOR", "PATIENT")

                        // Health Twin APIs
                        .requestMatchers("/api/health-twins/**")
                        .hasAnyRole("ADMIN", "DOCTOR", "PATIENT")

                        // Vitals APIs
                        .requestMatchers("/api/vitals/**")
                        .hasAnyRole("ADMIN", "DOCTOR", "PATIENT")

                        // FHIR APIs
                        .requestMatchers("/api/fhir/**")
                        .hasAnyRole("ADMIN", "DOCTOR")

                        // Consent APIs
                        .requestMatchers("/api/consents/**")
                        .hasAnyRole("ADMIN", "DOCTOR", "PATIENT")

                        // Only ADMIN can manage doctors
                        .requestMatchers("/api/doctors/**")
                        .hasRole("ADMIN")

                        // Any remaining API
                        .requestMatchers("/api/**")
                        .authenticated()

                        .anyRequest()
                        .permitAll()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}