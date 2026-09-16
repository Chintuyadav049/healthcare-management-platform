package medisphere.controller;

import medisphere.model.Doctor;
import medisphere.model.User;
import medisphere.repository.DoctorRepository;
import medisphere.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorController(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        if (doctor.getName() == null || doctor.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor name is required");
        }
        if (doctor.getSpecialization() == null || doctor.getSpecialization().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor specialization is required");
        }

        Doctor saved = doctorRepository.save(doctor);

        // Auto-provision user login account for the doctor
        String baseUsername;
        if (doctor.getEmail() != null && doctor.getEmail().contains("@")) {
            baseUsername = doctor.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-z0-9]", "");
        } else {
            baseUsername = doctor.getName().toLowerCase().replaceAll("\\s+", "").replaceAll("[^a-z0-9]", "");
        }

        if (baseUsername.isBlank()) {
            baseUsername = "doctor_" + (System.currentTimeMillis() % 10000);
        }

        if (userRepository.findByUsername(baseUsername).isEmpty()) {
            userRepository.save(new User(baseUsername, passwordEncoder.encode("doctor123"), "DOCTOR"));
        }

        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable String id) {
        doctorRepository.deleteById(id);
    }
}