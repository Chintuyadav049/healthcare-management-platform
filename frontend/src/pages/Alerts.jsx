import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function Alerts() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientsResponse, vitalsResponse] =
        await Promise.all([
          API.get("/patients"),
          API.get("/vitals"),
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
    } catch (err) {
      console.error("Failed to load alert data:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load clinical alert information."
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

  const alerts = useMemo(() => {
    const generatedAlerts = [];

    vitals.forEach((vital, index) => {
      const patientId = vital.patientId;

      const patientName =
        patientMap[patientId] ||
        "Unknown Patient";

      const recordedAt = vital.recordedAt;

      if (
        vital.oxygenSaturation != null &&
        vital.oxygenSaturation < 90
      ) {
        generatedAlerts.push({
          id: `spo2-${patientId}-${index}`,
          patientId,
          patientName,
          type: "Low Oxygen Saturation",
          message: `Oxygen saturation is ${vital.oxygenSaturation}%.`,
          value: `${vital.oxygenSaturation}%`,
          severity: "HIGH",
          icon: "◉",
          recordedAt,
        });
      } else if (
        vital.oxygenSaturation != null &&
        vital.oxygenSaturation < 95
      ) {
        generatedAlerts.push({
          id: `spo2-${patientId}-${index}`,
          patientId,
          patientName,
          type: "Reduced Oxygen Saturation",
          message: `Oxygen saturation is ${vital.oxygenSaturation}%.`,
          value: `${vital.oxygenSaturation}%`,
          severity: "MEDIUM",
          icon: "◉",
          recordedAt,
        });
      }

      if (
        vital.heartRate != null &&
        (vital.heartRate < 50 ||
          vital.heartRate > 120)
      ) {
        generatedAlerts.push({
          id: `hr-${patientId}-${index}`,
          patientId,
          patientName,
          type: "Abnormal Heart Rate",
          message: `Heart rate is ${vital.heartRate} BPM.`,
          value: `${vital.heartRate} BPM`,
          severity: "HIGH",
          icon: "♡",
          recordedAt,
        });
      } else if (
        vital.heartRate != null &&
        (vital.heartRate < 60 ||
          vital.heartRate > 100)
      ) {
        generatedAlerts.push({
          id: `hr-${patientId}-${index}`,
          patientId,
          patientName,
          type: "Heart Rate Warning",
          message: `Heart rate is ${vital.heartRate} BPM.`,
          value: `${vital.heartRate} BPM`,
          severity: "MEDIUM",
          icon: "♡",
          recordedAt,
        });
      }

      if (
        vital.systolicBP != null &&
        vital.systolicBP >= 180
      ) {
        generatedAlerts.push({
          id: `bp-${patientId}-${index}`,
          patientId,
          patientName,
          type: "Critical Blood Pressure",
          message: `Systolic blood pressure is ${vital.systolicBP} mmHg.`,
          value: `${vital.systolicBP}/${vital.diastolicBP ?? "—"} mmHg`,
          severity: "HIGH",
          icon: "⌁",
          recordedAt,
        });
      } else if (
        vital.systolicBP != null &&
        vital.systolicBP >= 140
      ) {
        generatedAlerts.push({
          id: `bp-${patientId}-${index}`,
          patientId,
          patientName,
          type: "Elevated Blood Pressure",
          message: `Systolic blood pressure is ${vital.systolicBP} mmHg.`,
          value: `${vital.systolicBP}/${vital.diastolicBP ?? "—"} mmHg`,
          severity: "MEDIUM",
          icon: "⌁",
          recordedAt,
        });
      }

      if (
        vital.temperature != null &&
        vital.temperature >= 39
      ) {
        generatedAlerts.push({
          id: `temp-${patientId}-${index}`,
          patientId,
          patientName,
          type: "High Temperature",
          message: `Temperature is ${vital.temperature} °C.`,
          value: `${vital.temperature} °C`,
          severity: "HIGH",
          icon: "♨",
          recordedAt,
        });
      } else if (
        vital.temperature != null &&
        vital.temperature >= 38
      ) {
        generatedAlerts.push({
          id: `temp-${patientId}-${index}`,
          patientId,
          patientName,
          type: "Temperature Warning",
          message: `Temperature is ${vital.temperature} °C.`,
          value: `${vital.temperature} °C`,
          severity: "MEDIUM",
          icon: "♨",
          recordedAt,
        });
      }
    });

    return generatedAlerts.sort(
      (a, b) =>
        new Date(b.recordedAt || 0) -
        new Date(a.recordedAt || 0)
    );
  }, [vitals, patientMap]);

  const filteredAlerts = alerts.filter((alert) => {
    const query = search.trim().toLowerCase();

    const matchesSeverity =
      severity === "ALL" ||
      alert.severity === severity;

    const matchesSearch =
      !query ||
      alert.patientName
        .toLowerCase()
        .includes(query) ||
      alert.patientId
        .toLowerCase()
        .includes(query) ||
      alert.type
        .toLowerCase()
        .includes(query);

    return matchesSeverity && matchesSearch;
  });

  const highCount = alerts.filter(
    (alert) => alert.severity === "HIGH"
  ).length;

  const mediumCount = alerts.filter(
    (alert) => alert.severity === "MEDIUM"
  ).length;

  return (
    <AppLayout
      title="Clinical Alerts"
      subtitle="Monitor abnormal physiological measurements and patient safety indicators"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6 text-white shadow-md sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Clinical Alerts & Triage
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-blue-100 sm:text-sm">
            Real-time automated threshold alerts based on continuous patient vital telemetry.
          </p>
        </div>

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 right-28 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:flex">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-4xl text-white backdrop-blur-sm">
            !
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Alerts"
          value={loading ? "—" : alerts.length}
          icon="!"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="High Priority"
          value={loading ? "—" : highCount}
          icon="⚠"
          iconClass="bg-red-50 text-red-600"
        />

        <StatCard
          label="Medium Priority"
          value={loading ? "—" : mediumCount}
          icon="△"
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          label="Monitoring Status"
          value="Active"
          icon="✓"
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* Filters */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Alert Center
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-slate-800">
              Active monitoring alerts
            </h3>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <select
              value={severity}
              onChange={(e) =>
                setSeverity(e.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="ALL">
                All Priorities
              </option>

              <option value="HIGH">
                High Priority
              </option>

              <option value="MEDIUM">
                Medium Priority
              </option>
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
                placeholder="Search alerts..."
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

      {/* Alerts */}
      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Analyzing patient measurements...
          </p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600">
            ✓
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-700">
            No active alerts
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            No abnormal measurements match the selected filters.
          </p>
        </div>
      ) : (
        <section className="mt-6 space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onOpenTwin={() =>
                navigate(
                  `/health-twins/${alert.patientId}`
                )
              }
            />
          ))}
        </section>
      )}

      {/* Alert Types */}
      <section className="mt-7">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
            Monitoring Signals
          </p>

          <h3 className="mt-1 text-lg font-extrabold text-slate-800">
            Alert categories
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <AlertType
            icon="♡"
            title="Heart Rate"
            description="Detects unusually low or high heart-rate measurements."
          />

          <AlertType
            icon="⌁"
            title="Blood Pressure"
            description="Highlights elevated systolic blood-pressure measurements."
          />

          <AlertType
            icon="◉"
            title="Oxygen Saturation"
            description="Identifies reduced oxygen saturation measurements."
          />

          <AlertType
            icon="♨"
            title="Temperature"
            description="Highlights elevated body-temperature measurements."
          />
        </div>
      </section>

      {/* AI / Kafka connection */}
      <section className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md shadow-blue-500/20">
            ⚡
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Real-Time Architecture
            </p>

            <h3 className="mt-1 text-base font-extrabold text-slate-800">
              Ready for Kafka-powered clinical events
            </h3>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
              The current page analyzes stored vital measurements.
              Once Kafka event processing is connected, the same
              alert center can receive and display new clinical
              events in near real time.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function AlertCard({ alert, onOpenTwin }) {
  const isHigh = alert.severity === "HIGH";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div
        className={`h-1 ${
          isHigh
            ? "bg-red-500"
            : "bg-amber-500"
        }`}
      />

      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${
              isHigh
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {alert.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-800">
                {alert.type}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                  isHigh
                    ? "bg-red-50 text-red-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {isHigh
                  ? "HIGH"
                  : "MEDIUM"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {alert.message}
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-medium text-slate-400">
              <span>
                Patient:{" "}
                <strong className="text-slate-600">
                  {alert.patientName}
                </strong>
              </span>

              <span>
                ID:{" "}
                <strong className="text-slate-600">
                  {alert.patientId}
                </strong>
              </span>

              <span>
                {formatDate(alert.recordedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:shrink-0">
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Measurement
            </p>

            <p className="mt-1 text-sm font-extrabold text-slate-700">
              {alert.value}
            </p>
          </div>

          <button
            onClick={onOpenTwin}
            className="rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            View Twin
          </button>
        </div>
      </div>
    </article>
  );
}

function AlertType({
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

function formatDate(value) {
  if (!value) return "Unknown time";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

export default Alerts;