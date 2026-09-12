import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function RiskPredictions() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [twins, setTwins] = useState([]);
  const [vitals, setVitals] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientsResponse, twinsResponse, vitalsResponse] =
        await Promise.all([
          API.get("/patients"),
          API.get("/health-twins"),
          API.get("/vitals"),
        ]);

      setPatients(
        Array.isArray(patientsResponse.data)
          ? patientsResponse.data
          : []
      );

      setTwins(
        Array.isArray(twinsResponse.data)
          ? twinsResponse.data
          : []
      );

      setVitals(
        Array.isArray(vitalsResponse.data)
          ? vitalsResponse.data
          : []
      );
    } catch (err) {
      console.error("Failed to load risk prediction data:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load data for risk assessment."
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
      const id = patient.patientId || patient.id;

      if (id) {
        map[id] =
          patient.name ||
          patient.patientName ||
          "Unknown Patient";
      }
    });

    return map;
  }, [patients]);

  const twinMap = useMemo(() => {
    const map = {};

    twins.forEach((twin) => {
      const id = twin.patientId || twin.id;

      if (id) {
        map[id] = twin;
      }
    });

    return map;
  }, [twins]);

  const patientRiskData = useMemo(() => {
    const patientIds = new Set([
      ...patients.map((patient) => patient.patientId || patient.id),
      ...twins.map((twin) => twin.patientId || twin.id),
      ...vitals.map((vital) => vital.patientId),
    ]);

    return [...patientIds]
      .filter(Boolean)
      .map((patientId) => {
        const patientVitals = vitals.filter(
          (vital) =>
            String(vital.patientId) === String(patientId)
        );

        const latest =
          patientVitals.length > 0
            ? patientVitals[patientVitals.length - 1]
            : null;

        const twin = twinMap[patientId];

        return {
          patientId,
          patientName:
            patientMap[patientId] ||
            twin?.patientName ||
            "Unknown Patient",
          latest,
          twin,
          risk: calculateRisk(latest, twin),
        };
      });
  }, [patients, twins, vitals, patientMap, twinMap]);

  const filteredPatients = patientRiskData.filter(
    (patient) => {
      const query = search.trim().toLowerCase();

      const matchesPatient =
        selectedPatient === "ALL" ||
        String(patient.patientId) ===
          String(selectedPatient);

      const matchesSearch =
        !query ||
        String(patient.patientName)
          .toLowerCase()
          .includes(query) ||
        String(patient.patientId)
          .toLowerCase()
          .includes(query);

      return matchesPatient && matchesSearch;
    }
  );

  const highRiskCount = patientRiskData.filter(
    (item) => item.risk.level === "High"
  ).length;

  const mediumRiskCount = patientRiskData.filter(
    (item) => item.risk.level === "Medium"
  ).length;

  const lowRiskCount = patientRiskData.filter(
    (item) => item.risk.level === "Low"
  ).length;

  return (
    <AppLayout
      title="Risk Predictions"
      subtitle="AI-assisted patient risk assessment and clinical intelligence"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-7 py-9 shadow-xl shadow-blue-500/10 sm:px-10">
        <div className="relative z-10 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100">
            MediSphere AI Intelligence
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Risk Predictions
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
            Analyze patient health measurements and cognitive twin
            information to identify potential clinical risk patterns.
          </p>
        </div>

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

        <div className="absolute -bottom-32 right-28 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:flex">
          <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/10 text-5xl text-white backdrop-blur-sm">
            ✦
          </div>
        </div>
      </section>

      {/* Important notice */}
      <section className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            !
          </div>

          <div>
            <p className="text-xs font-bold text-amber-800">
              AI assessment preview
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              The current dashboard uses available patient and vital
              information to organize risk indicators. It does not
              represent a validated medical diagnosis or clinical
              prediction model.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Patients Assessed"
          value={loading ? "—" : patientRiskData.length}
          icon="♙"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="High Risk"
          value={loading ? "—" : highRiskCount}
          icon="!"
          iconClass="bg-red-50 text-red-600"
        />

        <StatCard
          label="Medium Risk"
          value={loading ? "—" : mediumRiskCount}
          icon="△"
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          label="Low Risk"
          value={loading ? "—" : lowRiskCount}
          icon="✓"
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* Filters */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Risk Registry
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-slate-800">
              Patient risk assessment
            </h3>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
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

      {/* Patient Risk Cards */}
      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Preparing risk assessment...
          </p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
            ✦
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-700">
            No patients found
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Try changing the patient filter or search.
          </p>
        </div>
      ) : (
        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => (
            <RiskCard
              key={patient.patientId}
              patient={patient}
              onOpenTwin={() =>
                navigate(
                  `/health-twins/${patient.patientId}`
                )
              }
            />
          ))}
        </section>
      )}

      {/* Risk Explanation */}
      <section className="mt-7 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md shadow-blue-500/20">
            ✦
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Cognitive Intelligence
            </p>

            <h3 className="mt-1 text-base font-extrabold text-slate-800">
              From patient data to intelligent insights
            </h3>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
              MediSphere is designed to combine FHIR-based patient
              information, physiological measurements and the
              Cognitive Twin foundation to support AI-powered
              healthcare analytics.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function RiskCard({ patient, onOpenTwin }) {
  const { risk, latest, twin } = patient;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div
        className={`h-1.5 ${risk.barClass}`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-600">
              {patient.patientName
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                {patient.patientName}
              </h3>

              <p className="mt-1 text-[10px] text-slate-400">
                {patient.patientId}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${risk.badgeClass}`}
          >
            {risk.level} Risk
          </span>
        </div>

        {/* Risk score */}
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Risk Indicator
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-800">
                {risk.score}
                <span className="ml-1 text-xs font-bold text-slate-400">
                  / 100
                </span>
              </p>
            </div>

            <span className="text-2xl">
              {risk.icon}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${risk.barClass}`}
              style={{
                width: `${risk.score}%`,
              }}
            />
          </div>
        </div>

        {/* Indicators */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Indicator
            label="Heart Rate"
            value={
              latest?.heartRate
                ? `${latest.heartRate} BPM`
                : "No data"
            }
          />

          <Indicator
            label="SpO₂"
            value={
              latest?.oxygenSaturation
                ? `${latest.oxygenSaturation}%`
                : "No data"
            }
          />

          <Indicator
            label="Blood Pressure"
            value={
              latest?.systolicBP
                ? `${latest.systolicBP}/${latest.diastolicBP}`
                : "No data"
            }
          />

          <Indicator
            label="Health Twin"
            value={twin ? "Connected" : "Not connected"}
          />
        </div>

        {/* Action */}
        <button
          onClick={onOpenTwin}
          className="mt-6 w-full rounded-xl border border-blue-100 bg-blue-50 py-3 text-xs font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
        >
          Open Cognitive Twin →
        </button>
      </div>
    </article>
  );
}

function Indicator({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function calculateRisk(vital, twin) {
  let score = 15;

  if (vital) {
    if (
      vital.heartRate != null &&
      (vital.heartRate < 50 ||
        vital.heartRate > 100)
    ) {
      score += 25;
    }

    if (
      vital.systolicBP != null &&
      (vital.systolicBP >= 140 ||
        vital.systolicBP < 90)
    ) {
      score += 25;
    }

    if (
      vital.diastolicBP != null &&
      (vital.diastolicBP >= 90 ||
        vital.diastolicBP < 60)
    ) {
      score += 15;
    }

    if (
      vital.oxygenSaturation != null &&
      vital.oxygenSaturation < 95
    ) {
      score += 30;
    }

    if (
      vital.temperature != null &&
      (vital.temperature >= 38 ||
        vital.temperature < 35)
    ) {
      score += 15;
    }
  }

  if (twin?.conditions?.length >= 2) {
    score += 10;
  }

  score = Math.min(score, 100);

  if (score >= 60) {
    return {
      score,
      level: "High",
      icon: "⚠",
      barClass: "bg-red-500",
      badgeClass: "bg-red-50 text-red-600",
    };
  }

  if (score >= 35) {
    return {
      score,
      level: "Medium",
      icon: "△",
      barClass: "bg-amber-500",
      badgeClass: "bg-amber-50 text-amber-600",
    };
  }

  return {
    score,
    level: "Low",
    icon: "✓",
    barClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-600",
  };
}

function StatCard({
  label,
  value,
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

          <p className="mt-2 text-2xl font-extrabold text-slate-800">
            {value}
          </p>
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

export default RiskPredictions;