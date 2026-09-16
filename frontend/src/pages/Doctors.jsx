import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    specialization: "Cardiovascular Medicine & Digital Health",
    department: "Cardiology & Twin Modeling",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/doctors");
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setError("Unable to load doctors list. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (doc) =>
        (doc.name && doc.name.toLowerCase().includes(q)) ||
        (doc.specialization && doc.specialization.toLowerCase().includes(q)) ||
        (doc.email && doc.email.toLowerCase().includes(q)) ||
        (doc.department && doc.department.toLowerCase().includes(q))
    );
  }, [doctors, search]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const response = await API.post("/doctors", formData);
      setShowAddModal(false);
      const username = formData.email?.includes("@")
        ? formData.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "")
        : formData.name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

      setSuccessToast(
        `Doctor ${response.data.name || formData.name} successfully added! Login account created: '${username}' (password: doctor123)`
      );
      setFormData({
        name: "",
        specialization: "Cardiovascular Medicine & Digital Health",
        department: "Cardiology & Twin Modeling",
        email: "",
        phone: "",
        licenseNumber: "",
      });
      loadDoctors();
      setTimeout(() => setSuccessToast(""), 8000);
    } catch (err) {
      console.error("Error creating doctor:", err);
      alert("Failed to create doctor: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await API.delete(`/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      setSuccessToast(`Doctor ${name} removed from clinical directory.`);
      setTimeout(() => setSuccessToast(""), 5000);
    } catch (err) {
      console.error("Failed to delete doctor:", err);
      alert("Failed to delete doctor.");
    }
  };

  const specializations = [
    "Cardiovascular Medicine & Digital Health",
    "Endocrinology & Metabolic Risk",
    "Critical Care & Clinical AI",
    "Internal Medicine & Prevention",
    "Neurology & Neurovascular Health",
    "Nephrology & Renal Care",
  ];

  return (
    <AppLayout
      title="Doctor Management"
      subtitle="Admin control center for clinical personnel & AI platform access"
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
              ✓
            </span>
            <p className="font-medium">{successToast}</p>
          </div>
          <button
            onClick={() => setSuccessToast("")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Role: System Administrator
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Medical Staff & Doctor Management
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Manage clinical physicians, assign hospital departments, and auto-provision
              secure DOCTOR role credentials for digital twin risk assessment and monitoring.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500"
            >
              <span className="text-lg leading-none">+</span> Add New Doctor
            </button>
            <button
              onClick={loadDoctors}
              className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              ↻ Refresh List
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Registered Doctors</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-800">
                {loading ? "—" : doctors.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
              ⚕
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Clinical specialists on platform</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Status</p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                {loading ? "—" : doctors.filter((d) => d.status !== "INACTIVE").length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
              ●
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Granted clinical twin access</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Departments</p>
              <p className="mt-2 text-3xl font-extrabold text-indigo-600">
                {loading ? "—" : new Set(doctors.map((d) => d.department || d.specialization)).size || 1}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
              🏢
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Cardiology, Endocrinology & AI</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Auto Provisioning</p>
              <p className="mt-2 text-lg font-bold text-blue-600">Enabled</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
              🔐
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Auto creates JWT DOCTOR login</p>
        </div>
      </section>

      {/* Doctor Directory Table */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Clinical Directory
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-800">
              Authorized Physicians & Specialists
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                ⌕
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, specialty, email..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
            >
              + Add Doctor
            </button>
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading doctor directory...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-500">
              ⚕
            </div>
            <h4 className="mt-4 text-sm font-bold text-slate-700">No doctors found</h4>
            <p className="mt-1 text-xs text-slate-400">
              {search ? "No matches found for your search." : "Click '+ Add New Doctor' to register your first clinical specialist."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Physician
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Specialization
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contact & License
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Access Role
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDoctors.map((doc) => {
                  const docInitials = (doc.name || "Dr")
                    .replace(/^Dr\.?\s*/i, "")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase() || "MD";

                  return (
                    <tr key={doc.id || doc.email} className="transition hover:bg-blue-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md shadow-blue-500/10">
                            {docInitials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                            <p className="text-xs text-slate-400">{doc.email || "No email"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {doc.specialization}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {doc.department || "Cardiology & Twin Modeling"}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-600">{doc.phone || "+1 (555) 000-0000"}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Lic: {doc.licenseNumber || "MD-STANDARD"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          DOCTOR (Active)
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {doc.id && (
                          <button
                            onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                            className="rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                            title="Remove doctor"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Admin Action
                </span>
                <h3 className="text-xl font-bold text-slate-800">Add New Doctor</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Julian Morales"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Specialization *</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Cardiology & Twin Modeling"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. j.morales@hospital.org"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 (555) 342-9182"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Medical License #</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="e.g. MD-901442"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                />
              </div>

              {/* Auto-provisioning info box */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔐</span>
                  <p className="text-xs font-bold text-blue-900">Auto-Provisioned Login Credentials</p>
                </div>
                <p className="mt-1 text-[11px] text-blue-700">
                  A user login account with role <strong className="text-blue-950">DOCTOR</strong> will be
                  automatically created with username derived from the doctor's email and default password{" "}
                  <code className="rounded bg-blue-100 px-1 font-mono font-bold text-blue-900">doctor123</code>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Saving Doctor..." : "Register Doctor & Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Doctors;
