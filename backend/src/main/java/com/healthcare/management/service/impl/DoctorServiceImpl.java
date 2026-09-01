package com.healthcare.management.service.impl;

import com.healthcare.management.dto.DoctorDto;
import com.healthcare.management.entity.*;
import com.healthcare.management.exception.DuplicateResourceException;
import com.healthcare.management.exception.ResourceNotFoundException;
import com.healthcare.management.mapper.Mapper;
import com.healthcare.management.repository.*;
import com.healthcare.management.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public DoctorDto createDoctor(DoctorDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email is already registered: " + dto.getEmail());
        }
        if (doctorRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            throw new DuplicateResourceException("License number is already registered: " + dto.getLicenseNumber());
        }

        Specialization specialization = specializationRepository.findById(dto.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found with ID: " + dto.getSpecializationId()));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        // Create User account for Doctor
        User user = new User();
        user.setEmail(dto.getEmail());
        String rawPassword = (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) ? "doctor123" : dto.getPassword();
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setRole(Role.DOCTOR);

        // Associate user with doctor profile
        Doctor doctor = Mapper.toDoctor(dto, specialization, department);
        doctor.setUser(user);

        Doctor savedDoctor = doctorRepository.save(doctor);
        return Mapper.toDoctorDto(savedDoctor);
    }

    @Override
    @Transactional
    public DoctorDto updateDoctor(Long id, DoctorDto dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        // Check if email changed and is in use
        if (!doctor.getUser().getEmail().equalsIgnoreCase(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email is already registered: " + dto.getEmail());
        }

        // Check if license number changed and is in use
        if (!doctor.getLicenseNumber().equalsIgnoreCase(dto.getLicenseNumber()) && doctorRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            throw new DuplicateResourceException("License number is already registered: " + dto.getLicenseNumber());
        }

        Specialization specialization = specializationRepository.findById(dto.getSpecializationId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found with ID: " + dto.getSpecializationId()));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.getDepartmentId()));

        // Update User Details
        User user = doctor.getUser();
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Update Doctor Details
        doctor.setSpecialization(specialization);
        doctor.setDepartment(department);
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setQualification(dto.getQualification());
        doctor.setExperience(dto.getExperience());
        doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getAvailabilityStatus() != null) {
            doctor.setAvailabilityStatus(dto.getAvailabilityStatus());
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return Mapper.toDoctorDto(updatedDoctor);
    }

    @Override
    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        return Mapper.toDoctorDto(doctor);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        doctorRepository.delete(doctor);
    }

    @Override
    public List<DoctorDto> getAllDoctors(String query) {
        String searchQuery = (query == null || query.trim().isEmpty()) ? null : query.trim();
        List<Doctor> doctors = doctorRepository.searchDoctors(searchQuery);
        return doctors.stream().map(Mapper::toDoctorDto).collect(Collectors.toList());
    }

    @Override
    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
}
