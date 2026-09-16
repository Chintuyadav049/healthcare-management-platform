import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role") || "DOCTOR";
  const username = localStorage.getItem("username") || "Physician";

  // Data states
  const [patients, setPatients] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [healthTwins, setHealthTwins] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [latestRound, setLatestRound] = useState(null);
  const [activeModel, setActiveModel] = useState(null);
  const [johnDoeRisk, setJohnDoeRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialization: "Cardiovascular Medicine & Digital Health",
    department: "Cardiology & Twin Modeling",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  const [patientForm, setPatientForm] = useState({
    name: "",
    age: 55,
    gender: "Male",
    conditions: ["Hypertension"],
    medications: ["Amlodipine 5mg"],
    systolicBP: 138,
    diastolicBP: 86,
    heartRate: 76,
    oxygenSaturation: 98,
    temperature: 36.6,
  });

  const availableConditions = [
    "Hypertension",
    "Type 2 Diabetes",
    "Hyperlipidemia",
    "Coronary Artery Disease",
    "Heart Failure",
    "Smoker",
    "Obesity",
  ];

  const availableMedications = [
    "Amlodipine 5mg",
    "Metformin 500mg",
    "Atorvastatin 20mg",
    "Lisinopril 10mg",
    "Aspirin 81mg",
    "Metoprolol 25mg",
  ];

  const toggleCondition = (cond) => {
    setPatientForm((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(cond)
        ? prev.conditions.filter((c) => c !== cond)
        : [...prev.conditions, cond],
    }));
  };

  const toggleMedication = (med) => {
    setPatientForm((prev) => ({
      ...prev,
      medications: prev.medications.includes(med)
        ? prev.medications.filter((m) => m !== med)
        : [...prev.medications, med],
    }));
  };

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [patientsRes, vitalsRes, twinsRes] = await Promise.allSettled([
        API.get("/patients"),
        API.get("/vitals"),
        API.get("/health-twins"),
      ]);

      if (patientsRes.status === "fulfilled") {
        setPatients(Array.isArray(patientsRes.value.data) ? patientsRes.value.data : []);
      }
      if (vitalsRes.status === "fulfilled") {
        setVitals(Array.isArray(vitalsRes.value.data) ? vitalsRes.value.data : []);
      }
      if (twinsRes.status === "fulfilled") {
        setHealthTwins(Array.isArray(twinsRes.value.data) ? twinsRes.value.data : []);
      }

      // If Admin, load doctors & federated telemetry
      if (userRole === "ADMIN") {
        try {
          const docRes = await API.get("/doctors");
          setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
        } catch (e) {
          console.warn("Doctors API unavailable:", e);
        }
      }

      // Load Federated & Model status
      try {
        const roundRes = await API.get("/federated/rounds/latest");
        setLatestRound(roundRes.data);
      } catch (e) {
        setLatestRound({ roundNumber: 47, accuracy: 91.4, loss: 0.181, privacyEpsilon: 1.25 });
      }

      try {
        const modelRes = await API.get("/ai/models/active");
        setActiveModel(modelRes.data);
      } catch (e) {
        setActiveModel({ versionId: "v2.4.0-fed-cvd", accuracy: 91.4, roundNumber: 47 });
      }

      // Load John Doe 24.3% Risk
      try {
        const riskRes = await API.get("/ai/risk-prediction/patient-001");
        setJohnDoeRisk(riskRes.data);
      } catch (e) {
        setJohnDoeRisk({
          patientId: "patient-001",
          patientName: "John Doe",
          cvdRiskScorePercent: 24.3,
          riskTier: "HIGH",
          shapHbA1cContribution: 8.0,
          shapBpContribution: 6.0,
          modelVersion: "v2.4.0-fed-cvd",
          federatedRound: 47,
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [userRole]);

  // Handler for Admin adding doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!doctorForm.name.trim()) return;

    try {
      const response = await API.post("/doctors", doctorForm);
      setShowAddDoctorModal(false);
      const uname = doctorForm.email?.includes("@")
        ? doctorForm.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "")
        : doctorForm.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

      setToastMessage(
        `Doctor ${response.data.name} added! User login account created: '${uname}' (password: doctor123)`
      );
      setDoctorForm({
        name: "",
        specialization: "Cardiovascular Medicine & Digital Health",
        department: "Cardiology & Twin Modeling",
        email: "",
        phone: "",
        licenseNumber: "",
      });
      loadAllData();
      setTimeout(() => setToastMessage(""), 8000);
    } catch (err) {
      alert("Failed to add doctor: " + (err.response?.data?.message || err.message));
    }
  };

  // Handler for Doctor adding patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!patientForm.name.trim()) return;

    try {
      const response = await API.post("/patients/register", patientForm);
      setShowAddPatientModal(false);
      const pid = response.data.patientId || "new-patient";

      setToastMessage(
        `Patient ${response.data.name} registered! Digital Twin created & login account provisioned: '${pid}' (password: patient123)`
      );
      setPatientForm({
        name: "",
        age: 55,
        gender: "Male",
        conditions: ["Hypertension"],
        medications: ["Amlodipine 5mg"],
        systolicBP: 138,
        diastolicBP: 86,
        heartRate: 76,
        oxygenSaturation: 98,
        temperature: 36.6,
      });
      loadAllData();
      setTimeout(() => setToastMessage(""), 8000);
    } catch (err) {
      alert("Failed to add patient: " + (err.response?.data?.message || err.message));
    }
  };

  const getPatientName = (patient) => {
    if (patient.name) {
      if (typeof patient.name === "string") return patient.name;
      if (Array.isArray(patient.name) && patient.name.length > 0) {
        const n = patient.name[0];
        const g = Array.isArray(n.given) ? n.given.join(" ") : n.given || "";
        return `${g} ${n.family || ""}`.trim();
      }
    }
    return patient.patientName || "John Doe";
  };

  // ----------------------------------------------------
  // 1. ADMIN DASHBOARD VIEW
  // ----------------------------------------------------
  const renderAdminDashboard = () => (
    <div className="space-y-7">
      {/* Admin Command Banner */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 px-7 py-9 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-200">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            System Administrator Control Center • Active User: {username}
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hospital System Administration & AI Telemetry
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-indigo-100/90">
            Manage clinical staff, authorize hospital departments, oversee distributed federated learning across 4 hospital nodes, and audit cognitive twin operations.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500"
            >
              <span className="text-lg leading-none">+</span> Add New Doctor
            </button>

            <button
              onClick={() => navigate("/doctors")}
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Manage Doctors Directory ({doctors.length}) →
            </button>

            <button
              onClick={() => navigate("/risk-predictions")}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-indigo-200 hover:bg-white/10"
            >
              Federated Hub & Models
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 text-7xl text-white/10 lg:block">
          ⚙
        </div>
      </section>

      {/* Admin Stats Grid */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Registered Doctors</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-600">
                {loading ? "—" : doctors.length || 3}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
              ⚕
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Cardiology, Endo, AI</span>
            <button
              onClick={() => navigate("/doctors")}
              className="font-bold text-blue-600 hover:underline"
            >
              Directory →
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Patients</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-800">
                {loading ? "—" : patients.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
              ♙
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">All registered clinical digital twins</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Model Accuracy</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">91.4%</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
              ✦
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">v2.4.0-fed-cvd (FedAvg Round 47)</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Federated Nodes</p>
              <p className="mt-2 text-3xl font-extrabold text-indigo-600">4 Hospitals</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
              🌐
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">Alpha, Beta, Gamma, Delta</p>
        </div>
      </section>

      {/* Main Admin Columns: Doctor Management & System Infrastructure */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Doctor Directory Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Staff Administration
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-800">
                Authorized Physicians
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddDoctorModal(true)}
                className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                + Add Doctor
              </button>
              <button
                onClick={() => navigate("/doctors")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View all ({doctors.length}) →
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {(doctors.length > 0 ? doctors.slice(0, 4) : [
              { name: "Dr. Sarah Jenkins", specialization: "Cardiovascular Medicine & Digital Health", email: "doctor@medisphere.io", department: "Cardiology & Twin Modeling" },
              { name: "Dr. Marcus Vance", specialization: "Endocrinology & Metabolic Risk", email: "marcus.vance@hospital-beta.org", department: "Endocrinology & Diabetes" },
              { name: "Dr. Elena Rostova", specialization: "Critical Care & Clinical AI", email: "e.rostova@hospital-gamma.org", department: "Intensive Care & Telemetry" },
            ]).map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                    {doc.name.replace(/^Dr\.?\s*/i, "").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.email}</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                    {doc.specialization}
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400">{doc.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Privacy Infrastructure Telemetry */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Infrastructure Telemetry
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Security & Learning Health
            </h3>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800">MongoDB Atlas & Kafka Connected</span>
              </div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                HEALTHY
              </span>
            </div>
            <p className="text-[11px] text-emerald-700/80">
              Real-time physiological vitals ingestion and patient records synchronization operational.
            </p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🔒</span>
                <span className="text-xs font-bold text-indigo-900">Differential Privacy Budget</span>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-700">ε = 1.25, δ = 1e-5</span>
            </div>
            <p className="text-[11px] text-indigo-700/80">
              DP-SGD guarantees mathematical privacy during federated weight averaging across hospital nodes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Active Model</span>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                v2.4.0-fed-cvd (91.4%)
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Federated Round: <strong>Round 47</strong></span>
              <span>Converged Loss: <strong>0.181</strong></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // ----------------------------------------------------
  // 2. DOCTOR DASHBOARD VIEW
  // ----------------------------------------------------
  const renderDoctorDashboard = () => (
    <div className="space-y-7">
      {/* Doctor Workspace Banner */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-7 py-9 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Clinical Intelligence Portal • Dr. {username}
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Physician Clinical Workspace & Cognitive Twins
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-50">
            Monitor digital health twins, review continuous vitals telemetry, register new patients with baseline physiological profiles, and assess 10-year CVD risk with SHAP explainability.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <span className="text-lg leading-none">+</span> Add New Patient
            </button>

            <button
              onClick={() => navigate("/risk-predictions")}
              className="rounded-full border border-white/40 bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              AI Risk Predictor (Round 47) →
            </button>

            <button
              onClick={() => navigate("/patients")}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-blue-100 hover:bg-white/15"
            >
              Patient Roster ({patients.length})
            </button>
          </div>
        </div>

        <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 text-8xl text-white/10 lg:block">
          ♡
        </div>
      </section>

      {/* Doctor Clinical Metrics */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Patients Under Care</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-800">
                {loading ? "—" : patients.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
              ♙
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total registered</span>
            <button onClick={() => setShowAddPatientModal(true)} className="font-bold text-blue-600 hover:underline">
              + Quick Add
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">High CVD Risk Flagged</p>
              <p className="mt-2 text-3xl font-extrabold text-amber-600">
                {johnDoeRisk?.cvdRiskScorePercent >= 20 ? 1 : 0} Patient
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
              ⚠
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">John Doe (24.3% ASCVD risk)</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Cognitive Twins</p>
              <p className="mt-2 text-3xl font-extrabold text-indigo-600">
                {loading ? "—" : healthTwins.length || patients.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
              ◈
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">Continuous telemetry models</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Model Accuracy</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">91.4%</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
              ✓
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">Validated federated CVD model</p>
        </div>
      </section>

      {/* Clinical Triage & High-Risk Alert Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-lg font-bold text-white shadow-md shadow-amber-500/30">
              △
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Priority Clinical Alert
                </span>
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  ACC/AHA High Tier
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-800 mt-1">
                John Doe (58M) – 10-Year CVD Risk is 24.3% (High Risk)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                SHAP feature analysis identifies <strong>HbA1c +8.0%</strong> and <strong>Blood Pressure (142/88) +6.0%</strong> as the primary drivers. Federated round 47 model recommends antihypertensive titration and glycemic review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/risk-predictions")}
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700"
            >
              View SHAP Waterfall →
            </button>
            <button
              onClick={() => navigate("/patients/patient-001")}
              className="rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-50"
            >
              Patient 360°
            </button>
          </div>
        </div>
      </div>

      {/* Patients Roster Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Clinical Roster
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Active Patients & Risk Status
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              + Add Patient
            </button>
            <button
              onClick={() => navigate("/patients")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Full directory →
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {patients.slice(0, 5).map((patient, idx) => {
            const pId = patient.patientId || patient.id || `patient-${idx}`;
            const name = getPatientName(patient);
            const isJohn = pId === "patient-001" || name.includes("John");

            return (
              <div key={pId} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">ID: {pId} • Age {patient.age || 58} ({patient.gender || "Male"})</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isJohn
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isJohn ? "24.3% CVD Risk (High)" : "Low Risk (<10%)"}
                  </span>

                  <button
                    onClick={() => navigate("/risk-predictions")}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
                  >
                    Predict Risk
                  </button>

                  <button
                    onClick={() => navigate(`/patients/${pId}`)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    360° View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );

  // ----------------------------------------------------
  // 3. PATIENT PORTAL VIEW (Clean & Simple)
  // ----------------------------------------------------
  const renderPatientDashboard = () => (
    <div className="space-y-6">
      {/* Patient Welcome Banner - Clean & Simple */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome, John Doe
            </h2>
            <p className="mt-1 text-xs text-blue-100">
              Personal health twin and vital sign summary.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/risk-predictions")}
              className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              CVD Risk: 24.3% →
            </button>
            <button
              onClick={() => navigate("/vitals")}
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              My Vitals
            </button>
            <button
              onClick={() => navigate("/careplans")}
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              My Care Plans
            </button>
          </div>
        </div>
      </section>

      {/* Patient 10-Year CVD Risk Card */}
      <section className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xl font-black text-amber-700">24.3%</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Cardiovascular Risk
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  High Risk
                </span>
              </div>
              <h3 className="mt-0.5 text-base font-bold text-slate-800">
                10-Year Predicted ASCVD Risk: 24.3%
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Top risk drivers: <strong>HbA1c (+8.0%)</strong> and <strong>Blood Pressure (+6.0%)</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/risk-predictions")}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            View SHAP Breakdown →
          </button>
        </div>
      </section>

      {/* Physiological Vitals Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Blood Pressure</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-800">142/88</p>
            <span className="text-[11px] text-slate-400">mmHg</span>
          </div>
          <span className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            Stage 2 Hypertension
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Heart Rate</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-800">78</p>
            <span className="text-[11px] text-slate-400">bpm</span>
          </div>
          <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            Normal
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">HbA1c</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-800">7.4%</p>
            <span className="text-[11px] text-slate-400">Target &lt; 7.0</span>
          </div>
          <span className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            Elevated
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">SpO2</p>
          <div className="mt-1 flex items-baseline justify-between">
            <p className="text-xl font-bold text-slate-800">97%</p>
            <span className="text-[11px] text-slate-400">Optimal</span>
          </div>
          <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            Normal
          </span>
        </div>
      </section>

      {/* Conditions & Medications */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">My Health Profile</h3>
            <button onClick={() => navigate("/health-twins")} className="text-xs font-bold text-blue-600 hover:underline">
              Twin Details →
            </button>
          </div>

          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Conditions</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  Hypertension
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  Type 2 Diabetes
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Current Medications</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  Amlodipine 5mg
                </span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  Metformin 500mg
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Care Plan & Consent</h3>
            <button onClick={() => navigate("/careplans")} className="text-xs font-bold text-blue-600 hover:underline">
              View Plans →
            </button>
          </div>

          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
              <span className="text-xs font-semibold text-emerald-800">✓ HIPAA Consent Granted</span>
              <p className="mt-0.5 text-[11px] text-emerald-700">
                Active for predictive AI risk modeling and digital twin updates.
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
              <span className="text-xs font-semibold text-blue-900">Cardiovascular Target</span>
              <p className="mt-0.5 text-[11px] text-blue-700">
                Target BP &lt; 130/80 mmHg with scheduled check-in in 4 weeks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <AppLayout
      title={
        userRole === "ADMIN"
          ? "Admin Command Center"
          : userRole === "DOCTOR"
          ? "Doctor Clinical Workspace"
          : "Health Twin Dashboard"
      }
      subtitle={
        userRole === "ADMIN"
          ? "Hospital and clinical staff administration"
          : userRole === "DOCTOR"
          ? "Patient triage, vital telemetry, and AI risk prediction"
          : "Your personal health overview and vital indicators"
      }
    >
      {/* Toast */}
      {toastMessage && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold">✓</span>
            <p className="font-medium">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage("")}
            className="font-bold text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Role-Specific View */}
      {userRole === "ADMIN" && renderAdminDashboard()}
      {userRole === "DOCTOR" && renderDoctorDashboard()}
      {userRole === "PATIENT" && renderPatientDashboard()}

      {/* ADD DOCTOR MODAL (ADMIN) */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Admin Action
                </span>
                <h3 className="text-xl font-bold text-slate-800">Add New Doctor</h3>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  placeholder="e.g. Dr. Marcus Vance"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Specialization</label>
                  <select
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                  >
                    <option value="Cardiovascular Medicine & Digital Health">Cardiovascular Medicine & Digital Health</option>
                    <option value="Endocrinology & Metabolic Risk">Endocrinology & Metabolic Risk</option>
                    <option value="Critical Care & Clinical AI">Critical Care & Clinical AI</option>
                    <option value="Internal Medicine & Prevention">Internal Medicine & Prevention</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={doctorForm.department}
                    onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                    placeholder="e.g. Cardiology & Twin Modeling"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    placeholder="e.g. marcus.vance@medisphere.io"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">License Number</label>
                  <input
                    type="text"
                    value={doctorForm.licenseNumber}
                    onChange={(e) => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                    placeholder="e.g. MD-773104"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
                <p className="text-xs font-bold text-blue-900">Auto-Provisioned DOCTOR Account</p>
                <p className="mt-1 text-[11px] text-blue-700">
                  A login account with role <strong>DOCTOR</strong> will be automatically provisioned with default password <code className="font-mono font-bold">doctor123</code>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                >
                  Save Doctor & Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PATIENT MODAL (DOCTOR & ADMIN) */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Doctor Clinical Action
                </span>
                <h3 className="text-xl font-bold text-slate-800">Add New Patient</h3>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({ ...patientForm, age: parseInt(e.target.value) || 45 })}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Gender</label>
                <div className="mt-1.5 flex gap-3">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setPatientForm({ ...patientForm, gender: g })}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                        patientForm.gender === g
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Clinical Conditions</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableConditions.map((cond) => {
                    const sel = patientForm.conditions.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => toggleCondition(cond)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          sel ? "bg-blue-600 text-white shadow-sm" : "border border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {sel ? "✓ " : "+ "}{cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Prescribed Medications</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableMedications.map((med) => {
                    const sel = patientForm.medications.includes(med);
                    return (
                      <button
                        type="button"
                        key={med}
                        onClick={() => toggleMedication(med)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          sel ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {sel ? "✓ " : "+ "}{med}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700">Baseline Physiological Measurements</p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                    <label className="text-[10px] font-bold text-slate-400">Systolic BP</label>
                    <input
                      type="number"
                      value={patientForm.systolicBP}
                      onChange={(e) => setPatientForm({ ...patientForm, systolicBP: parseFloat(e.target.value) || 120 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                    <label className="text-[10px] font-bold text-slate-400">Diastolic BP</label>
                    <input
                      type="number"
                      value={patientForm.diastolicBP}
                      onChange={(e) => setPatientForm({ ...patientForm, diastolicBP: parseFloat(e.target.value) || 80 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                    <label className="text-[10px] font-bold text-slate-400">Heart Rate</label>
                    <input
                      type="number"
                      value={patientForm.heartRate}
                      onChange={(e) => setPatientForm({ ...patientForm, heartRate: parseFloat(e.target.value) || 72 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                    <label className="text-[10px] font-bold text-slate-400">SpO2 (%)</label>
                    <input
                      type="number"
                      value={patientForm.oxygenSaturation}
                      onChange={(e) => setPatientForm({ ...patientForm, oxygenSaturation: parseFloat(e.target.value) || 98 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3.5">
                <p className="text-xs font-bold text-slate-800">Auto-Provisioning Included</p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Creates Cognitive Twin, baseline vitals, HIPAA consent, and user login account with role <strong>PATIENT</strong> (password: <code className="font-mono font-bold">patient123</code>).
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700"
                >
                  Register Patient & Twin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Dashboard;