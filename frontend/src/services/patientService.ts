import api from './api';
import { PatientDto } from '../types';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const patientService = {
  getPatients: async (query = '', status = '', page = 0, size = 10): Promise<PageResponse<PatientDto>> => {
    const response = await api.get<PageResponse<PatientDto>>('/patients', {
      params: { query, status, page, size },
    });
    return response.data;
  },
  getPatientById: async (id: number): Promise<PatientDto> => {
    const response = await api.get<PatientDto>(`/patients/${id}`);
    return response.data;
  },
  createPatient: async (patient: PatientDto): Promise<PatientDto> => {
    const response = await api.post<PatientDto>('/patients', patient);
    return response.data;
  },
  updatePatient: async (id: number, patient: PatientDto): Promise<PatientDto> => {
    const response = await api.put<PatientDto>(`/patients/${id}`, patient);
    return response.data;
  },
  deletePatient: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};
