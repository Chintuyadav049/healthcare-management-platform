import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    UNKNOWN: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[status] || styles.UNKNOWN
      }`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status || "UNKNOWN"}
    </span>
  );
}

function Consent() {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadConsents();
  }, []);

  async function loadConsents() {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/consents");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setConsents(data);
    } catch (err) {
      console.error("Failed to load consents:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load consent records from the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  const normalizedConsents = useMemo(() => {
    return consents.map((consent, index) => {
      const status = String(
        consent.status ||
          consent.consentStatus ||
          consent.state ||
          "UNKNOWN"
      ).toUpperCase();

      return {
        ...consent,
        displayId:
          consent.id ||
          consent.consentId ||
          `CONSENT-${String(index + 1).padStart(3, "0")}`,
        patientId:
          consent.patientId ||
          consent.patient?.patientId ||
          consent.patient?.id ||
          "—",
        patientName:
          consent.patientName ||
          consent.patient?.name ||
          "Patient",
        purpose:
          consent.purpose ||
          consent.scope ||
          consent.accessPurpose ||
          "Healthcare data access",
        status,
        grantedAt:
          consent.grantedAt ||
          consent.createdAt ||
          consent.consentDate ||
          null,
      };
    });
  }, [consents]);

  const filteredConsents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return normalizedConsents.filter((consent) => {
      const matchesFilter =
        filter === "ALL" || consent.status === filter;

      const matchesSearch =
        !query ||
        consent.patientName.toLowerCase().includes(query) ||
        consent.patientId.toLowerCase().includes(query) ||
        consent.displayId.toLowerCase().includes(query) ||
        consent.purpose.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [normalizedConsents, search, filter]);

  const activeCount = normalizedConsents.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const revokedCount = normalizedConsents.filter(
    (item) => item.status === "REVOKED"
  ).length;

  const pendingCount = normalizedConsents.filter(
    (item) => item.status === "PENDING"
  ).length;

  const uniquePatients = new Set(
    normalizedConsents.map((item) => item.patientId)
  ).size;

  function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  }

  return (
    <AppLayout
      title="Consent & Privacy"
      subtitle="Manage patient data access, privacy permissions, and consent visibility."
    >
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-7 text-white shadow-xl sm:p-9">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Privacy & Access Control
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Patient data should stay under control.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
              Monitor consent status and understand which patient records
              can be accessed across the MediSphere healthcare platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-100">Privacy principle</p>
                <p className="mt-1 text-sm font-semibold">
                  Consent-based access
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-100">Security layer</p>
                <p className="mt-1 text-sm font-semibold">
                  Controlled patient data
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-blue-100">Platform focus</p>
                <p className="mt-1 text-sm font-semibold">
                  Privacy-aware healthcare
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy notice */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              🔐
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Why consent matters
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Consent provides a clear basis for accessing patient
                information. MediSphere can use consent information together
                with authentication and authorization controls to protect
                sensitive healthcare data.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Consents
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {normalizedConsents.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Consent records
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
            <p className="text-sm font-medium text-emerald-700">
              Active Access
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-800">
              {activeCount}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              Currently active
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 shadow-sm">
            <p className="text-sm font-medium text-amber-700">
              Pending
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-800">
              {pendingCount}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Awaiting confirmation
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5 shadow-sm">
            <p className="text-sm font-medium text-rose-700">
              Revoked
            </p>
            <p className="mt-2 text-3xl font-bold text-rose-800">
              {revokedCount}
            </p>
            <p className="mt-1 text-xs text-rose-700">
              Access withdrawn
            </p>
          </div>
        </section>

        {/* Access control */}
        <section className="grid gap-5 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Access governance
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Privacy control workflow
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Consent records provide visibility into whether patient
                  information is available for authorized healthcare use.
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl sm:flex">
                🛡️
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                  01
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Identify patient
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Associate access with the correct patient record.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                  02
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Check consent
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Verify whether the required permission is available.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                  03
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  Control access
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Allow authorized access while protecting patient privacy.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
              Coverage
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Patient visibility
            </h2>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
                👥
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {uniquePatients}
                </p>
                <p className="text-sm text-slate-500">
                  Patients represented
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm font-medium text-slate-700">
                Privacy-first architecture
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Authentication, authorization and consent checks work together
                to reduce unauthorized access to healthcare information.
              </p>
            </div>
          </div>
        </section>

        {/* Records */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Consent records
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Privacy & access records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review consent information returned by the MediSphere API.
                </p>
              </div>

              <button
                onClick={loadConsents}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                ↻ Refresh
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔎
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patient, consent ID, or purpose..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="REVOKED">Revoked</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-sm text-slate-500">
                Loading consent records...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="p-8">
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                <p className="font-semibold text-rose-800">
                  Unable to load consent data
                </p>

                <p className="mt-1 text-sm text-rose-700">
                  {error}
                </p>

                <button
                  onClick={loadConsents}
                  className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredConsents.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🔐
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No consent records found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search term or status filter.
              </p>
            </div>
          )}

          {!loading && !error && filteredConsents.length > 0 && (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Patient
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Consent
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Purpose
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Granted
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredConsents.map((consent) => (
                      <tr
                        key={consent.displayId}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">
                            {consent.patientName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {consent.patientId}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {consent.displayId}
                          </span>
                        </td>

                        <td className="max-w-xs px-6 py-4 text-sm text-slate-600">
                          {consent.purpose}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={consent.status} />
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(consent.grantedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="space-y-3 p-4 md:hidden">
                {filteredConsents.map((consent) => (
                  <div
                    key={consent.displayId}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {consent.patientName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {consent.patientId}
                        </p>
                      </div>

                      <StatusBadge status={consent.status} />
                    </div>

                    <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Consent ID
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {consent.displayId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Purpose
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {consent.purpose}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Granted
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {formatDate(consent.grantedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Security principles */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              🔑
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Authentication
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Users must be authenticated before protected healthcare
              resources can be accessed.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              🛡️
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Authorization
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Access permissions help ensure that users can perform only
              actions allowed by their assigned role.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              ✅
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Consent
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Patient consent adds an additional privacy layer for protected
              patient information.
            </p>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}

export default Consent;