import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PageLayout from './components/layout/PageLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Patients from './pages/patients/Patients';
import PatientForm from './pages/patients/PatientForm';
import PatientDetails from './pages/patients/PatientDetails';
import Doctors from './pages/doctors/Doctors';
import DoctorForm from './pages/doctors/DoctorForm';
import Appointments from './pages/appointments/Appointments';
import ClinicalQueue from './pages/clinical/ClinicalQueue';
import MedicalRecords from './pages/medical-records/MedicalRecords';
import Reports from './pages/admin/Reports';
import AdminPanel from './pages/admin/AdminPanel';

// Layout Wrapper for protected pages
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PageLayout>{children}</PageLayout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
                <LayoutWrapper>
                  <Dashboard />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}>
                <LayoutWrapper>
                  <Patients />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/add"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST']}>
                <LayoutWrapper>
                  <PatientForm />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'PATIENT']}>
                <LayoutWrapper>
                  <PatientForm />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT']}>
                <LayoutWrapper>
                  <PatientDetails />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT']}>
                <LayoutWrapper>
                  <Doctors />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors/add"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <LayoutWrapper>
                  <DoctorForm />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                <LayoutWrapper>
                  <DoctorForm />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT']}>
                <LayoutWrapper>
                  <Appointments />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments/book"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'PATIENT']}>
                <LayoutWrapper>
                  <Appointments />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clinical"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}>
                <LayoutWrapper>
                  <ClinicalQueue />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/medical-records"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
                <LayoutWrapper>
                  <MedicalRecords />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <LayoutWrapper>
                  <Reports />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <LayoutWrapper>
                  <AdminPanel />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        {/* Global Alert Notification Center */}
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
