import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function Vitals() {
  const [vitals, setVitals] = useState([]);
  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [vitalsResponse, patientsResponse] =
        await Promise.all([
          API.get("/vitals"),
          API.get("/patients"),
        ]);

      setVitals(
        Array.isArray(vitalsResponse.data)
          ? vitalsResponse.data
          : []
      );

      setPatients(
        Array.isArray(patientsResponse.data)
          ? patientsResponse.data
          : []
      );
    } catch (err) {
      console.error("Failed to load vitals:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load vital measurements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const patientMap = useMemo(() => {
    const map = {};

    patients.forEach((patient) => {
      const id =
        patient.patientId ||
        patient.id;

      if (id) {
        map[id] =
          patient.name ||
          patient.patientName ||
          "Unknown Patient";
      }
    });

    return map;
  }, [patients]);

  const filteredVitals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vitals.filter((vital) => {
      const patientId = String(
        vital.patientId || ""
      ).toLowerCase();

      const patientName = String(
        patientMap[vital.patientId] || ""
      ).toLowerCase();

      const matchesPatient =
        selectedPatient === "ALL" ||
        String(vital.patientId) ===
          String(selectedPatient);

      const matchesSearch =
        !query ||
        patientId.includes(query) ||
        patientName.includes(query);

      return matchesPatient && matchesSearch;
    });
  }, [
    vitals,
    selectedPatient,
    search,
    patientMap,
  ]);

  const latestVitals =
    filteredVitals.length > 0
      ? filteredVitals[filteredVitals.length - 1]
      : null;

  return (
    <AppLayout
      title="Vitals Monitoring"
      subtitle="Real-time physiological measurements across patients"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-7 py-9 shadow-xl shadow-blue-500/10 sm:px-10">
        <div className="relative z-10 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100">
            Clinical Monitoring
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Patient Vitals
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
            Monitor heart rate, blood pressure, temperature and
            oxygen saturation collected from the MediSphere
            healthcare platform.
          </p>
        </div>

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

        <div className="absolute -bottom-32 right-28 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:flex">
          <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/10 text-5xl text-white backdrop-blur-sm">
            ♡
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Measurements"
          value={loading ? "—" : vitals.length}
          icon="⌁"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="Patients Monitored"
          value={loading ? "—" : new Set(
            vitals.map((item) => item.patientId)
          ).size}
          icon="♙"
          iconClass="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          label="Latest Heart Rate"
          value={
            latestVitals?.heartRate ??
            "—"
          }
          suffix={
            latestVitals?.heartRate
              ? "BPM"
              : ""
          }
          icon="♡"
          iconClass="bg-red-50 text-red-500"
        />

        <StatCard
          label="Latest SpO₂"
          value={
            latestVitals?.oxygenSaturation ??
            "—"
          }
          suffix={
            latestVitals?.oxygenSaturation
              ? "%"
              : ""
          }
          icon="◉"
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* Filters */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Vital Registry
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-slate-800">
              Physiological measurements
            </h3>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* Patient Filter */}
            <select
              value={selectedPatient}
              onChange={(e) =>
                setSelectedPatient(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="ALL">
                All Patients
              </option>

              {patients.map((patient) => {
                const id =
                  patient.patientId ||
                  patient.id;

                return (
                  <option
                    key={id}
                    value={id}
                  >
                    {patient.name ||
                      patient.patientName ||
                      id}
                  </option>
                );
              })}
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search patient..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            onClick={loadData}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Vitals Table */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
            Monitoring History
          </p>

          <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <h3 className="text-lg font-extrabold text-slate-800">
              Recent vital measurements
            </h3>

            <span className="text-xs font-medium text-slate-400">
              {filteredVitals.length} records
            </span>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading vital measurements...
            </p>
          </div>
        ) : filteredVitals.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
              ♡
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-700">
              No vital records found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try changing the patient filter or search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Patient
                  </th>

                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Heart Rate
                  </th>

                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Blood Pressure
                  </th>

                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Temperature
                  </th>

                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    SpO₂
                  </th>

                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recorded
                  </th>
                </tr>
              </thead>

              <tbody>
                {[...filteredVitals]
                  .reverse()
                  .map((vital, index) => (
                    <tr
                      key={vital.id || index}
                      className="border-b border-slate-50 transition hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-extrabold text-blue-600">
                            {String(
                              patientMap[
                                vital.patientId
                              ] ||
                                vital.patientId ||
                                "PT"
                            )
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {patientMap[
                                vital.patientId
                              ] ||
                                "Unknown Patient"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {vital.patientId ||
                                "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <VitalValue
                          value={vital.heartRate}
                          unit="BPM"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <VitalValue
                          value={`${vital.systolicBP ?? "—"}/${vital.diastolicBP ?? "—"}`}
                          unit="mmHg"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <VitalValue
                          value={vital.temperature}
                          unit="°C"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <VitalValue
                          value={vital.oxygenSaturation}
                          unit="%"
                        />
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {formatDate(
                          vital.recordedAt
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Monitoring Information */}
      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <MonitoringCard
          icon="♡"
          title="Heart Rate"
          description="Tracks beats per minute to support continuous cardiovascular monitoring."
        />

        <MonitoringCard
          icon="⌁"
          title="Blood Pressure"
          description="Monitors systolic and diastolic pressure for cardiovascular assessment."
        />

        <MonitoringCard
          icon="◉"
          title="Oxygen Saturation"
          description="Tracks SpO₂ measurements to support respiratory monitoring."
        />
      </section>

      {/* AI Connection */}
      <section className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md shadow-blue-500/20">
            ✦
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Cognitive Intelligence
            </p>

            <h3 className="mt-1 text-base font-extrabold text-slate-800">
              Vitals power the MediSphere Cognitive Twin
            </h3>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
              Physiological measurements provide the foundation
              for monitoring patient health states and supporting
              future AI-driven risk prediction.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function StatCard({
  label,
  value,
  suffix,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {label}
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <p className="text-2xl font-extrabold text-slate-800">
              {value}
            </p>

            {suffix && (
              <span className="text-[10px] font-bold text-slate-400">
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function VitalValue({ value, unit }) {
  return (
    <div>
      <span className="text-sm font-extrabold text-slate-700">
        {value ?? "—"}
      </span>

      <span className="ml-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {unit}
      </span>
    </div>
  );
}

function MonitoringCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-extrabold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

export default Vitals;