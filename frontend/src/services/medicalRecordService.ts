import api from './api';
import { MedicalRecordDto, PrescriptionDto } from '../types';

export const medicalRecordService = {
  addMedicalRecord: async (record: MedicalRecordDto): Promise<MedicalRecordDto> => {
    const response = await api.post<MedicalRecordDto>('/medical-records', record);
    return response.data;
  },
  getMedicalRecordsByPatient: async (patientId: number): Promise<MedicalRecordDto[]> => {
    const response = await api.get<MedicalRecordDto[]>(`/medical-records/patient/${patientId}`);
    return response.data;
  },
  addPrescription: async (prescription: PrescriptionDto): Promise<PrescriptionDto> => {
    const response = await api.post<PrescriptionDto>('/prescriptions', prescription);
    return response.data;
  },
};
