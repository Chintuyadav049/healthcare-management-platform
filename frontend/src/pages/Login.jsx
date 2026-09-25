import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  // Mode: "login" or "register"
  const [authMode, setAuthMode] = useState("login");

  // Login Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isUnregistered, setIsUnregistered] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Register Form State
  const [regForm, setRegForm] = useState({
    role: "PATIENT",
    fullName: "",
    username: "",
    password: "",
    age: 48,
    gender: "Female",
    condition: "Hypertension",
    medication: "Amlodipine 5mg",
    specialization: "Cardiovascular Medicine & Digital Health",
    department: "Cardiology & Twin Modeling",
    licenseNumber: "MD-884920",
    email: "",
    phone: "+1 (555) 234-8901",
  });

  // Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsUnregistered(false);
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        username: username.trim(),
        password,
      });

      // Persist auth tokens & clinical perspective context
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      if (response.data.patientId) {
        localStorage.setItem("patientId", response.data.patientId);
      } else {
        localStorage.removeItem("patientId");
      }

      if (response.data.fullName) {
        localStorage.setItem("fullName", response.data.fullName);
      } else {
        localStorage.setItem("fullName", response.data.username);
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const status = err.response?.status;
      const msg = err.response?.data?.message || "";

      if (status === 404 || msg.toLowerCase().includes("not registered")) {
        setIsUnregistered(true);
        setError(`Account '${username}' is not registered. Please create an account before logging in.`);
      } else if (status === 401 || msg.toLowerCase().includes("invalid password")) {
        setError("Incorrect password. Please verify your credentials.");
      } else {
        setError(msg || "Unable to sign in. Please verify your credentials or register.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const payload = {
        ...regForm,
        username: regForm.username.trim().toLowerCase(),
      };

      const response = await API.post("/auth/register", payload);

      setSuccessMessage(
        response.data.message || `Account '${payload.username}' registered successfully! You may now sign in.`
      );

      // Pre-fill login username and switch to login tab
      setUsername(payload.username);
      setPassword("");
      setAuthMode("login");
      setIsUnregistered(false);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Switch to Register mode with prefilled username
  const switchToRegister = () => {
    setRegForm((prev) => ({
      ...prev,
      username: username.toLowerCase().trim(),
      fullName: username.charAt(0).toUpperCase() + username.slice(1),
    }));
    setError("");
    setIsUnregistered(false);
    setAuthMode("register");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE - BRAND HERO */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-slate-950 to-blue-600/20" />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Brand Header */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black shadow-lg shadow-cyan-500/20">
                  M
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">MediSphere</h1>
                  <p className="text-xs text-slate-400">Cognitive Digital Twin Platform</p>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
                Role-Based Cognitive Healthcare Engine
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Smarter healthcare.
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Continuous intelligence.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-slate-400">
                Continuous Kafka wearable telemetry, AI anomaly detection with 3.2-minute response SLA, and role-governed digital health twins.
              </p>

              {/* Perspectives List */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="mb-2 text-xl text-cyan-400">👤</div>
                  <h3 className="text-xs font-bold text-white">Patient Perspective</h3>
                  <p className="mt-1 text-[11px] text-slate-400 leading-normal">
                    Personal vitals shield, own digital twin 360°, and privacy consent registry.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="mb-2 text-xl text-blue-400">🩺</div>
                  <h3 className="text-xs font-bold text-white">Doctor Perspective</h3>
                  <p className="mt-1 text-[11px] text-slate-400 leading-normal">
                    Clinical patient roster, 3.2m alert triage, and SHAP explainable AI risk models.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="mb-2 text-xl text-purple-400">👑</div>
                  <h3 className="text-xs font-bold text-white">Admin Perspective</h3>
                  <p className="mt-1 text-[11px] text-slate-400 leading-normal">
                    Staff onboarding, federated learning rounds (1-47), and privacy budgeting (ε=1.25).
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>© 2026 MediSphere Cognitive Twin</span>
              <span>Milestone 3 Continuous Telemetry</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - AUTHENTICATION FORM */}
        <div className="flex items-center justify-center bg-slate-950 px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">

            {/* Mobile Header */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold">
                M
              </div>
              <div>
                <h1 className="font-bold text-white">MediSphere</h1>
                <p className="text-xs text-slate-500">Cognitive Digital Twin</p>
              </div>
            </div>

            {/* Navigation Switch: Sign In vs Register */}
            <div className="mb-6 flex rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setError("");
                  setIsUnregistered(false);
                }}
                className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold transition ${
                  authMode === "login"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setError("");
                  setIsUnregistered(false);
                }}
                className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold transition ${
                  authMode === "register"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Register Account
              </button>
            </div>

            {/* SUCCESS BANNER */}
            {successMessage && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-300 animate-fadeIn">
                <span>✓ {successMessage}</span>
                <button onClick={() => setSuccessMessage("")} className="font-bold text-emerald-400 ml-2">✕</button>
              </div>
            )}

            {/* UNREGISTERED USER ALERT */}
            {isUnregistered && authMode === "login" && (
              <div className="mb-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <span className="text-lg">⚠</span>
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-amber-100">User Not Registered</p>
                    <p className="mt-1 text-amber-300/90">
                      No account found for <strong>'{username}'</strong>. In order to log in, you must create an account first.
                    </p>
                    <button
                      type="button"
                      onClick={switchToRegister}
                      className="mt-3 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/30 hover:opacity-95 transition"
                    >
                      <span>Register Account for '{username}' →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* GENERAL ERROR BANNER */}
            {error && !isUnregistered && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* ================= MODE 1: SIGN IN ================= */}
            {authMode === "login" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Enter your registered clinical credentials or select a verified role to quick-fill.
                  </p>

                  {/* 1-Click Role Quick Fill Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUsername("admin");
                        setPassword("admin123");
                        setError("");
                        setIsUnregistered(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        username === "admin"
                          ? "border-purple-500 bg-purple-500/20 text-purple-300"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span>👑</span>
                      <span>Admin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUsername("doctor");
                        setPassword("doctor123");
                        setError("");
                        setIsUnregistered(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        username === "doctor"
                          ? "border-blue-500 bg-blue-500/20 text-blue-300"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span>🩺</span>
                      <span>Doctor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUsername("patient");
                        setPassword("patient123");
                        setError("");
                        setIsUnregistered(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        username === "patient"
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span>👤</span>
                      <span>Patient (John Doe)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUsername("sarahm");
                        setPassword("patient123");
                        setError("");
                        setIsUnregistered(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        username === "sarahm"
                          ? "border-rose-500 bg-rose-500/20 text-rose-300"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span>⚡</span>
                      <span>Sarah M. (AFib)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUsername("robertsmith");
                        setPassword("patient123");
                        setError("");
                        setIsUnregistered(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        username === "robertsmith"
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span>🫁</span>
                      <span>Robert Smith (COPD)</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (isUnregistered) setIsUnregistered(false);
                      }}
                      placeholder="e.g. admin, doctor, patient, sarahm"
                      autoComplete="username"
                      required
                      className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setError("Default demo passwords are 'admin123', 'doctor123', or 'patient123'.")
                        }
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      required
                      className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Authenticating..." : "Sign In →"}
                  </button>
                </form>

                {/* Switch to Register link */}
                <div className="mt-5 text-center text-xs text-slate-400">
                  <span>Don't have an account yet? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setError("");
                      setIsUnregistered(false);
                    }}
                    className="font-bold text-cyan-400 hover:underline"
                  >
                    Register new account
                  </button>
                </div>
              </div>
            )}

            {/* ================= MODE 2: REGISTER ACCOUNT ================= */}
            {authMode === "register" && (
              <div>
                <div className="mb-5">
                  <h3 className="text-2xl font-bold tracking-tight text-white">Create Clinical Account</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Register as a Patient to provision a Digital Twin, or as a Doctor to access clinical triage.
                  </p>

                  {/* Role Selector Tabs */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegForm((prev) => ({ ...prev, role: "PATIENT" }))}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-extrabold transition ${
                        regForm.role === "PATIENT"
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>👤</span>
                      <span>Patient (Health Twin)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegForm((prev) => ({ ...prev, role: "DOCTOR" }))}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-extrabold transition ${
                        regForm.role === "DOCTOR"
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/20"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span>🩺</span>
                      <span>Doctor (Physician)</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  {/* Common: Full Name */}
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      placeholder={regForm.role === "PATIENT" ? "e.g. Alice Walker" : "e.g. Dr. Jane Adams"}
                      required
                      className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 text-sm text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Common: Username & Password in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Username
                      </label>
                      <input
                        type="text"
                        value={regForm.username}
                        onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                        placeholder="e.g. alicew"
                        required
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 text-sm text-white outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                      <input
                        type="password"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Choose password"
                        required
                        className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 text-sm text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* PATIENT-SPECIFIC FIELDS */}
                  {regForm.role === "PATIENT" && (
                    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        Digital Health Twin Setup
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-400">Age</label>
                          <input
                            type="number"
                            value={regForm.age}
                            onChange={(e) => setRegForm({ ...regForm, age: Number(e.target.value) })}
                            min="1"
                            max="120"
                            className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-400">Gender</label>
                          <select
                            value={regForm.gender}
                            onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                            className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-emerald-500"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-400">Primary Condition</label>
                        <select
                          value={regForm.condition}
                          onChange={(e) => setRegForm({ ...regForm, condition: e.target.value })}
                          className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-emerald-500"
                        >
                          <option value="Hypertension">Hypertension</option>
                          <option value="Type 2 Diabetes">Type 2 Diabetes</option>
                          <option value="Coronary Artery Disease">Coronary Artery Disease</option>
                          <option value="Paroxysmal Atrial Fibrillation">Paroxysmal Atrial Fibrillation</option>
                          <option value="COPD & Respiratory">COPD & Respiratory</option>
                          <option value="General Health Baseline">General Health Baseline (None)</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-400">Current Medication</label>
                        <input
                          type="text"
                          value={regForm.medication}
                          onChange={(e) => setRegForm({ ...regForm, medication: e.target.value })}
                          placeholder="e.g. Amlodipine 5mg, Metformin 500mg"
                          className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* DOCTOR-SPECIFIC FIELDS */}
                  {regForm.role === "DOCTOR" && (
                    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                        Clinical Credentials & Department
                      </p>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-400">Specialization</label>
                        <input
                          type="text"
                          value={regForm.specialization}
                          onChange={(e) => setRegForm({ ...regForm, specialization: e.target.value })}
                          placeholder="e.g. Cardiovascular Medicine & Digital Health"
                          className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-400">Department</label>
                          <input
                            type="text"
                            value={regForm.department}
                            onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                            placeholder="Cardiology"
                            className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-400">License Number</label>
                          <input
                            type="text"
                            value={regForm.licenseNumber}
                            onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                            placeholder="MD-884920"
                            className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-60"
                  >
                    {loading ? "Provisioning Profile..." : "Complete Registration & Auto-Provision →"}
                  </button>
                </form>

                {/* Switch back to Login */}
                <div className="mt-4 text-center text-xs text-slate-400">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setError("");
                      setIsUnregistered(false);
                    }}
                    className="font-bold text-cyan-400 hover:underline"
                  >
                    Sign in here
                  </button>
                </div>
              </div>
            )}

            {/* Security Indicator */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                ✓
              </div>
              <p className="text-[11px] text-slate-400">
                JWT-secured access with role-governed clinical isolation.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-between border-t border-slate-900 pt-4 text-[11px] text-slate-600">
              <span>MediSphere Healthcare Platform</span>
              <span>v1.0 • Milestone 3</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;