import api from './api';
import { LoginRequest, AuthResponse, UserDto } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  register: async (user: UserDto): Promise<UserDto> => {
    const response = await api.post<UserDto>('/auth/register', user);
    return response.data;
  },
};
