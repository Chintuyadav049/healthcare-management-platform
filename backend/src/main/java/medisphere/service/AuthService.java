package medisphere.service;

import medisphere.dto.LoginResponse;
import medisphere.model.User;
import medisphere.repository.UserRepository;
import medisphere.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import medisphere.dto.RegisterResponse;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole()
        );
    }

    public RegisterResponse register(
            String username,
            String password,
            String role) {

        if (username == null || username.isBlank()) {
            throw new RuntimeException("Username is required");
        }

        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (role == null || role.isBlank()) {
            role = "PATIENT";
        }

        role = role.toUpperCase();

        if (!role.equals("PATIENT") && !role.equals("DOCTOR")) {
            throw new RuntimeException(
                    "Only PATIENT or DOCTOR registration is allowed"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(password);

        User user = new User(
                username,
                encodedPassword,
                role
        );

        userRepository.save(user);

        return new RegisterResponse(
                "User registered successfully",
                username,
                role
        );
    }
}