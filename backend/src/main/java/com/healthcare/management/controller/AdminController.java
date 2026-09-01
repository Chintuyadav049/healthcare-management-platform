package com.healthcare.management.controller;

import com.healthcare.management.dto.UserDto;
import com.healthcare.management.entity.Department;
import com.healthcare.management.entity.Specialization;
import com.healthcare.management.entity.User;
import com.healthcare.management.repository.DepartmentRepository;
import com.healthcare.management.repository.SpecializationRepository;
import com.healthcare.management.repository.UserRepository;
import com.healthcare.management.mapper.Mapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> dtos = users.stream().map(Mapper::toUserDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists.");
        }
        User user = Mapper.toUser(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        User saved = userRepository.save(user);
        return new ResponseEntity<>(Mapper.toUserDto(saved), HttpStatus.CREATED);
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestParam("name") String name) {
        if (departmentRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("Department already exists.");
        }
        Department dept = Department.builder().name(name).build();
        Department saved = departmentRepository.save(dept);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/specializations")
    public ResponseEntity<Specialization> createSpecialization(@RequestParam("name") String name) {
        if (specializationRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("Specialization already exists.");
        }
        Specialization spec = Specialization.builder().name(name).build();
        Specialization saved = specializationRepository.save(spec);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
