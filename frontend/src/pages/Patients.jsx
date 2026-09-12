import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function Patients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadPatients();
  }, []);

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
      {/* Page header */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Patient Management
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
              Patient Records
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Access patient profiles, clinical information, physiological
              data and their complete 360° health view.
            </p>
          </div>

          <button
            onClick={loadPatients}
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            ↻ Refresh Records
          </button>
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
                Data Source
              </p>

              <p className="mt-2 text-lg font-extrabold text-emerald-600">
                MongoDB
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
              ✓
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
    </AppLayout>
  );
}

export default Patients;