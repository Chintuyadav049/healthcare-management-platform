import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function Patients() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "PATIENT";

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const [formData, setFormData] = useState({
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
    "Atrial Fibrillation",
  ];

  const availableMedications = [
    "Amlodipine 5mg",
    "Metformin 500mg",
    "Atorvastatin 20mg",
    "Lisinopril 10mg",
    "Aspirin 81mg",
    "Metoprolol 25mg",
    "Glipizide 5mg",
    "Empagliflozin 10mg",
  ];

  const toggleCondition = (cond) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(cond)
        ? prev.conditions.filter((c) => c !== cond)
        : [...prev.conditions, cond],
    }));
  };

  const toggleMedication = (med) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.includes(med)
        ? prev.medications.filter((m) => m !== med)
        : [...prev.medications, med],
    }));
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/patients");

      setPatients(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Failed to load patients:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load patient records."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const response = await API.post("/patients/register", formData);
      setShowAddModal(false);

      const created = response.data;
      const pid = created.patientId || "new-patient";
      setSuccessToast(
        `Patient ${created.name} registered! Digital Twin created, vitals recorded & login account provisioned: '${pid}' (password: patient123)`
      );

      setFormData({
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

      loadPatients();
      setTimeout(() => setSuccessToast(""), 9000);
    } catch (err) {
      console.error("Failed to register patient:", err);
      alert("Error adding patient: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (role === "PATIENT") {
      navigate("/dashboard", { replace: true });
      return;
    }
    loadPatients();
  }, [role, navigate]);

  const getPatientName = (patient) => {
    if (patient.name) {
      if (typeof patient.name === "string") {
        return patient.name;
      }

      if (Array.isArray(patient.name) && patient.name.length > 0) {
        const name = patient.name[0];

        const given = Array.isArray(name.given)
          ? name.given.join(" ")
          : name.given || "";

        return `${given} ${name.family || ""}`.trim();
      }
    }

    return patient.patientName || "Unknown Patient";
  };

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const name = getPatientName(patient).toLowerCase();
      const id = String(
        patient.patientId || patient.id || ""
      ).toLowerCase();
      const email = String(patient.email || "").toLowerCase();

      return (
        name.includes(query) ||
        id.includes(query) ||
        email.includes(query)
      );
    });
  }, [patients, search]);

  return (
    <AppLayout
      title="Patients"
      subtitle="Manage patient records and clinical information"
    >
      {/* Success Toast */}
      {successToast && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
              ✓
            </span>
            <p className="text-xs font-semibold text-emerald-800 sm:text-sm">
              {successToast}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/risk-predictions")}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              Assess CVD Risk →
            </button>
            <button
              onClick={() => setSuccessToast("")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Page header */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                Patient Management
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
              Patient Records & Digital Twins
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Access patient profiles, clinical information, physiological
              data and their complete 360° health view.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(role === "DOCTOR" || role === "ADMIN") && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500"
              >
                <span className="text-lg leading-none">+</span> Add Patient
              </button>
            )}

            <button
              onClick={loadPatients}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              ↻ Refresh Records
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Total Patients
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-800">
                {loading ? "—" : patients.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
              ♙
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Showing
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-800">
                {loading ? "—" : filteredPatients.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-lg text-cyan-600">
              ◉
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Cognitive Twins
              </p>

              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                Active
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
              ◈
            </div>
          </div>
        </div>
      </section>

      {/* Patient table */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Clinical Database
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              All Patients
            </h3>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="m-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading patient records...
            </p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-500">
              ♙
            </div>

            <h4 className="mt-4 text-sm font-bold text-slate-700">
              No patients found
            </h4>

            <p className="mt-1 text-xs text-slate-400">
              {search
                ? "Try changing your search."
                : "No patient records are currently available."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Patient ID
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Gender
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient, index) => {
                    const patientId =
                      patient.patientId ||
                      patient.id ||
                      `patient-${index}`;

                    const name = getPatientName(patient);

                    return (
                      <tr
                        key={patientId}
                        className="transition hover:bg-blue-50/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 text-xs font-bold text-blue-600">
                              {name
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-slate-700">
                                {name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Patient record
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                            {patientId}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.gender || "—"}
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-600">
                            {patient.email || "No email"}
                          </p>

                          {patient.phone && (
                            <p className="mt-1 text-[11px] text-slate-400">
                              {patient.phone}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(`/patients/${patientId}`)
                            }
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            View 360° →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredPatients.map((patient, index) => {
                const patientId =
                  patient.patientId ||
                  patient.id ||
                  `patient-${index}`;

                const name = getPatientName(patient);

                return (
                  <div key={patientId} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {name.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {patientId}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Gender
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-600">
                          {patient.gender || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Contact
                        </p>

                        <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                          {patient.email || "—"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/patients/${patientId}`)
                      }
                      className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white"
                    >
                      Open Patient 360° →
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Add Patient Modal */}
      {showAddModal && (
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
                onClick={() => setShowAddModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="mt-5 space-y-4">
              {/* Basic Demographics */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 45 })}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Biological Sex / Gender</label>
                <div className="mt-1.5 flex gap-3">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                        formData.gender === g
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chronic Conditions Multi-select */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Clinical Conditions & Comorbidities
                  </label>
                  <span className="text-[10px] text-slate-400">Select all that apply</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableConditions.map((cond) => {
                    const selected = formData.conditions.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => toggleCondition(cond)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          selected
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Prescribed Medications */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Active Medications
                  </label>
                  <span className="text-[10px] text-slate-400">Select all that apply</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableMedications.map((med) => {
                    const selected = formData.medications.includes(med);
                    return (
                      <button
                        type="button"
                        key={med}
                        onClick={() => toggleMedication(med)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          selected
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {selected ? "✓ " : "+ "}
                        {med}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Baseline Vitals */}
              <div>
                <p className="text-xs font-bold text-slate-700">
                  Initial Baseline Physiological Measurements
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={formData.systolicBP}
                      onChange={(e) => setFormData({ ...formData, systolicBP: parseFloat(e.target.value) || 120 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={formData.diastolicBP}
                      onChange={(e) => setFormData({ ...formData, diastolicBP: parseFloat(e.target.value) || 80 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({ ...formData, heartRate: parseFloat(e.target.value) || 72 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      SpO2 Saturation (%)
                    </label>
                    <input
                      type="number"
                      value={formData.oxygenSaturation}
                      onChange={(e) => setFormData({ ...formData, oxygenSaturation: parseFloat(e.target.value) || 98 })}
                      className="mt-1 w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Automatic services provisioned */}
              <div className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">◈</span>
                  <p className="text-xs font-bold text-slate-800">
                    Automated Digital Twin & Portal Provisioning
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                  Saving this patient will automatically create their <strong>Digital Health Twin</strong>, initialize
                  physiological vital trends, auto-assign HIPAA research consent, and provision a personal <strong>PATIENT</strong> portal account (default password: <code className="font-mono font-bold text-blue-700">patient123</code>).
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                >
                  {submitting ? "Registering..." : "Register Patient & Provision Twin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Patients;