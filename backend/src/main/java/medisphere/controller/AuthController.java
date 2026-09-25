package medisphere.controller;

import medisphere.dto.LoginRequest;
import medisphere.dto.LoginResponse;
import medisphere.service.AuthService;
import org.springframework.web.bind.annotation.*;

import medisphere.dto.RegisterRequest;
import medisphere.dto.RegisterResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(
                request.getUsername(),
                request.getPassword()
        );
    }

    @PostMapping("/register")
    public RegisterResponse register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }
}