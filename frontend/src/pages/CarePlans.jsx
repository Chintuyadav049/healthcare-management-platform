import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function CarePlans() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "PATIENT";

  const [patients, setPatients] = useState([]);
  const [twins, setTwins] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patientsResponse, twinsResponse] =
        await Promise.all([
          API.get("/patients"),
          API.get("/health-twins"),
        ]);

      const allPatients = Array.isArray(patientsResponse.data) ? patientsResponse.data : [];
      const allTwins = Array.isArray(twinsResponse.data) ? twinsResponse.data : [];

      if (role === "PATIENT") {
        const myTwins = allTwins.filter(
          (t) => t.patientId === "patient-001" || (t.patientName && t.patientName.toLowerCase().includes("john"))
        );
        setTwins(myTwins.length > 0 ? myTwins : allTwins.slice(0, 1));
        setPatients(allPatients.filter((p) => p.patientId === "patient-001" || p.id === "patient-001"));
      } else {
        setPatients(allPatients);
        setTwins(allTwins);
      }
    } catch (err) {
      console.error("Failed to load care plan data:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load care plan information."
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
        map[id] = patient;
      }
    });

    return map;
  }, [patients]);

  /*
   * The current backend does not expose a dedicated /careplans
   * endpoint, so this page builds the care-plan overview from
   * the existing Patient + Cognitive Twin information.
   */
  const carePlans = useMemo(() => {
    return twins.map((twin, index) => {
      const patientId = twin.patientId;
      const patient = patientMap[patientId];

      const patientName =
        twin.patientName ||
        patient?.name ||
        patient?.patientName ||
        "Unknown Patient";

      const conditions = Array.isArray(twin.conditions)
        ? twin.conditions
        : [];

      const medications = Array.isArray(twin.medications)
        ? twin.medications
        : [];

      let planStatus = "ACTIVE";

      if (!patient && !twin.patientName) {
        planStatus = "REVIEW";
      }

      return {
        id: `care-plan-${patientId || index}`,
        patientId,
        patientName,
        age: twin.age ?? patient?.age ?? "—",
        gender: twin.gender || patient?.gender || "—",
        conditions,
        medications,
        status: planStatus,
        planTitle:
          conditions.length > 0
            ? `${conditions[0]} Care Plan`
            : "General Wellness Plan",
      };
    });
  }, [twins, patientMap]);

  const filteredPlans = carePlans.filter((plan) => {
    const query = search.trim().toLowerCase();

    const matchesStatus =
      status === "ALL" || plan.status === status;

    const matchesSearch =
      !query ||
      plan.patientName
        .toLowerCase()
        .includes(query) ||
      String(plan.patientId || "")
        .toLowerCase()
        .includes(query) ||
      plan.planTitle
        .toLowerCase()
        .includes(query);

    return matchesStatus && matchesSearch;
  });

  const activeCount = carePlans.filter(
    (plan) => plan.status === "ACTIVE"
  ).length;

  const reviewCount = carePlans.filter(
    (plan) => plan.status === "REVIEW"
  ).length;

  return (
    <AppLayout
      title={role === "PATIENT" ? "My Care Plan" : "Care Plans"}
      subtitle={
        role === "PATIENT"
          ? "Personalized clinical plan, active conditions and medications"
          : "Coordinate patient care using clinical information and Cognitive Twin insights"
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6 text-white shadow-md sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {role === "PATIENT" ? "My Health Care Plan" : "Patient Care Plans"}
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-blue-100 sm:text-sm">
            {role === "PATIENT"
              ? "Your active medical conditions, prescribed medications, and physician care directions."
              : "Organize patient conditions, medications, and clinical information into a clear care-management view."}
          </p>
        </div>

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 right-28 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:flex">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-4xl text-white backdrop-blur-sm">
            ✓
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={role === "PATIENT" ? "Care Directives" : "Total Care Plans"}
          value={loading ? "—" : carePlans.length}
          icon="+"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="Active Status"
          value={loading ? "—" : activeCount}
          icon="✓"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          label="Prescribed Meds"
          value={loading ? "—" : carePlans[0]?.medications?.length || 0}
          icon="💊"
          iconClass="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          label="Monitored Conditions"
          value={loading ? "—" : carePlans[0]?.conditions?.length || 0}
          icon="♙"
          iconClass="bg-cyan-50 text-cyan-600"
        />
      </section>

      {/* Filters (Hidden for Patient) */}
      {role !== "PATIENT" && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Care Management
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-slate-800">
                Patient care plans
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Review patient conditions and current medications.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >
                <option value="ALL">All Plans</option>
                <option value="ACTIVE">Active</option>
                <option value="REVIEW">Needs Review</option>
              </select>

              <div className="relative w-full sm:w-72">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patients or plans..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* Care Plans */}
      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading care plans...
          </p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
            +
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-700">
            No care plans found
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Try changing the search or status filter.
          </p>
        </div>
      ) : (
        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          {filteredPlans.map((plan) => (
            <CarePlanCard
              key={plan.id}
              plan={plan}
              onOpenTwin={() =>
                navigate(`/health-twins/${plan.patientId}`)
              }
              onOpenPatient={() =>
                navigate(`/patients/${plan.patientId}`)
              }
            />
          ))}
        </section>
      )}

      {/* Care workflow */}
      <section className="mt-7">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
            Care Workflow
          </p>

          <h3 className="mt-1 text-lg font-extrabold text-slate-800">
            Connected clinical information
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <WorkflowCard
            number="01"
            title="Patient Information"
            description="Review patient identity and available clinical information."
          />

          <WorkflowCard
            number="02"
            title="Cognitive Twin"
            description="Use the patient's digital health representation as a clinical context layer."
          />

          <WorkflowCard
            number="03"
            title="Care Coordination"
            description="Use the available information to support organized clinical follow-up."
          />
        </div>
      </section>

      {/* Future integration */}
      <section className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md shadow-blue-500/20">
            AI
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Cognitive Healthcare
            </p>

            <h3 className="mt-1 text-base font-extrabold text-slate-800">
              Care plans can evolve with patient data
            </h3>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
              As MediSphere receives new vitals, FHIR resources, and
              Cognitive Twin information, this section can be extended
              to support dynamic care-plan recommendations and clinical
              workflow automation.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function CarePlanCard({
  plan,
  onOpenTwin,
  onOpenPatient,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
            {getInitials(plan.patientName)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-extrabold text-slate-800">
                {plan.patientName}
              </h3>

              <StatusBadge status={plan.status} />
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Patient ID: {plan.patientId || "—"}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Plan
          </p>

          <p className="mt-1 max-w-32 truncate text-xs font-bold text-slate-700">
            {plan.planTitle}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoBox
          label="Age"
          value={plan.age}
        />

        <InfoBox
          label="Gender"
          value={plan.gender}
        />
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Conditions
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {plan.conditions.length > 0 ? (
            plan.conditions.map((condition, index) => (
              <span
                key={`${condition}-${index}`}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-700"
              >
                {condition}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">
              No conditions recorded
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Medications
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {plan.medications.length > 0 ? (
            plan.medications.map((medication, index) => (
              <span
                key={`${medication}-${index}`}
                className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700"
              >
                {medication}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">
              No medications recorded
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onOpenPatient}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Patient 360°
        </button>

        <button
          onClick={onOpenTwin}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
        >
          Open Cognitive Twin
        </button>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${styles}`}
    >
      {status === "ACTIVE"
        ? "ACTIVE"
        : "REVIEW"}
    </span>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function WorkflowCard({
  number,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-[10px] font-extrabold tracking-wider text-blue-600">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-extrabold text-slate-800">
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

function getInitials(name) {
  if (!name) return "?";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

export default CarePlans;