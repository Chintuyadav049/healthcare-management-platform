import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function PatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        setLoading(true);
        setError("");

        const [patientResponse, vitalsResponse] =
          await Promise.all([
            API.get(`/patients/${patientId}`),
            API.get(`/vitals/patient/${patientId}`),
          ]);

        setPatient(patientResponse.data);

        setVitals(
          Array.isArray(vitalsResponse.data)
            ? vitalsResponse.data
            : []
        );
      } catch (err) {
        console.error("Failed to load patient:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this patient's information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [patientId]);

  const getPatientName = () => {
    if (!patient) return "Unknown Patient";

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

    return patient.patientName || "Unknown Patient";
  };

  const getLatestVital = (field) => {
    if (!vitals.length) return "—";

    const latest = vitals[vitals.length - 1];

    return latest[field] ?? "—";
  };

  const latestVital = vitals.length
    ? vitals[vitals.length - 1]
    : null;

  if (loading) {
    return (
      <AppLayout
        title="Patient 360°"
        subtitle="Loading clinical information"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading patient information...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !patient) {
    return (
      <AppLayout
        title="Patient 360°"
        subtitle="Patient clinical profile"
      >
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-red-500">
            !
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Unable to load patient
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Patient information was not found."}
          </p>

          <button
            onClick={() => navigate("/patients")}
            className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white"
          >
            ← Back to Patients
          </button>
        </div>
      </AppLayout>
    );
  }

  const name = getPatientName();

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <AppLayout
      title="Patient 360°"
      subtitle="Complete patient clinical overview"
    >
      {/* Back */}
      <button
        onClick={() => navigate("/patients")}
        className="mb-5 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
      >
        ← Back to Patients
      </button>

      {/* Patient Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xl font-extrabold text-white shadow-lg shadow-blue-500/20">
                {initials || "P"}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
                    {name}
                  </h2>

                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Patient ID:{" "}
                  <span className="font-semibold text-slate-700">
                    {patient.patientId || patient.id || patientId}
                  </span>
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {patient.gender || "Gender not available"}
                  {patient.birthDate
                    ? ` • DOB: ${patient.birthDate}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/vitals")}
                className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
              >
                View Vitals
              </button>

              <button
                onClick={() => navigate("/health-twins")}
                className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
              >
                Cognitive Twin →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vital Cards */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VitalCard
          title="Heart Rate"
          value={getLatestVital("heartRate")}
          unit="bpm"
          icon="♡"
          background="bg-rose-50"
          iconColor="text-rose-500"
        />

        <VitalCard
          title="Blood Pressure"
          value={
            latestVital
              ? `${latestVital.systolicBP ?? "—"}/${latestVital.diastolicBP ?? "—"}`
              : "—"
          }
          unit="mmHg"
          icon="♥"
          background="bg-blue-50"
          iconColor="text-blue-600"
        />

        <VitalCard
          title="Oxygen Saturation"
          value={getLatestVital("oxygenSaturation")}
          unit="%"
          icon="◉"
          background="bg-cyan-50"
          iconColor="text-cyan-600"
        />

        <VitalCard
          title="Temperature"
          value={getLatestVital("temperature")}
          unit="°C"
          icon="♨"
          background="bg-amber-50"
          iconColor="text-amber-600"
        />
      </section>

      {/* Main Clinical Information */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Personal information */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Patient Profile
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Personal information
            </h3>
          </div>

          <div className="grid gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
            <InfoItem
              label="Full Name"
              value={name}
            />

            <InfoItem
              label="Patient ID"
              value={patient.patientId || patient.id || patientId}
            />

            <InfoItem
              label="Gender"
              value={patient.gender || "Not available"}
            />

            <InfoItem
              label="Date of Birth"
              value={patient.birthDate || "Not available"}
            />

            <InfoItem
              label="Email"
              value={patient.email || "Not available"}
            />

            <InfoItem
              label="Phone"
              value={patient.phone || "Not available"}
            />
          </div>
        </div>

        {/* Clinical information */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Clinical Profile
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Health information
            </h3>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Conditions
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {Array.isArray(patient.conditions) &&
                patient.conditions.length > 0 ? (
                  patient.conditions.map((condition) => (
                    <span
                      key={condition}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600"
                    >
                      {condition}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    No conditions recorded
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Medications
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {Array.isArray(patient.medications) &&
                patient.medications.length > 0 ? (
                  patient.medications.map((medication) => (
                    <span
                      key={medication}
                      className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600"
                    >
                      {medication}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    No medications recorded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vitals History */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Physiological Data
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Recent vital measurements
            </h3>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-600">
            {vitals.length} Records
          </span>
        </div>

        {vitals.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              ♡
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              No vital records available
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Vital measurements will appear here when recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Heart Rate
                  </th>

                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Blood Pressure
                  </th>

                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    SpO₂
                  </th>

                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Temperature
                  </th>

                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recorded At
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {[...vitals]
                  .slice(-8)
                  .reverse()
                  .map((vital, index) => (
                    <tr
                      key={vital.id || vital._id || index}
                      className="transition hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {vital.heartRate ?? "—"}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          bpm
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {vital.systolicBP ?? "—"}/
                        {vital.diastolicBP ?? "—"}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          mmHg
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-600">
                          {vital.oxygenSaturation ?? "—"}%
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {vital.temperature ?? "—"} °C
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {vital.recordedAt
                          ? new Date(
                              vital.recordedAt
                            ).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Cognitive Twin */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-md shadow-blue-500/20">
                  ◈
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                    MediSphere Intelligence
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold text-slate-800">
                    Cognitive Health Twin
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                A digital representation of this patient's health state can
                combine clinical information and physiological measurements
                to support AI-powered health analysis and future risk
                prediction.
              </p>
            </div>

            <button
              onClick={() => navigate("/health-twins")}
              className="shrink-0 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Open Cognitive Twin →
            </button>
          </div>
        </div>
      </section>

      {/* AI Risk */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              AI Clinical Intelligence
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Health risk prediction
            </h3>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">
              Review predictive health insights generated from the patient's
              available clinical and physiological data.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                `/risk-predictions?patientId=${patientId}`
              )
            }
            className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
          >
            View AI Predictions →
          </button>
        </div>
      </section>
    </AppLayout>
  );
}

function VitalCard({
  title,
  value,
  unit,
  icon,
  background,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-800">
              {value}
            </span>

            <span className="text-xs font-medium text-slate-400">
              {unit}
            </span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${background} ${iconColor} text-lg`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

        <span className="text-[10px] font-semibold text-slate-400">
          Latest available reading
        </span>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default PatientDetails;