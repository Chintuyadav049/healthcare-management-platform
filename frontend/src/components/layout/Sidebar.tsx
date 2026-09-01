import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Activity,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  BarChart3,
  UserCheck,
  Plus
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    patients: false,
    doctors: false,
    appointments: false,
  });

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const hasRole = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  return (
    <aside className="fixed inset-y-0 left-0 bg-slate-900 text-slate-300 w-64 border-r border-slate-800 flex flex-col z-20 transition-transform duration-300 transform md:translate-x-0 -translate-x-full">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3 bg-slate-950">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white text-lg">
          🏥
        </div>
        <span className="font-bold text-white text-lg tracking-wider">CareSync</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5">
        {hasRole(['ADMIN', 'DOCTOR', 'RECEPTIONIST']) && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Dashboard
          </NavLink>
        )}

        {/* Patients Menu */}
        {hasRole(['ADMIN', 'RECEPTIONIST', 'DOCTOR']) && (
          <div>
            <button
              onClick={() => toggleMenu('patients')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white text-slate-300"
            >
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-3" />
                Patient Management
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenus.patients ? 'rotate-180' : ''}`} />
            </button>
            {openMenus.patients && (
              <div className="pl-11 mt-1 space-y-1">
                <NavLink
                  to="/patients"
                  end
                  className={({ isActive }) =>
                    `block py-2 px-3 text-xs rounded-md transition-colors ${
                      isActive ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  All Patients
                </NavLink>
                {hasRole(['ADMIN', 'RECEPTIONIST']) && (
                  <NavLink
                    to="/patients/add"
                    className={({ isActive }) =>
                      `block py-2 px-3 text-xs rounded-md transition-colors ${
                        isActive ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    Add Patient
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {/* Doctors Menu */}
        {hasRole(['ADMIN', 'RECEPTIONIST', 'DOCTOR']) && (
          <div>
            <button
              onClick={() => toggleMenu('doctors')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white text-slate-300"
            >
              <span className="flex items-center">
                <Stethoscope className="w-4 h-4 mr-3" />
                Doctor Management
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenus.doctors ? 'rotate-180' : ''}`} />
            </button>
            {openMenus.doctors && (
              <div className="pl-11 mt-1 space-y-1">
                <NavLink
                  to="/doctors"
                  end
                  className={({ isActive }) =>
                    `block py-2 px-3 text-xs rounded-md transition-colors ${
                      isActive ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  All Doctors
                </NavLink>
                {hasRole(['ADMIN']) && (
                  <NavLink
                    to="/doctors/add"
                    className={({ isActive }) =>
                      `block py-2 px-3 text-xs rounded-md transition-colors ${
                        isActive ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    Add Doctor
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {/* Appointments Menu */}
        {hasRole(['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT']) && (
          <div>
            <button
              onClick={() => toggleMenu('appointments')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white text-slate-300"
            >
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-3" />
                Appointments
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenus.appointments ? 'rotate-180' : ''}`} />
            </button>
            {openMenus.appointments && (
              <div className="pl-11 mt-1 space-y-1">
                <NavLink
                  to="/appointments"
                  end
                  className={({ isActive }) =>
                    `block py-2 px-3 text-xs rounded-md transition-colors ${
                      isActive ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  All Appointments
                </NavLink>
                {hasRole(['ADMIN', 'RECEPTIONIST', 'PATIENT']) && (
                  <NavLink
                    to="/appointments/book"
                    className={({ isActive }) =>
                      `block py-2 px-3 text-xs rounded-md transition-colors ${
                        isActive ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    Book Appointment
                  </NavLink>
                )}
              </div>
            )}
          </div>
        )}

        {/* Clinical Operations */}
        {hasRole(['ADMIN', 'RECEPTIONIST', 'DOCTOR']) && (
          <NavLink
            to="/clinical"
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Activity className="w-4 h-4 mr-3" />
            Clinical Operations
          </NavLink>
        )}

        {/* Medical Records (Doctors/Admins only) */}
        {hasRole(['ADMIN', 'DOCTOR']) && (
          <NavLink
            to="/medical-records"
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <FileText className="w-4 h-4 mr-3" />
            Medical Records
          </NavLink>
        )}

        {/* Reports (Admins only) */}
        {hasRole(['ADMIN']) && (
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Reports
          </NavLink>
        )}

        {/* Admin Panels */}
        {hasRole(['ADMIN']) && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Settings className="w-4 h-4 mr-3" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-col space-y-2">
        <div className="flex items-center space-x-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
            {user?.firstName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-slate-800/40 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
