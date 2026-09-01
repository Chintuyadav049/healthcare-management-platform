import api from './api';
import { AppointmentDto } from '../types';

export const appointmentService = {
  getAppointments: async (filters: { doctorId?: number; patientId?: number; date?: string; status?: string }): Promise<AppointmentDto[]> => {
    const response = await api.get<AppointmentDto[]>('/appointments', { params: filters });
    return response.data;
  },
  getAppointmentById: async (id: number): Promise<AppointmentDto> => {
    const response = await api.get<AppointmentDto>(`/appointments/${id}`);
    return response.data;
  },
  bookAppointment: async (appointment: AppointmentDto): Promise<AppointmentDto> => {
    const response = await api.post<AppointmentDto>('/appointments', appointment);
    return response.data;
  },
  updateAppointment: async (id: number, appointment: AppointmentDto): Promise<AppointmentDto> => {
    const response = await api.put<AppointmentDto>(`/appointments/${id}`, appointment);
    return response.data;
  },
  updateStatus: async (id: number, status: string): Promise<AppointmentDto> => {
    const response = await api.put<AppointmentDto>(`/appointments/${id}/status`, null, { params: { status } });
    return response.data;
  },
  getDoctorAvailability: async (doctorId: number, date: string): Promise<string[]> => {
    // Returns array of booked LocalTime strings e.g. ["09:00:00", "10:30:00"]
    const response = await api.get<string[]>(`/appointments/doctor/${doctorId}/availability`, { params: { date } });
    return response.data;
  },
};
