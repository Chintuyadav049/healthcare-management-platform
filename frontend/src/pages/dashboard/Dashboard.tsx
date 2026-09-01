import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { DashboardStatsDto, AppointmentDto } from '../../types';
import { appointmentService } from '../../services/appointmentService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Stethoscope,
  Calendar,
  Activity,
  Plus,
  Clock,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { toast } from 'react-toastify';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [todayAppts, setTodayAppts] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardService.getStatistics();
        setStats(statsData);

        // Fetch today's appointments specifically
        const todayStr = new Date().toISOString().split('T')[0];
        const appts = await appointmentService.getAppointments({ date: todayStr });
        setTodayAppts(appts.slice(0, 5)); // show top 5 today
      } catch (err: any) {
        toast.error('Failed to load dashboard metrics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role !== 'PATIENT') {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const welcomeMessage = () => {
    const hours = new Date().getHours();
    let greet = 'Good Morning';
    if (hours >= 12 && hours < 17) greet = 'Good Afternoon';
    else if (hours >= 17) greet = 'Good Evening';
    return `${greet}, ${user?.firstName}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{welcomeMessage()}</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening in your clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Patients</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats?.totalPatients}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Doctors</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats?.totalDoctors}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-5">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Today's Appointments</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats?.todayAppointments}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Checked-In</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats?.pendingPatients}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/patients/add')}
            className="flex items-center justify-center p-3 border border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50/20 text-slate-700 hover:text-primary-600 rounded-lg text-xs font-semibold transition-all space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Patient</span>
          </button>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/doctors/add')}
              className="flex items-center justify-center p-3 border border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50/20 text-slate-700 hover:text-primary-600 rounded-lg text-xs font-semibold transition-all space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
          )}
          <button
            onClick={() => navigate('/appointments/book')}
            className="flex items-center justify-center p-3 border border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50/20 text-slate-700 hover:text-primary-600 rounded-lg text-xs font-semibold transition-all space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={() => navigate('/clinical')}
            className="flex items-center justify-center p-3 border border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50/20 text-slate-700 hover:text-primary-600 rounded-lg text-xs font-semibold transition-all space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Check-in Patient</span>
          </button>
        </div>
      </div>

      {/* Main Charts & Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle section: Charts & Today Appointments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Appointments per Day Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">Weekly Clinical Traffic</h3>
                <p className="text-slate-500 text-xs mt-0.5">Appointments scheduled over the last 7 days</p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                Live Feed
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.appointmentsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Appointments Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Today's Appointments</h3>
              <button
                onClick={() => navigate('/appointments')}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center"
              >
                View Calendar
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            {todayAppts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No appointments booked for today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="px-6 py-3">Patient</th>
                      <th className="px-6 py-3">Doctor</th>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todayAppts.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-bold text-slate-800">{appt.patientName}</td>
                        <td className="px-6 py-3.5 text-slate-600">{appt.doctorName}</td>
                        <td className="px-6 py-3.5 text-slate-600">{appt.appointmentTime.substring(0, 5)}</td>
                        <td className="px-6 py-3.5">
                          <Badge status={appt.status || 'BOOKED'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Demographics Pie Charts & Queues */}
        <div className="space-y-8">
          
          {/* Gender and Specialty Mini Charts */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Clinic Demographics</h3>
              <p className="text-slate-500 text-xs mt-0.5">Staff specialties and patient distributions</p>
            </div>
            
            {/* Doctors by Specialty Pie */}
            {stats?.doctorsBySpecialization && stats.doctorsBySpecialization.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Doctors by specialty</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.doctorsBySpecialization}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {stats.doctorsBySpecialization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconSize={8}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 9, color: '#64748b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Patients by Gender Pie */}
            {stats?.patientsByGender && stats.patientsByGender.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Patients by Gender</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.patientsByGender}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {stats.patientsByGender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconSize={8}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 9, color: '#64748b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats list */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Queue Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Checked-in Patients (Waiting)</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{stats?.patientsCheckedIn}</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Patients with Doctors (Consulting)</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{stats?.patientsUnderTreatment}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Completed / Discharged Today</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{stats?.completedAppointments}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
