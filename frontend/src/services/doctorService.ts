import api from './api';
import { DoctorDto, Specialization, Department } from '../types';

export const doctorService = {
  getAllDoctors: async (query = ''): Promise<DoctorDto[]> => {
    const response = await api.get<DoctorDto[]>('/doctors', { params: { query } });
    return response.data;
  },
  getDoctorById: async (id: number): Promise<DoctorDto> => {
    const response = await api.get<DoctorDto>(`/doctors/${id}`);
    return response.data;
  },
  createDoctor: async (doctor: DoctorDto): Promise<DoctorDto> => {
    const response = await api.post<DoctorDto>('/doctors', doctor);
    return response.data;
  },
  updateDoctor: async (id: number, doctor: DoctorDto): Promise<DoctorDto> => {
    const response = await api.put<DoctorDto>(`/doctors/${id}`, doctor);
    return response.data;
  },
  deleteDoctor: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },
  getSpecializations: async (): Promise<Specialization[]> => {
    const response = await api.get<Specialization[]>('/doctors/specializations');
    return response.data;
  },
  getDepartments: async (): Promise<Department[]> => {
    const response = await api.get<Department[]>('/doctors/departments');
    return response.data;
  },
};
