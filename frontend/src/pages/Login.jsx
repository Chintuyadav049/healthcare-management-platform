import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="relative hidden overflow-hidden lg:flex">

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-slate-950 to-blue-600/20" />

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* BRAND */}

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black shadow-lg shadow-cyan-500/20">
                  M
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    MediSphere
                  </h1>

                  <p className="text-xs text-slate-400">
                    Clinical Intelligence
                  </p>
                </div>

              </div>
            </div>

            {/* HERO */}

            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                AI-powered healthcare platform
              </div>

              <h2 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
                Smarter healthcare.
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Better outcomes.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Build intelligent digital health twins, monitor patients
                in real time and identify future health risks before they
                become critical.
              </p>

              {/* FEATURES */}

              <div className="mt-10 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="mb-3 text-2xl">◈</div>
                  <h3 className="text-sm font-semibold">
                    Digital Twins
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Complete patient health profiles.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="mb-3 text-2xl">⌁</div>
                  <h3 className="text-sm font-semibold">
                    AI Prediction
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Detect potential health risks.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
                  <div className="mb-3 text-2xl">♡</div>
                  <h3 className="text-sm font-semibold">
                    Live Monitoring
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Track patient vitals continuously.
                  </p>
                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>© 2026 MediSphere</span>
              <span>Secure Clinical Platform</span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center bg-slate-950 px-6 py-12 sm:px-10">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold">
                M
              </div>

              <div>
                <h1 className="font-bold">
                  MediSphere
                </h1>

                <p className="text-xs text-slate-500">
                  Clinical Intelligence
                </p>
              </div>

            </div>

            {/* HEADING */}

            <div className="mb-6">
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-cyan-400">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Sign in to your account
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Select a role to quick-fill credentials or enter your clinical account details.
              </p>

              {/* 1-Click Role Quick Fill */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsername("admin");
                    setPassword("admin123");
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                    username === "admin"
                      ? "border-purple-500 bg-purple-500/20 text-purple-300"
                      : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span>👑</span>
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsername("doctor");
                    setPassword("doctor123");
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                    username === "doctor"
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                      : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span>🩺</span>
                  <span>Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUsername("patient");
                    setPassword("patient123");
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                    username === "patient"
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span>👤</span>
                  <span>Patient</span>
                </button>
              </div>
            </div>

            {/* FORM */}

            <form onSubmit={handleLogin} className="space-y-5">

              {/* USERNAME */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  className="h-14 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Please contact your administrator to reset your password."
                      )
                    }
                    className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    Forgot password?
                  </button>

                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-14 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                />

              </div>

              {/* ERROR */}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold shadow-xl shadow-blue-600/10 transition hover:-translate-y-0.5 hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>

            </form>

            {/* SECURITY */}

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                ✓
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-300">
                  Secure authentication
                </p>

                <p className="mt-0.5 text-[11px] text-slate-600">
                  Protected with JWT-based access control.
                </p>
              </div>

            </div>

            {/* FOOTER */}

            <div className="mt-8 flex justify-between border-t border-slate-900 pt-5 text-[11px] text-slate-600">
              <span>MediSphere Healthcare Platform</span>
              <span>v1.0</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;