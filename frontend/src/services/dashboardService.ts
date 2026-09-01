import api from './api';
import { DashboardStatsDto, UserDto, Department, Specialization } from '../types';

export const dashboardService = {
  getStatistics: async (): Promise<DashboardStatsDto> => {
    const response = await api.get<DashboardStatsDto>('/dashboard/statistics');
    return response.data;
  },
  // Admin module user management helpers
  getUsers: async (): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>('/admin/users');
    return response.data;
  },
  createUser: async (user: UserDto): Promise<UserDto> => {
    const response = await api.post<UserDto>('/admin/users', user);
    return response.data;
  },
  createDepartment: async (name: string): Promise<Department> => {
    const response = await api.post<Department>('/admin/departments', null, { params: { name } });
    return response.data;
  },
  createSpecialization: async (name: string): Promise<Specialization> => {
    const response = await api.post<Specialization>('/admin/specializations', null, { params: { name } });
    return response.data;
  },
};
