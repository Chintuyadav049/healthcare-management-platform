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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
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

        {/* Patients */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />

        {/* Patient 360 */}
        <Route
          path="/patients/:patientId"
          element={
            <ProtectedRoute>
              <PatientDetails />
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
    <ProtectedRoute>
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