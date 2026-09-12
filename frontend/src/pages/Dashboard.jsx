import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [healthTwins, setHealthTwins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [patientsResponse, vitalsResponse, twinsResponse] =
          await Promise.all([
            API.get("/patients"),
            API.get("/vitals"),
            API.get("/health-twins"),
          ]);

        setPatients(
          Array.isArray(patientsResponse.data)
            ? patientsResponse.data
            : []
        );

        setVitals(
          Array.isArray(vitalsResponse.data)
            ? vitalsResponse.data
            : []
        );

        setHealthTwins(
          Array.isArray(twinsResponse.data)
            ? twinsResponse.data
            : []
        );
      } catch (error) {
        console.error("Dashboard data loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Total Patients",
        value: patients.length,
        description: "Registered patients",
        icon: "♙",
      },
      {
        title: "Vitals Recorded",
        value: vitals.length,
        description: "Clinical measurements",
        icon: "♡",
      },
      {
        title: "Health Twins",
        value: healthTwins.length,
        description: "Active digital twins",
        icon: "◈",
      },
      {
        title: "AI Monitoring",
        value: "Active",
        description: "Risk intelligence running",
        icon: "✦",
      },
    ],
    []
  );

  const getPatientName = (patient) => {
    if (patient.name) {
      if (typeof patient.name === "string") return patient.name;

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

  const recentPatients = patients.slice(0, 5);

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Clinical operations and AI health intelligence"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-7 py-10 shadow-xl shadow-blue-500/10 sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
            Better Care • Smarter Insights • Healthier Tomorrow
          </p>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Welcome to MediSphere
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
            Monitor patients, physiological data, cognitive twins, and
            AI-powered clinical intelligence from one connected healthcare
            platform.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/patients")}
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              View Patients →
            </button>

            <button
              onClick={() => navigate("/health-twins")}
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Explore Health Twins
            </button>
          </div>
        </div>

        {/* Decorative medical elements */}
        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 right-24 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="flex h-44 w-44 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 text-6xl text-white">
              ♡
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800">
                  {loading ? "—" : stat.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                {stat.icon}
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              {stat.description}
            </p>
          </div>
        ))}
      </section>

      {/* Main content */}
      <section className="mt-7 grid gap-6 xl:grid-cols-[1.6fr_1fr]">

        {/* Recent Patients */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Patient Overview
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-800">
                Recent patient activity
              </h3>
            </div>

            <button
              onClick={() => navigate("/patients")}
              className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              Loading patient information...
            </div>
          ) : recentPatients.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                ♙
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                No patients found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Patient records will appear here once available.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPatients.map((patient, index) => {
                const patientId =
                  patient.patientId || patient.id || `patient-${index}`;

                return (
                  <div
                    key={patientId}
                    className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                        {getPatientName(patient)
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-700">
                          {getPatientName(patient)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          ID: {patientId}
                        </p>
                      </div>
                    </div>

                    <div className="hidden items-center gap-8 sm:flex">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Gender
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-600">
                          {patient.gender || "—"}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/patients/${patientId}`)
                        }
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                      >
                        360° View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Intelligence */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ✦
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                  AI Intelligence
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  Clinical insights
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-emerald-700">
                    Low Risk
                  </span>
                </div>

                <span className="text-2xl font-extrabold text-emerald-600">
                  {patients.length > 0 ? patients.length : "0"}
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-emerald-700/70">
                Patients currently available for routine clinical monitoring.
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                <span className="text-sm font-bold text-blue-700">
                  Cognitive Twins
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-blue-700/70">
                Digital patient models are available for health intelligence
                and predictive analysis.
              </p>

              <button
                onClick={() => navigate("/health-twins")}
                className="mt-4 text-xs font-bold text-blue-600"
              >
                Open Health Twins →
              </button>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

                <span className="text-sm font-bold text-amber-700">
                  Monitoring Active
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-amber-700/70">
                MediSphere is ready to process incoming physiological data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="mt-7">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
            Quick Access
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-800">
            Clinical workspace
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate("/patients")}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              ♙
            </div>

            <h4 className="mt-4 text-sm font-bold text-slate-800">
              Patient Records
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              View and manage patient information.
            </p>

            <span className="mt-4 block text-xs font-bold text-blue-600">
              Open records →
            </span>
          </button>

          <button
            onClick={() => navigate("/vitals")}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              ♡
            </div>

            <h4 className="mt-4 text-sm font-bold text-slate-800">
              Vital Monitoring
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Monitor physiological measurements.
            </p>

            <span className="mt-4 block text-xs font-bold text-blue-600">
              View vitals →
            </span>
          </button>

          <button
            onClick={() => navigate("/health-twins")}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              ◈
            </div>

            <h4 className="mt-4 text-sm font-bold text-slate-800">
              Cognitive Twins
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Explore digital health twin intelligence.
            </p>

            <span className="mt-4 block text-xs font-bold text-blue-600">
              Explore twins →
            </span>
          </button>

          <button
            onClick={() => navigate("/risk-predictions")}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              △
            </div>

            <h4 className="mt-4 text-sm font-bold text-slate-800">
              Risk Predictions
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Review AI-powered health risk insights.
            </p>

            <span className="mt-4 block text-xs font-bold text-blue-600">
              View predictions →
            </span>
          </button>
        </div>
      </section>

      {/* System status */}
      <section className="mt-7 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <p className="text-sm font-bold text-slate-800">
                MediSphere System Operational
              </p>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Backend services, patient data and clinical intelligence are
              connected.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-emerald-600 shadow-sm">
              API Connected
            </span>

            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-emerald-600 shadow-sm">
              MongoDB Connected
            </span>

            <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-blue-600 shadow-sm">
              AI Ready
            </span>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

export default Dashboard;