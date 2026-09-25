import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role") || "PATIENT";

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname.startsWith(path);
  };

  let mainNavigation = [];
  let clinicalNavigation = [];

  if (role === "ADMIN") {
    mainNavigation = [
      { label: "Admin Dashboard", path: "/dashboard", icon: "⌂" },
      { label: "Doctors", path: "/doctors", icon: "⚕" },
      { label: "Patients", path: "/patients", icon: "♙" },
      { label: "Health Twins", path: "/health-twins", icon: "◈" },
      { label: "Vitals", path: "/vitals", icon: "♡" },
      { label: "Risk Predictions & FL", path: "/risk-predictions", icon: "△" },
    ];
    clinicalNavigation = [
      { label: "System Alerts", path: "/alerts", icon: "!" },
      { label: "Care Plans", path: "/careplans", icon: "✓" },
      { label: "FHIR Resources", path: "/fhir", icon: "◉" },
      { label: "Consent Registry", path: "/consent", icon: "◇" },
    ];
  } else if (role === "DOCTOR") {
    mainNavigation = [
      { label: "Doctor Dashboard", path: "/dashboard", icon: "⌂" },
      { label: "Patient Roster", path: "/patients", icon: "♙" },
      { label: "Health Twins", path: "/health-twins", icon: "◈" },
      { label: "Vitals Monitoring", path: "/vitals", icon: "♡" },
      { label: "AI Risk Models", path: "/risk-predictions", icon: "△" },
    ];
    clinicalNavigation = [
      { label: "Clinical Alerts", path: "/alerts", icon: "!" },
      { label: "Care Plans", path: "/careplans", icon: "✓" },
      { label: "FHIR Resources", path: "/fhir", icon: "◉" },
      { label: "Patient Consent", path: "/consent", icon: "◇" },
    ];
  } else {
    // PATIENT
    mainNavigation = [
      { label: "My Health Twin", path: "/dashboard", icon: "⌂" },
      { label: "Digital Twin 360°", path: "/health-twins", icon: "◈" },
      { label: "My Vitals", path: "/vitals", icon: "♡" },
      { label: "My Risk Assessment", path: "/risk-predictions", icon: "△" },
    ];
    clinicalNavigation = [
      { label: "My Alerts & Wearables", path: "/alerts", icon: "!" },
      { label: "My Care Plans", path: "/careplans", icon: "✓" },
      { label: "My Consent & Privacy", path: "/consent", icon: "◇" },
    ];
  }

  const renderNavigation = (items) =>
    items.map((item) => {
      const active = isActive(item.path);

      return (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            active
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition ${
              active
                ? "bg-blue-100 text-blue-600"
                : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
            }`}
          >
            {item.icon}
          </span>

          <span>{item.label}</span>
        </button>
      );
    });

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-black text-white shadow-md shadow-blue-500/20">
          M
        </div>

        <div>
          <p className="text-[17px] font-bold tracking-tight text-slate-800">
            Medi<span className="text-blue-600">Sphere</span>
          </p>

          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-500">
            Cognitive Twin
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">

        {/* Overview */}
        <div>
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Overview
          </p>

          <div className="space-y-1">
            {renderNavigation(mainNavigation)}
          </div>
        </div>

        {/* Clinical */}
        <div className="mt-8">
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Clinical
          </p>

          <div className="space-y-1">
            {renderNavigation(clinicalNavigation)}
          </div>
        </div>
      </nav>

      {/* Secure System */}
      <div className="border-t border-slate-100 p-4">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-semibold text-slate-700">
              System Secure
            </span>
          </div>

          <p className="mt-2 text-[10px] leading-5 text-slate-500">
            Clinical data access is protected and audited.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;