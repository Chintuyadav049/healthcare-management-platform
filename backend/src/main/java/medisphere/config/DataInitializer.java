package medisphere.config;

import medisphere.model.User;
import medisphere.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (userRepository.findByUsername("admin").isEmpty()) {
                userRepository.save(
                        new User(
                                "admin",
                                passwordEncoder.encode("admin123"),
                                "ADMIN"
                        )
                );
            }

            if (userRepository.findByUsername("doctor").isEmpty()) {
                userRepository.save(
                        new User(
                                "doctor",
                                passwordEncoder.encode("doctor123"),
                                "DOCTOR"
                        )
                );
            }

            if (userRepository.findByUsername("patient").isEmpty()) {
                userRepository.save(
                        new User(
                                "patient",
                                passwordEncoder.encode("patient123"),
                                "PATIENT"
                        )
                );
            }

            System.out.println("MediSphere users initialized successfully.");
        };
    }
}