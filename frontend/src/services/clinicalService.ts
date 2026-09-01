import api from './api';
import { ClinicalOperationDto } from '../types';

export const clinicalService = {
  getActiveQueue: async (): Promise<ClinicalOperationDto[]> => {
    const response = await api.get<ClinicalOperationDto[]>('/clinical/queue');
    return response.data;
  },
  checkInPatient: async (patientId: number, doctorId?: number, appointmentId?: number): Promise<ClinicalOperationDto> => {
    const response = await api.post<ClinicalOperationDto>('/clinical/check-in', null, {
      params: { patientId, doctorId, appointmentId },
    });
    return response.data;
  },
  updateStatus: async (id: number, status: string): Promise<ClinicalOperationDto> => {
    const response = await api.put<ClinicalOperationDto>(`/clinical/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
};
