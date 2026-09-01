package com.healthcare.management.service;

import com.healthcare.management.dto.DoctorDto;
import com.healthcare.management.entity.Department;
import com.healthcare.management.entity.Specialization;
import java.util.List;

public interface DoctorService {
    DoctorDto createDoctor(DoctorDto doctorDto);
    DoctorDto updateDoctor(Long id, DoctorDto doctorDto);
    DoctorDto getDoctorById(Long id);
    void deleteDoctor(Long id);
    List<DoctorDto> getAllDoctors(String query);
    List<Specialization> getAllSpecializations();
    List<Department> getAllDepartments();
}
