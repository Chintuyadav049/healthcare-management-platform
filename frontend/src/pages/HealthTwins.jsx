import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function HealthTwins() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "PATIENT";
  const username = localStorage.getItem("username") || "patient";

  const [twins, setTwins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTwins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/health-twins");
      const allTwins = Array.isArray(response.data) ? response.data : [];

      if (role === "PATIENT") {
        // Patients can ONLY view their own health twin
        const myTwin = allTwins.filter(
          (t) =>
            t.patientId === "patient-001" ||
            (t.patientName && t.patientName.toLowerCase().includes("john")) ||
            (t.patientId && t.patientId.toLowerCase() === username.toLowerCase())
        );
        setTwins(myTwin.length > 0 ? myTwin : allTwins.slice(0, 1));
      } else {
        setTwins(allTwins);
      }
    } catch (err) {
      console.error("Failed to load health twins:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load health twin records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTwins();
  }, [role]);

  const filteredTwins = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return twins;

    return twins.filter((twin) => {
      const name = String(
        twin.patientName || twin.name || ""
      ).toLowerCase();

      const id = String(
        twin.patientId || twin.id || ""
      ).toLowerCase();

      const conditions = Array.isArray(twin.conditions)
        ? twin.conditions.join(" ").toLowerCase()
        : String(twin.conditions || "").toLowerCase();

      return (
        name.includes(query) ||
        id.includes(query) ||
        conditions.includes(query)
      );
    });
  }, [twins, search]);

  const activeTwins = twins.length;

  return (
    <AppLayout
      title={role === "PATIENT" ? "My Health Twin" : "Health Twins"}
      subtitle={role === "PATIENT" ? "Your personalized health twin" : "Digital health twin models"}
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">
            {role === "PATIENT" ? "My Digital Health Twin" : "Cognitive Health Twins"}
          </h2>
          <p className="mt-2 text-xs text-blue-100">
            {role === "PATIENT"
              ? "Your current health twin profile and active medications."
              : "Digital models based on clinical measurements."}
          </p>
        </div>

        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 right-32 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:flex">
          <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <div className="text-5xl text-white">◈</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Health Twins"
          value={loading ? "—" : twins.length}
          icon="◈"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="Connected Patients"
          value={loading ? "—" : activeTwins}
          icon="♙"
          iconClass="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          label="Twin Status"
          value="Active"
          icon="✓"
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* Toolbar */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Cognitive Twin Registry
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Patient health twins
            </h3>
          </div>

          <div className="relative w-full sm:w-80">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search health twins..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading cognitive twins...
          </p>
        </div>
      ) : filteredTwins.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
            ◈
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-700">
            No health twins found
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {search
              ? "Try changing your search."
              : "Create a health twin to begin cognitive monitoring."}
          </p>
        </div>
      ) : (
        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTwins.map((twin, index) => {
            const patientId =
              twin.patientId || twin.id || `twin-${index}`;

            const patientName =
              twin.patientName ||
              twin.name ||
              "Unknown Patient";

            const conditions = Array.isArray(twin.conditions)
              ? twin.conditions
              : [];

            const medications = Array.isArray(twin.medications)
              ? twin.medications
              : [];

            return (
              <article
                key={patientId}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                {/* Card top */}
                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-600">
                        {patientName
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          {patientName}
                        </h3>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {patientId}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>

                  {/* Patient details */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Age
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {twin.age ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Gender
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {twin.gender || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="mt-5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Conditions
                    </p>

                    <div className="mt-2 flex min-h-7 flex-wrap gap-2">
                      {conditions.length > 0 ? (
                        conditions.slice(0, 3).map((condition) => (
                          <span
                            key={condition}
                            className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600"
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

                  {/* Medications */}
                  <div className="mt-5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Medications
                    </p>

                    <div className="mt-2 flex min-h-7 flex-wrap gap-2">
                      {medications.length > 0 ? (
                        medications.slice(0, 3).map((medication) => (
                          <span
                            key={medication}
                            className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600"
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

                  {/* Action */}
                  <button
                    onClick={() =>
                      navigate(`/health-twins/${patientId}`)
                    }
                    className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition hover:bg-blue-700"
                  >
                    Open Cognitive Twin →
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Explanation */}
      <section className="mt-7 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md shadow-blue-500/20">
            ✦
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              Why Cognitive Twins?
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              MediSphere connects patient information and physiological
              measurements into a digital health representation that can
              support monitoring, clinical analysis and future AI-powered
              risk prediction.
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

export default HealthTwins;