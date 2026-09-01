package com.healthcare.management.service;

import com.healthcare.management.dto.AuthResponse;
import com.healthcare.management.dto.LoginRequest;
import com.healthcare.management.dto.UserDto;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    UserDto registerUser(UserDto userDto);
}
