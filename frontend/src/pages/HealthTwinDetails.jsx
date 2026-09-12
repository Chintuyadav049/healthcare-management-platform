import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function HealthTwinDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [twin, setTwin] = useState(null);
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [twinsResponse, patientResponse, vitalsResponse] =
        await Promise.all([
          API.get("/health-twins"),
          API.get(`/patients/${patientId}`),
          API.get(`/vitals/patient/${patientId}`),
        ]);

      const twins = Array.isArray(twinsResponse.data)
        ? twinsResponse.data
        : [];

      const selectedTwin = twins.find(
        (item) =>
          String(item.patientId || item.id) === String(patientId)
      );

      setTwin(selectedTwin || null);
      setPatient(patientResponse.data || null);

      setVitals(
        Array.isArray(vitalsResponse.data)
          ? vitalsResponse.data
          : []
      );
    } catch (err) {
      console.error("Failed to load health twin:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load the cognitive twin information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const latestVitals =
    vitals.length > 0 ? vitals[vitals.length - 1] : null;

  const patientName =
    twin?.patientName ||
    patient?.name ||
    "Unknown Patient";

  const conditions = Array.isArray(twin?.conditions)
    ? twin.conditions
    : [];

  const medications = Array.isArray(twin?.medications)
    ? twin.medications
    : [];

  return (
    <AppLayout
      title="Cognitive Twin"
      subtitle="Patient digital health representation and clinical intelligence"
    >
      {/* Back */}
      <button
        onClick={() => navigate("/health-twins")}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        ← Back to Health Twins
      </button>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading cognitive twin...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h3 className="mt-4 text-sm font-bold text-red-700">
            Unable to load health twin
          </h3>

          <p className="mt-2 text-xs text-red-500">
            {error}
          </p>

          <button
            onClick={loadData}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Patient Hero */}
          <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-7 py-8 shadow-xl shadow-blue-500/10 sm:px-10">
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-extrabold text-white backdrop-blur-sm">
                  {patientName
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                    Digital Health Twin
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                    {patientName}
                  </h2>

                  <p className="mt-1 text-xs text-blue-100">
                    Patient ID: {patientId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm lg:self-auto">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Cognitive Twin Active
              </div>
            </div>

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-36 right-24 h-72 w-72 rounded-full bg-white/10" />
          </section>

          {/* Overview Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Age"
              value={twin?.age ?? patient?.age ?? "—"}
              suffix={twin?.age || patient?.age ? "years" : ""}
              icon="♙"
              iconClass="bg-blue-50 text-blue-600"
            />

            <MetricCard
              label="Gender"
              value={twin?.gender || patient?.gender || "—"}
              icon="◉"
              iconClass="bg-cyan-50 text-cyan-600"
            />

            <MetricCard
              label="Conditions"
              value={conditions.length}
              suffix="recorded"
              icon="△"
              iconClass="bg-amber-50 text-amber-600"
            />

            <MetricCard
              label="Medications"
              value={medications.length}
              suffix="active"
              icon="✚"
              iconClass="bg-emerald-50 text-emerald-600"
            />
          </section>

          {/* Latest Vitals */}
          <section className="mt-6">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Physiological State
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-slate-800">
                Latest vital measurements
              </h3>
            </div>

            {latestVitals ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <VitalCard
                  label="Heart Rate"
                  value={latestVitals.heartRate}
                  unit="BPM"
                  icon="♡"
                />

                <VitalCard
                  label="Blood Pressure"
                  value={`${latestVitals.systolicBP || "—"}/${latestVitals.diastolicBP || "—"}`}
                  unit="mmHg"
                  icon="⌁"
                />

                <VitalCard
                  label="Temperature"
                  value={latestVitals.temperature}
                  unit="°C"
                  icon="♨"
                />

                <VitalCard
                  label="Oxygen Saturation"
                  value={latestVitals.oxygenSaturation}
                  unit="%"
                  icon="◉"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  ♡
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No vital measurements available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Vital data will appear here when measurements are recorded.
                </p>
              </div>
            )}
          </section>

          {/* Twin Information */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Conditions */}
            <InfoPanel
              title="Clinical Conditions"
              label="Known health conditions"
              items={conditions}
              type="condition"
            />

            {/* Medications */}
            <InfoPanel
              title="Medications"
              label="Current medication information"
              items={medications}
              type="medication"
            />
          </section>

          {/* Recent Vitals */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Monitoring History
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-slate-800">
                Recent vital measurements
              </h3>
            </div>

            {vitals.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                No monitoring records available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Recorded
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
                    </tr>
                  </thead>

                  <tbody>
                    {[...vitals]
                      .reverse()
                      .slice(0, 8)
                      .map((vital, index) => (
                        <tr
                          key={vital.id || index}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">
                            {formatDate(vital.recordedAt)}
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-slate-700">
                            {vital.heartRate ?? "—"}{" "}
                            <span className="text-[10px] font-medium text-slate-400">
                              BPM
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-slate-700">
                            {vital.systolicBP ?? "—"}/
                            {vital.diastolicBP ?? "—"}
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-slate-700">
                            {vital.temperature ?? "—"} °C
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-slate-700">
                            {vital.oxygenSaturation ?? "—"}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* AI Intelligence */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md shadow-blue-500/20">
                  ✦
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                    AI Clinical Intelligence
                  </p>

                  <h3 className="mt-1 text-base font-extrabold text-slate-800">
                    Risk prediction and intelligent monitoring
                  </h3>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                    This cognitive twin combines patient information and
                    physiological measurements to support future AI-powered
                    risk prediction and personalized clinical insights.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/risk-predictions")}
                className="rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition hover:bg-blue-700"
              >
                View Risk Predictions →
              </button>
            </div>
          </section>
        </>
      )}
    </AppLayout>
  );
}

function MetricCard({
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
              <span className="text-[10px] font-semibold text-slate-400">
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

function VitalCard({
  label,
  value,
  unit,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {label}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-extrabold text-slate-800">
              {value ?? "—"}
            </p>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {unit}
            </span>
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoPanel({
  title,
  label,
  items,
  type,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
        {label}
      </p>

      <h3 className="mt-1 text-lg font-extrabold text-slate-800">
        {title}
      </h3>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                type === "condition"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-400">
            No information recorded.
          </p>
        )}
      </div>
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

export default HealthTwinDetails;