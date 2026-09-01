import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Activity, ShieldAlert, KeyRound, Mail, Eye, EyeOff } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().min(1, 'Email is required').email('Invalid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await login({ email: values.email, password: values.password });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Pane - Medical Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white p-12 relative overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        {/* Brand */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-xl backdrop-blur-sm">
            🏥
          </div>
          <span className="font-bold text-xl tracking-wider">CareSync</span>
        </div>

        {/* Content */}
        <div className="my-auto max-w-md z-10 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Integrated Healthcare & Clinical Operations
          </h1>
          <p className="text-primary-100 text-sm leading-relaxed">
            Manage scheduling, patient files, receptionist check-ins, and doctor medical records on one unified, secure platform.
          </p>
          <div className="flex items-center space-x-3 text-xs text-primary-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Secure Clinical Operations Management Active</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-primary-300 z-10">
          &copy; {new Date().getFullYear()} CareSync Technologies Inc. All rights reserved.
        </p>
      </div>

      {/* Right Pane - Form Card */}
      <div className="flex flex-col justify-center items-center bg-slate-50 px-6 py-12 md:px-12 lg:px-20">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-xs mt-1">Please sign in to access CareSync</p>
          </div>

          {/* Backend Error Alert */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg flex items-center border border-rose-200">
              <ShieldAlert className="w-4 h-4 mr-2.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                    errors.email 
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20' 
                      : 'border-slate-200 focus:border-primary-500 bg-slate-50/50'
                  }`}
                  placeholder="name@clinic.com"
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-[11px] font-medium mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors ${
                    errors.password 
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20' 
                      : 'border-slate-200 focus:border-primary-500 bg-slate-50/50'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-[11px] font-medium mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 border-slate-300 w-3.5 h-3.5" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-primary-600 hover:underline font-semibold">Forgot password?</a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default Login;
