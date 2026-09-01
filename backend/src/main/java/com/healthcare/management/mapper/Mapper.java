package com.healthcare.management.mapper;

import com.healthcare.management.dto.*;
import com.healthcare.management.entity.*;
import java.util.ArrayList;
import java.util.stream.Collectors;

public class Mapper {

    public static UserDto toUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .gender(user.getGender())
                .role(user.getRole().name())
                .build();
    }

    public static User toUser(UserDto dto) {
        if (dto == null) return null;
        User user = new User();
        user.setId(dto.getId());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        if (dto.getRole() != null) {
            user.setRole(Role.valueOf(dto.getRole()));
        }
        return user;
    }

    public static PatientDto toPatientDto(Patient patient) {
        if (patient == null) return null;
        return PatientDto.builder()
                .id(patient.getId())
                .userId(patient.getUser() != null ? patient.getUser().getId() : null)
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .phone(patient.getPhone())
                .email(patient.getEmail())
                .address(patient.getAddress())
                .emergencyContact(patient.getEmergencyContact())
                .registrationDate(patient.getRegistrationDate())
                .medicalHistory(patient.getMedicalHistory())
                .allergies(patient.getAllergies())
                .status(patient.getStatus())
                .build();
    }

    public static Patient toPatient(PatientDto dto) {
        if (dto == null) return null;
        Patient patient = new Patient();
        patient.setId(dto.getId());
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setRegistrationDate(dto.getRegistrationDate());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setAllergies(dto.getAllergies());
        patient.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        return patient;
    }

    public static DoctorDto toDoctorDto(Doctor doctor) {
        if (doctor == null) return null;
        return DoctorDto.builder()
                .id(doctor.getId())
                .userId(doctor.getUser().getId())
                .firstName(doctor.getUser().getFirstName())
                .lastName(doctor.getUser().getLastName())
                .email(doctor.getUser().getEmail())
                .phone(doctor.getUser().getPhone())
                .gender(doctor.getUser().getGender())
                .specializationId(doctor.getSpecialization().getId())
                .specializationName(doctor.getSpecialization().getName())
                .departmentId(doctor.getDepartment().getId())
                .departmentName(doctor.getDepartment().getName())
                .licenseNumber(doctor.getLicenseNumber())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .consultationFee(doctor.getConsultationFee())
                .availabilityStatus(doctor.getAvailabilityStatus())
                .build();
    }

    public static Doctor toDoctor(DoctorDto dto, Specialization spec, Department dept) {
        if (dto == null) return null;
        Doctor doctor = new Doctor();
        doctor.setId(dto.getId());
        doctor.setSpecialization(spec);
        doctor.setDepartment(dept);
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setQualification(dto.getQualification());
        doctor.setExperience(dto.getExperience());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setAvailabilityStatus(dto.getAvailabilityStatus() != null ? dto.getAvailabilityStatus() : "AVAILABLE");
        return doctor;
    }

    public static AppointmentDto toAppointmentDto(Appointment appt) {
        if (appt == null) return null;
        return AppointmentDto.builder()
                .id(appt.getId())
                .patientId(appt.getPatient().getId())
                .patientName(appt.getPatient().getFirstName() + " " + appt.getPatient().getLastName())
                .doctorId(appt.getDoctor().getId())
                .doctorName("Dr. " + appt.getDoctor().getUser().getFirstName() + " " + appt.getDoctor().getUser().getLastName())
                .appointmentDate(appt.getAppointmentDate())
                .appointmentTime(appt.getAppointmentTime())
                .reason(appt.getReason())
                .notes(appt.getNotes())
                .status(appt.getStatus())
                .createdAt(appt.getCreatedAt())
                .build();
    }

    public static Appointment toAppointment(AppointmentDto dto, Patient patient, Doctor doctor) {
        if (dto == null) return null;
        Appointment appt = new Appointment();
        appt.setId(dto.getId());
        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setAppointmentDate(dto.getAppointmentDate());
        appt.setAppointmentTime(dto.getAppointmentTime());
        appt.setReason(dto.getReason());
        appt.setNotes(dto.getNotes());
        appt.setStatus(dto.getStatus() != null ? dto.getStatus() : "BOOKED");
        return appt;
    }

    public static ClinicalOperationDto toClinicalOperationDto(ClinicalOperation op) {
        if (op == null) return null;
        String docName = op.getDoctor() != null ? "Dr. " + op.getDoctor().getUser().getFirstName() + " " + op.getDoctor().getUser().getLastName() : "Unassigned";
        return ClinicalOperationDto.builder()
                .id(op.getId())
                .patientId(op.getPatient().getId())
                .patientName(op.getPatient().getFirstName() + " " + op.getPatient().getLastName())
                .patientGender(op.getPatient().getGender())
                .patientDob(op.getPatient().getDateOfBirth().toString())
                .doctorId(op.getDoctor() != null ? op.getDoctor().getId() : null)
                .doctorName(docName)
                .appointmentId(op.getAppointment() != null ? op.getAppointment().getId() : null)
                .tokenNumber(op.getTokenNumber())
                .status(op.getStatus())
                .checkInTime(op.getCheckInTime())
                .dischargeTime(op.getDischargeTime())
                .build();
    }

    public static MedicalRecordDto toMedicalRecordDto(MedicalRecord mr) {
        if (mr == null) return null;
        return MedicalRecordDto.builder()
                .id(mr.getId())
                .patientId(mr.getPatient().getId())
                .patientName(mr.getPatient().getFirstName() + " " + mr.getPatient().getLastName())
                .doctorId(mr.getDoctor().getId())
                .doctorName("Dr. " + mr.getDoctor().getUser().getFirstName() + " " + mr.getDoctor().getUser().getLastName())
                .appointmentId(mr.getAppointment() != null ? mr.getAppointment().getId() : null)
                .diagnosis(mr.getDiagnosis())
                .symptoms(mr.getSymptoms())
                .treatment(mr.getTreatment())
                .notes(mr.getNotes())
                .recordDate(mr.getRecordDate())
                .prescriptions(new ArrayList<>())
                .build();
    }

    public static MedicalRecord toMedicalRecord(MedicalRecordDto dto, Patient patient, Doctor doctor, Appointment appt) {
        if (dto == null) return null;
        MedicalRecord mr = new MedicalRecord();
        mr.setId(dto.getId());
        mr.setPatient(patient);
        mr.setDoctor(doctor);
        mr.setAppointment(appt);
        mr.setDiagnosis(dto.getDiagnosis());
        mr.setSymptoms(dto.getSymptoms());
        mr.setTreatment(dto.getTreatment());
        mr.setNotes(dto.getNotes());
        mr.setRecordDate(dto.getRecordDate());
        return mr;
    }

    public static PrescriptionDto toPrescriptionDto(Prescription rx) {
        if (rx == null) return null;
        return PrescriptionDto.builder()
                .id(rx.getId())
                .patientId(rx.getPatient().getId())
                .patientName(rx.getPatient().getFirstName() + " " + rx.getPatient().getLastName())
                .doctorId(rx.getDoctor().getId())
                .doctorName("Dr. " + rx.getDoctor().getUser().getFirstName() + " " + rx.getDoctor().getUser().getLastName())
                .medicalRecordId(rx.getMedicalRecord().getId())
                .medicineName(rx.getMedicineName())
                .dosage(rx.getDosage())
                .frequency(rx.getFrequency())
                .duration(rx.getDuration())
                .instructions(rx.getInstructions())
                .build();
    }
}
