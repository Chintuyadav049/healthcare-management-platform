export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
}

export interface UserDto {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  role: string;
  password?: string;
}

export interface PatientDto {
  id?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO string 'yyyy-MM-dd'
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address?: string;
  emergencyContact?: string;
  registrationDate?: string;
  medicalHistory?: string;
  allergies?: string;
  status: string; // "ACTIVE" | "INACTIVE"
}

export interface DoctorDto {
  id?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  specializationId: number;
  specializationName?: string;
  departmentId: number;
  departmentName?: string;
  licenseNumber: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  availabilityStatus: string; // "AVAILABLE" | "UNAVAILABLE" | "ON_LEAVE"
  password?: string;
}

export interface AppointmentDto {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentDate: string; // 'yyyy-MM-dd'
  appointmentTime: string; // 'HH:mm'
  reason: string;
  notes?: string;
  status?: 'BOOKED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  createdAt?: string;
}

export interface ClinicalOperationDto {
  id?: number;
  patientId: number;
  patientName?: string;
  patientGender?: string;
  patientDob?: string;
  doctorId?: number;
  doctorName?: string;
  appointmentId?: number;
  tokenNumber?: string;
  status: 'WAITING' | 'CHECKED_IN' | 'WITH_DOCTOR' | 'UNDER_TREATMENT' | 'COMPLETED' | 'DISCHARGED';
  checkInTime?: string;
  dischargeTime?: string;
}

export interface PrescriptionDto {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  medicalRecordId?: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface MedicalRecordDto {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentId?: number;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string;
  recordDate?: string;
  prescriptions?: PrescriptionDto[];
}

export interface ChartItemDto {
  name: string;
  value: number;
}

export interface DashboardStatsDto {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  pendingPatients: number;
  completedAppointments: number;
  cancelledAppointments: number;
  patientsCheckedIn: number;
  patientsUnderTreatment: number;
  appointmentsPerDay: ChartItemDto[];
  patientsRegisteredPerMonth: ChartItemDto[];
  appointmentsByStatus: ChartItemDto[];
  patientsByGender: ChartItemDto[];
  doctorsBySpecialization: ChartItemDto[];
}

export interface Specialization {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}
