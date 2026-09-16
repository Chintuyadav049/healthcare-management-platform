import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import API from "../services/api";

function FHIR() {
  const [resources, setResources] = useState([]);
  const [resourceType, setResourceType] = useState("Patient");
  const [resourceId, setResourceId] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadResources = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * The current backend exposes POST /fhir for FHIR resources.
       * There is currently no GET /fhir endpoint, so the page keeps
       * successfully submitted resources in the current browser session.
       */
    } catch (err) {
      console.error(err);
      setError("Unable to load FHIR resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();

    const saved =
      sessionStorage.getItem("medisphere_fhir_resources");

    if (saved) {
      try {
        setResources(JSON.parse(saved));
      } catch {
        sessionStorage.removeItem(
          "medisphere_fhir_resources"
        );
      }
    }
  }, []);

  const submitFHIR = async () => {
    setMessage("");
    setError("");

    if (!jsonInput.trim()) {
      setError("Please enter a FHIR JSON resource.");
      return;
    }

    let resource;

    try {
      resource = JSON.parse(jsonInput);
    } catch {
      setError("Invalid JSON. Please check the resource format.");
      return;
    }

    if (!resource.resourceType) {
      setError(
        "FHIR validation failed: resourceType is required."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post("/fhir", resource);

      const submittedResource =
        response.data || resource;

      const resourceRecord = {
        ...submittedResource,
        _submittedAt: new Date().toISOString(),
      };

      const updated = [
        resourceRecord,
        ...resources,
      ];

      setResources(updated);

      sessionStorage.setItem(
        "medisphere_fhir_resources",
        JSON.stringify(updated)
      );

      setMessage(
        `${resource.resourceType} resource submitted successfully.`
      );

      setResourceId(resource.id || "");
    } catch (err) {
      console.error("FHIR submission failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "FHIR resource submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const loadExample = () => {
    setError("");
    setMessage("");

    if (resourceType === "Patient") {
      setJsonInput(
        JSON.stringify(
          {
            resourceType: "Patient",
            id: "patient-demo",
            name: [
              {
                use: "official",
                family: "Demo",
                given: ["Patient"],
              },
            ],
            gender: "male",
            birthDate: "1990-01-01",
          },
          null,
          2
        )
      );

      setResourceId("patient-demo");
      return;
    }

    setJsonInput(
      JSON.stringify(
        {
          resourceType,
          id: "demo-resource",
          status: "active",
        },
        null,
        2
      )
    );

    setResourceId("demo-resource");
  };

  const clearForm = () => {
    setJsonInput("");
    setResourceId("");
    setMessage("");
    setError("");
  };

  const filteredResources = resources.filter(
    (resource) => {
      const query = search.trim().toLowerCase();

      if (!query) return true;

      return (
        String(resource.resourceType || "")
          .toLowerCase()
          .includes(query) ||
        String(resource.id || "")
          .toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <AppLayout
      title="FHIR Resources"
      subtitle="Create and exchange interoperable healthcare resources"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-7 py-9 shadow-xl shadow-blue-500/10 sm:px-10">
        <div className="relative z-10 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100">
            Healthcare Interoperability
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            FHIR Resources
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
            Work with structured healthcare information using
            FHIR-compatible JSON resources and the MediSphere
            interoperability layer.
          </p>
        </div>

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

        <div className="absolute -bottom-32 right-28 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:flex">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-black text-white backdrop-blur-sm">
            FHIR
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Resources Submitted"
          value={resources.length}
          icon="F"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          label="Resource Type"
          value={resourceType}
          icon="◈"
          iconClass="bg-cyan-50 text-cyan-600"
        />

        <StatCard
          label="API Status"
          value="Connected"
          icon="✓"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          label="Format"
          value="JSON"
          icon="{}"
          iconClass="bg-violet-50 text-violet-600"
        />
      </section>

      {/* Main workspace */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Resource form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Resource Builder
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-slate-800">
              Submit FHIR resource
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Enter a valid FHIR JSON resource and submit it to
              the MediSphere backend.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Resource Type
              </label>

              <select
                value={resourceType}
                onChange={(e) => {
                  setResourceType(e.target.value);
                  setMessage("");
                  setError("");
                }}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >
                <option value="Patient">Patient</option>
                <option value="Observation">
                  Observation
                </option>
                <option value="Condition">
                  Condition
                </option>
                <option value="Medication">
                  Medication
                </option>
                <option value="Encounter">
                  Encounter
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Resource ID
              </label>

              <input
                value={resourceId}
                onChange={(e) =>
                  setResourceId(e.target.value)
                }
                placeholder="Optional resource ID"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                FHIR JSON
              </label>

              <button
                onClick={loadExample}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
              >
                Load Example
              </button>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) =>
                setJsonInput(e.target.value)
              }
              spellCheck="false"
              placeholder={`{
  "resourceType": "Patient",
  "id": "patient-demo"
}`}
              className="min-h-[330px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          {message && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={submitFHIR}
              disabled={submitting}
              className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : "Submit FHIR Resource"}
            </button>

            <button
              onClick={clearForm}
              className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Clear
            </button>
          </div>
        </div>

        {/* FHIR explanation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              FHIR Structure
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-slate-800">
              How MediSphere uses FHIR
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            <FHIRStep
              number="01"
              title="Create Resource"
              description="Healthcare information is represented as a structured FHIR resource."
            />

            <FHIRStep
              number="02"
              title="Validate Structure"
              description="The backend checks that the submitted resource contains the required FHIR structure."
            />

            <FHIRStep
              number="03"
              title="Submit to API"
              description="The frontend sends the JSON resource to the MediSphere FHIR endpoint."
            />

            <FHIRStep
              number="04"
              title="Connect Clinical Data"
              description="FHIR resources can form an interoperability layer for patient and clinical information."
            />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Example Resource
            </p>

            <div className="mt-3 rounded-xl bg-white p-4 font-mono text-[10px] leading-5 text-slate-600 shadow-sm">
              <div>
                <span className="text-blue-600">
                  resourceType
                </span>
                : <span>"Patient"</span>,
              </div>

              <div>
                <span className="text-blue-600">
                  id
                </span>
                : <span>"patient-demo"</span>,
              </div>

              <div>
                <span className="text-blue-600">
                  gender
                </span>
                : <span>"male"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submitted resources */}
      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Resource History
            </p>

            <h3 className="mt-1 text-lg font-extrabold text-slate-800">
              Submitted resources
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Resources submitted during this browser session.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              ⌕
            </span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search resources..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading resources...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
              F
            </div>

            <h4 className="mt-4 text-sm font-bold text-slate-700">
              No submitted resources
            </h4>

            <p className="mt-1 text-xs text-slate-400">
              Submit a FHIR resource to see it here.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Resource
                  </th>

                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    ID
                  </th>

                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Submitted
                  </th>

                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredResources.map(
                  (resource, index) => (
                    <tr
                      key={`${resource.id || "resource"}-${index}`}
                      className="border-b border-slate-50 transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                            F
                          </div>

                          <span className="text-xs font-bold text-slate-700">
                            {resource.resourceType ||
                              "Unknown"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {resource.id || "—"}
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {formatDate(
                          resource._submittedAt
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold text-emerald-700">
                          SUBMITTED
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Architecture */}
      <section className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-500/20">
            API
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              MediSphere Integration
            </p>

            <h3 className="mt-1 text-base font-extrabold text-slate-800">
              FHIR → Clinical Data → Cognitive Twin
            </h3>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
              FHIR provides a structured interoperability layer
              that can connect external healthcare information
              with the MediSphere patient platform and Cognitive
              Twin architecture.
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function FHIRStep({
  number,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-extrabold text-blue-600">
        {number}
      </div>

      <div>
        <h4 className="text-xs font-extrabold text-slate-700">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
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
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 truncate text-2xl font-extrabold text-slate-800">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

export default FHIR;