package com.healthcare.management.config;

import com.healthcare.management.entity.*;
import com.healthcare.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ClinicalOperationRepository clinicalOperationRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            // Already initialized
            return;
        }

        // 1. Initializing Specializations
        List<String> specNames = Arrays.asList(
                "General Physician", "Cardiologist", "Neurologist", "Dermatologist",
                "Orthopedic", "Pediatrician", "Gynecologist", "Dentist"
        );
        List<Specialization> specializations = new ArrayList<>();
        for (String sName : specNames) {
            Specialization spec = Specialization.builder().name(sName).build();
            specializations.add(specializationRepository.save(spec));
        }

        // 2. Initializing Departments
        List<String> deptNames = Arrays.asList(
                "General Medicine", "Cardiology", "Neurology", "Dermatology",
                "Orthopedics", "Pediatrics", "Gynecology", "Dental"
        );
        List<Department> departments = new ArrayList<>();
        for (String dName : deptNames) {
            Department dept = Department.builder().name(dName).build();
            departments.add(departmentRepository.save(dept));
        }

        // 3. Initializing Core Users
        User adminUser = User.builder()
                .email("admin@clinic.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .phone("555-0100")
                .gender("Male")
                .role(Role.ADMIN)
                .build();
        userRepository.save(adminUser);

        User receptionistUser = User.builder()
                .email("receptionist@clinic.com")
                .password(passwordEncoder.encode("receptionist123"))
                .firstName("Sarah")
                .lastName("Connor")
                .phone("555-0120")
                .gender("Female")
                .role(Role.RECEPTIONIST)
                .build();
        userRepository.save(receptionistUser);

        // 4. Initializing Doctors (Users + Profiles)
        // Doctor 1: Dr. Sarah Jenkins (Cardiologist, Cardiology)
        User doc1User = User.builder()
                .email("doctor1@clinic.com")
                .password(passwordEncoder.encode("doctor123"))
                .firstName("Sarah")
                .lastName("Jenkins")
                .phone("555-0111")
                .gender("Female")
                .role(Role.DOCTOR)
                .build();
        userRepository.save(doc1User);

        Doctor doctor1 = Doctor.builder()
                .user(doc1User)
                .specialization(specializations.get(1)) // Cardiologist
                .department(departments.get(1))       // Cardiology
                .licenseNumber("LIC-CAR-111")
                .qualification("MD, DM (Cardiology)")
                .experience(12)
                .consultationFee(BigDecimal.valueOf(150.00))
                .availabilityStatus("AVAILABLE")
                .build();
        doctorRepository.save(doctor1);

        // Doctor 2: Dr. Robert Chen (Neurologist, Neurology)
        User doc2User = User.builder()
                .email("doctor2@clinic.com")
                .password(passwordEncoder.encode("doctor123"))
                .firstName("Robert")
                .lastName("Chen")
                .phone("555-0112")
                .gender("Male")
                .role(Role.DOCTOR)
                .build();
        userRepository.save(doc2User);

        Doctor doctor2 = Doctor.builder()
                .user(doc2User)
                .specialization(specializations.get(2)) // Neurologist
                .department(departments.get(2))       // Neurology
                .licenseNumber("LIC-NEU-222")
                .qualification("MD, PhD (Neurology)")
                .experience(15)
                .consultationFee(BigDecimal.valueOf(180.00))
                .availabilityStatus("AVAILABLE")
                .build();
        doctorRepository.save(doctor2);

        // Doctor 3: Dr. Emily Taylor (Pediatrician, Pediatrics)
        User doc3User = User.builder()
                .email("doctor3@clinic.com")
                .password(passwordEncoder.encode("doctor123"))
                .firstName("Emily")
                .lastName("Taylor")
                .phone("555-0113")
                .gender("Female")
                .role(Role.DOCTOR)
                .build();
        userRepository.save(doc3User);

        Doctor doctor3 = Doctor.builder()
                .user(doc3User)
                .specialization(specializations.get(5)) // Pediatrician
                .department(departments.get(5))       // Pediatrics
                .licenseNumber("LIC-PED-333")
                .qualification("MD, DCH (Pediatrics)")
                .experience(8)
                .consultationFee(BigDecimal.valueOf(100.00))
                .availabilityStatus("AVAILABLE")
                .build();
        doctorRepository.save(doctor3);

        // 5. Initializing Patients
        List<Patient> patients = new ArrayList<>();
        
        // Patient 1: John Doe (Also has login User account)
        User pat1User = User.builder()
                .email("patient1@clinic.com")
                .password(passwordEncoder.encode("patient123"))
                .firstName("John")
                .lastName("Doe")
                .phone("555-0131")
                .gender("Male")
                .role(Role.PATIENT)
                .build();
        userRepository.save(pat1User);

        Patient patient1 = Patient.builder()
                .user(pat1User)
                .firstName("John")
                .lastName("Doe")
                .dateOfBirth(LocalDate.of(1988, 3, 15))
                .gender("Male")
                .bloodGroup("O+")
                .phone("555-0131")
                .email("patient1@clinic.com")
                .address("123 Maple Street, Cityville")
                .emergencyContact("Jane Doe - 555-0132")
                .registrationDate(LocalDate.now().minusDays(15))
                .medicalHistory("None")
                .allergies("Peanuts")
                .status("ACTIVE")
                .build();
        patients.add(patientRepository.save(patient1));

        // Create 9 other patients
        List<String> firstNames = Arrays.asList("Jane", "Michael", "Sarah", "David", "Emma", "James", "Linda", "Robert", "Patricia");
        List<String> lastNames = Arrays.asList("Smith", "Johnson", "Connor", "Miller", "Wilson", "Brown", "Davis", "Jones", "Garcia");
        List<String> emails = Arrays.asList(
                "jane.smith@email.com", "michael.j@email.com", "sarah.c@email.com",
                "david.m@email.com", "emma.w@email.com", "james.b@email.com",
                "linda.d@email.com", "robert.j@email.com", "patricia.g@email.com"
        );
        List<String> phoneNumbers = Arrays.asList(
                "555-0231", "555-0232", "555-0233", "555-0234", "555-0235", "555-0236", "555-0237", "555-0238", "555-0239"
        );
        List<String> genders = Arrays.asList("Female", "Male", "Female", "Male", "Female", "Male", "Female", "Male", "Female");
        List<String> bloodGroups = Arrays.asList("A+", "O-", "B+", "AB+", "O+", "A-", "B-", "O+", "A+");
        List<LocalDate> dobs = Arrays.asList(
                LocalDate.of(1990, 5, 12), LocalDate.of(1985, 8, 20), LocalDate.of(1978, 11, 5),
                LocalDate.of(1995, 2, 14), LocalDate.of(1988, 6, 25), LocalDate.of(1965, 3, 30),
                LocalDate.of(1972, 10, 18), LocalDate.of(1992, 4, 4), LocalDate.of(1980, 9, 9)
        );

        for (int i = 0; i < 9; i++) {
            Patient p = Patient.builder()
                    .firstName(firstNames.get(i))
                    .lastName(lastNames.get(i))
                    .dateOfBirth(dobs.get(i))
                    .gender(genders.get(i))
                    .bloodGroup(bloodGroups.get(i))
                    .phone(phoneNumbers.get(i))
                    .email(emails.get(i))
                    .address((200 + i) + " Oak Avenue, Townsville")
                    .emergencyContact("Emergency Contact - 555-999" + i)
                    .registrationDate(LocalDate.now().minusMonths(i + 1))
                    .medicalHistory("None")
                    .allergies(i % 3 == 0 ? "Dust" : "None")
                    .status("ACTIVE")
                    .build();
            patients.add(patientRepository.save(p));
        }

        // 6. Initializing Appointments (10)
        List<Appointment> appointments = new ArrayList<>();
        
        // Appt 1: John Doe (Patient 1) with Dr. Sarah Jenkins (Doc 1) today, COMPLETED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(0)).doctor(doctor1)
                .appointmentDate(LocalDate.now()).appointmentTime(LocalTime.of(9, 0))
                .reason("Chest tightness checkup").notes("Regular checkup").status("COMPLETED").build()));

        // Appt 2: Jane Smith with Doctor 1 today, CONFIRMED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(1)).doctor(doctor1)
                .appointmentDate(LocalDate.now()).appointmentTime(LocalTime.of(10, 0))
                .reason("Cardiac follow-up").notes("Excluding allergies").status("CONFIRMED").build()));

        // Appt 3: Michael Johnson with Doctor 2 today, BOOKED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(2)).doctor(doctor2)
                .appointmentDate(LocalDate.now()).appointmentTime(LocalTime.of(11, 30))
                .reason("Severe headache symptoms").notes("First consultation").status("BOOKED").build()));

        // Appt 4: Sarah Connor with Doctor 3 today, RESCHEDULED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(3)).doctor(doctor3)
                .appointmentDate(LocalDate.now()).appointmentTime(LocalTime.of(14, 0))
                .reason("Childhood vaccinations").notes("Rescheduled from yesterday").status("RESCHEDULED").build()));

        // Appt 5: David Miller with Doctor 2 yesterday, COMPLETED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(4)).doctor(doctor2)
                .appointmentDate(LocalDate.now().minusDays(1)).appointmentTime(LocalTime.of(15, 0))
                .reason("Chronic migraines").notes("Migraine diary review").status("COMPLETED").build()));

        // Appt 6: Emma Wilson with Doctor 1 yesterday, CANCELLED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(5)).doctor(doctor1)
                .appointmentDate(LocalDate.now().minusDays(1)).appointmentTime(LocalTime.of(11, 0))
                .reason("Arrhythmia screening").notes("Cancelled by patient").status("CANCELLED").build()));

        // Appt 7: James Brown with Doctor 3 tomorrow, BOOKED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(6)).doctor(doctor3)
                .appointmentDate(LocalDate.now().plusDays(1)).appointmentTime(LocalTime.of(10, 0))
                .reason("Pediatric checkup").notes("Regular school check").status("BOOKED").build()));

        // Appt 8: Linda Davis with Doctor 1 tomorrow, BOOKED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(7)).doctor(doctor1)
                .appointmentDate(LocalDate.now().plusDays(1)).appointmentTime(LocalTime.of(13, 30))
                .reason("Hypertension follow-up").notes("Review blood pressure logs").status("BOOKED").build()));

        // Appt 9: Robert Jones with Doctor 2 today, BOOKED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(8)).doctor(doctor2)
                .appointmentDate(LocalDate.now()).appointmentTime(LocalTime.of(16, 30))
                .reason("Numbness in hands").notes("Symptom onset 1 week ago").status("BOOKED").build()));

        // Appt 10: Patricia Garcia with Doctor 3 today, BOOKED
        appointments.add(appointmentRepository.save(Appointment.builder()
                .patient(patients.get(9)).doctor(doctor3)
                .appointmentDate(LocalDate.now()).appointmentTime(LocalTime.of(15, 30))
                .reason("Pediatric checkup").notes("Routine physical").status("BOOKED").build()));

        // 7. Initializing Clinical Operations Queue
        // WAITING: Michael Johnson
        clinicalOperationRepository.save(ClinicalOperation.builder()
                .patient(patients.get(2)).doctor(doctor2).appointment(appointments.get(2))
                .tokenNumber("T-001").status("WAITING").checkInTime(LocalDateTime.now().minusHours(2)).build());

        // CHECKED_IN: Jane Smith
        clinicalOperationRepository.save(ClinicalOperation.builder()
                .patient(patients.get(1)).doctor(doctor1).appointment(appointments.get(1))
                .tokenNumber("T-002").status("CHECKED_IN").checkInTime(LocalDateTime.now().minusMinutes(45)).build());

        // WITH_DOCTOR: Sarah Connor
        clinicalOperationRepository.save(ClinicalOperation.builder()
                .patient(patients.get(3)).doctor(doctor3).appointment(appointments.get(3))
                .tokenNumber("T-003").status("WITH_DOCTOR").checkInTime(LocalDateTime.now().minusMinutes(30)).build());

        // UNDER_TREATMENT: Robert Jones
        clinicalOperationRepository.save(ClinicalOperation.builder()
                .patient(patients.get(8)).doctor(doctor2).appointment(appointments.get(8))
                .tokenNumber("T-004").status("UNDER_TREATMENT").checkInTime(LocalDateTime.now().minusHours(1)).build());

        // COMPLETED: David Miller
        clinicalOperationRepository.save(ClinicalOperation.builder()
                .patient(patients.get(4)).doctor(doctor2).appointment(appointments.get(4))
                .tokenNumber("T-005").status("COMPLETED").checkInTime(LocalDateTime.now().minusHours(3))
                .dischargeTime(LocalDateTime.now().minusHours(2)).build());

        // 8. Initializing Medical Records & Prescriptions
        // Record 1: John Doe, 2026-08-10, Doctor 1 (Hypertension)
        MedicalRecord mr1 = medicalRecordRepository.save(MedicalRecord.builder()
                .patient(patients.get(0)).doctor(doctor1).appointment(appointments.get(0))
                .diagnosis("Essential Hypertension")
                .symptoms("Regular headaches, mild fatigue, blood pressure: 145/95")
                .treatment("Started Amlodipine 5mg once daily.")
                .notes("Advised sodium restriction and light daily cardiovascular exercise.")
                .recordDate(LocalDate.now().minusDays(11)).build());

        prescriptionRepository.save(Prescription.builder()
                .patient(patients.get(0)).doctor(doctor1).medicalRecord(mr1)
                .medicineName("Amlodipine")
                .dosage("5mg")
                .frequency("Once daily")
                .duration("30 days")
                .instructions("Take in the morning after breakfast.")
                .build());

        // Record 2: John Doe, 2026-08-15, Doctor 1 (Hypertension Follow-up)
        MedicalRecord mr2 = medicalRecordRepository.save(MedicalRecord.builder()
                .patient(patients.get(0)).doctor(doctor1).appointment(null)
                .diagnosis("Hypertension - Controlled")
                .symptoms("Headaches resolved. Blood pressure: 130/80")
                .treatment("Continue Amlodipine 5mg once daily.")
                .notes("Patient has adapted well to the dietary modifications.")
                .recordDate(LocalDate.now().minusDays(6)).build());

        prescriptionRepository.save(Prescription.builder()
                .patient(patients.get(0)).doctor(doctor1).medicalRecord(mr2)
                .medicineName("Amlodipine")
                .dosage("5mg")
                .frequency("Once daily")
                .duration("30 days")
                .instructions("Take in the morning after breakfast.")
                .build());

        // Record 3: David Miller, 2026-08-20, Doctor 2 (Migraines)
        MedicalRecord mr3 = medicalRecordRepository.save(MedicalRecord.builder()
                .patient(patients.get(4)).doctor(doctor2).appointment(appointments.get(4))
                .diagnosis("Migraine Headache with Aura")
                .symptoms("Throbbing unilateral headache, nausea, visual aura, photophobia")
                .treatment("Sumatriptan 50mg as needed.")
                .notes("Advised keeping a migraine triggers diary. Avoid known triggers like cheese, caffeine.")
                .recordDate(LocalDate.now().minusDays(1)).build());

        prescriptionRepository.save(Prescription.builder()
                .patient(patients.get(4)).doctor(doctor2).medicalRecord(mr3)
                .medicineName("Sumatriptan")
                .dosage("50mg")
                .frequency("As needed on headache onset")
                .duration("10 tablets")
                .instructions("Take at the first sign of migraine aura/headache. May repeat in 2 hours if needed.")
                .build());
    }
}
