import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import HealthTwins from "./pages/HealthTwins";
import HealthTwinDetails from "./pages/HealthTwinDetails";
import Vitals from "./pages/Vitals";
import RiskPredictions from "./pages/RiskPredictions";
import Alerts from "./pages/Alerts";
import CarePlans from "./pages/CarePlans";
import FHIR from "./pages/FHIR";
import Consent from "./pages/Consent";
import Doctors from "./pages/Doctors";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        <Route
          path="/login"
          element={<Navigate to="/" replace />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Patients (Doctors & Admin only) */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}>
              <Patients />
            </ProtectedRoute>
          }
        />

        {/* Patient 360 (Doctors & Admin only) */}
        <Route
          path="/patients/:patientId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}>
              <PatientDetails />
            </ProtectedRoute>
          }
        />

        {/* Doctors (Admin Only) */}
        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />

        {/* Health Twins */}
        <Route
          path="/health-twins"
          element={
            <ProtectedRoute>
              <HealthTwins />
            </ProtectedRoute>
          }
        />

<Route
  path="/health-twins/:patientId"
  element={
    <ProtectedRoute>
      <HealthTwinDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/vitals"
  element={
    <ProtectedRoute>
      <Vitals />
    </ProtectedRoute>
  }
/>

<Route
  path="/risk-predictions"
  element={
    <ProtectedRoute>
      <RiskPredictions />
    </ProtectedRoute>
  }
/>

<Route
  path="/alerts"
  element={
    <ProtectedRoute>
      <Alerts />
    </ProtectedRoute>
  }
/>

<Route
  path="/careplans"
  element={
    <ProtectedRoute>
      <CarePlans />
    </ProtectedRoute>
  }
/>

<Route
  path="/fhir"
  element={
    <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}>
      <FHIR />
    </ProtectedRoute>
  }
/>

<Route
  path="/consent"
  element={
    <ProtectedRoute>
      <Consent />
    </ProtectedRoute>
  }
/>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;