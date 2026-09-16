import { useNavigate } from "react-router-dom";

function Topbar({ title, subtitle }) {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "PATIENT";

  const initials = username
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl sm:px-8">
      {/* Page information */}
      <div className="min-w-0">
        <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 sm:block">
          MediSphere Healthcare Platform
        </p>

        <h1 className="mt-1 truncate text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-0.5 hidden text-xs text-slate-500 md:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Search (Doctors & Admin only) */}
        {role !== "PATIENT" && (
          <button
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:flex"
            onClick={() => navigate("/patients")}
          >
            <span className="text-sm">⌕</span>

            <span>Search patients...</span>

            <span className="ml-4 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-slate-400">
              /
            </span>
          </button>
        )}

        {/* Notification */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          aria-label="Notifications"
        >
          <span className="text-base">♢</span>

          <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="max-w-28 truncate text-xs font-semibold text-slate-700">
              {username}
            </p>

            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-500">
              {role}
            </p>
          </div>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:scale-[1.03]"
            title="Profile"
          >
            {initials || "U"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 lg:flex"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;