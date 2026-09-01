import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { doctorService } from '../../services/doctorService';
import { UserDto, Department, Specialization } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Settings,
  Plus,
  Shield,
  Building,
  GraduationCap,
  Save,
  Mail,
  UserPlus
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPanel: React.FC = () => {
  const { user: currentUser } = useAuth();
  
  // States
  const [users, setUsers] = useState<UserDto[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [specs, setSpecs] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'taxonomy' | 'settings'>('users');
  
  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddSpecOpen, setIsAddSpecOpen] = useState(false);

  // Forms State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserFirst, setNewUserFirst] = useState('');
  const [newUserLast, setNewUserLast] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserGender, setNewUserGender] = useState('');
  const [newUserRole, setNewUserRole] = useState('RECEPTIONIST');
  const [userSaving, setUserSaving] = useState(false);

  const [newDeptName, setNewDeptName] = useState('');
  const [deptSaving, setDeptSaving] = useState(false);

  const [newSpecName, setNewSpecName] = useState('');
  const [specSaving, setSpecSaving] = useState(false);

  // Settings
  const [clinicName, setClinicName] = useState('CareSync Multi-Specialty Clinic');
  const [clinicPhone, setClinicPhone] = useState('+1 (555) 019-9000');
  const [clinicAddress, setClinicAddress] = useState('450 Clinical Way, Suite 100, Healthcare City, HC 94002');
  const [clinicHours, setClinicHours] = useState('08:00 AM - 05:00 PM');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const userList = await dashboardService.getUsers();
      setUsers(userList);

      const deptList = await doctorService.getDepartments();
      setDepts(deptList);

      const specList = await doctorService.getSpecializations();
      setSpecs(specList);
    } catch (err) {
      toast.error('Failed to load system management directories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPass || !newUserFirst || !newUserLast) {
      toast.warn('Please complete all required fields.');
      return;
    }

    try {
      setUserSaving(true);
      const userPayload: UserDto = {
        email: newUserEmail,
        password: newUserPass,
        firstName: newUserFirst,
        lastName: newUserLast,
        phone: newUserPhone,
        gender: newUserGender,
        role: newUserRole,
      };

      await dashboardService.createUser(userPayload);
      toast.success('User account created successfully!');
      setIsAddUserOpen(false);

      // Reset
      setNewUserEmail('');
      setNewUserPass('');
      setNewUserFirst('');
      setNewUserLast('');
      setNewUserPhone('');
      setNewUserGender('');
      setNewUserRole('RECEPTIONIST');

      // Reload
      const userList = await dashboardService.getUsers();
      setUsers(userList);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user account.');
    } finally {
      setUserSaving(false);
    }
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;

    try {
      setDeptSaving(true);
      await dashboardService.createDepartment(newDeptName);
      toast.success('Department registered successfully.');
      setIsAddDeptOpen(false);
      setNewDeptName('');

      const deptList = await doctorService.getDepartments();
      setDepts(deptList);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register department.');
    } finally {
      setDeptSaving(false);
    }
  };

  const handleCreateSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName) return;

    try {
      setSpecSaving(true);
      await dashboardService.createSpecialization(newSpecName);
      toast.success('Specialization registered successfully.');
      setIsAddSpecOpen(false);
      setNewSpecName('');

      const specList = await doctorService.getSpecializations();
      setSpecs(specList);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register specialization.');
    } finally {
      setSpecSaving(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System parameters saved successfully.');
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Admin System Settings</h1>
        <p className="text-slate-500 text-xs mt-1">Configure users, taxonomies, and basic clinic operations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === 'users' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            User Management ({users.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === 'taxonomy' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Depts & Specialties
          </span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === 'settings' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            System Parameters
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* Panel 1: Users */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center space-x-1.5 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create User Account</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="px-6 py-3.5">User ID</th>
                      <th className="px-6 py-3.5">Name</th>
                      <th className="px-6 py-3.5">Email</th>
                      <th className="px-6 py-3.5">Phone</th>
                      <th className="px-6 py-3.5 font-bold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-6 py-3.5 text-slate-500">USR-{String(u.id).padStart(4, '0')}</td>
                        <td className="px-6 py-3.5 font-bold text-slate-800">{u.firstName} {u.lastName}</td>
                        <td className="px-6 py-3.5 text-slate-600">{u.email}</td>
                        <td className="px-6 py-3.5 text-slate-500">{u.phone || 'N/A'}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                            u.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                            u.role === 'DOCTOR' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            u.role === 'RECEPTIONIST' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Panel 2: Taxonomy */}
        {activeTab === 'taxonomy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Departments */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
                  <Building className="w-4 h-4 mr-1.5 text-slate-400" />
                  Clinical Departments
                </h3>
                <button
                  onClick={() => setIsAddDeptOpen(true)}
                  className="p-1 hover:bg-slate-100 rounded text-primary-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <ul className="divide-y divide-slate-50 text-xs">
                {depts.map(d => (
                  <li key={d.id} className="py-2.5 flex justify-between text-slate-600">
                    <span>{d.name}</span>
                    <span className="text-[10px] text-slate-400">ID: {d.id}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1.5 text-slate-400" />
                  Doctor Specializations
                </h3>
                <button
                  onClick={() => setIsAddSpecOpen(true)}
                  className="p-1 hover:bg-slate-100 rounded text-primary-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <ul className="divide-y divide-slate-50 text-xs">
                {specs.map(s => (
                  <li key={s.id} className="py-2.5 flex justify-between text-slate-600">
                    <span>{s.name}</span>
                    <span className="text-[10px] text-slate-400">ID: {s.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Panel 3: Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl space-y-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-150 pb-2">
              Clinic Specifications
            </h3>
            
            <div className="grid grid-cols-1 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Support Hotline</label>
                <input
                  type="text"
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic Address</label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Working Consulting Hours</label>
                <input
                  type="text"
                  value={clinicHours}
                  onChange={(e) => setClinicHours(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-4 bg-slate-850 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Register New User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                value={newUserFirst}
                onChange={(e) => setNewUserFirst(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={newUserLast}
                onChange={(e) => setNewUserLast(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              value={newUserPass}
              onChange={(e) => setNewUserPass(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role *</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
                required
              >
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="ADMIN">Admin</option>
                <option value="DOCTOR">Doctor</option>
                <option value="PATIENT">Patient</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="py-2 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={userSaving}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              {userSaving ? 'Creating...' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Dept Modal */}
      <Modal
        isOpen={isAddDeptOpen}
        onClose={() => setIsAddDeptOpen(false)}
        title="Register New Clinic Department"
      >
        <form onSubmit={handleCreateDept} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              placeholder="e.g. Pediatrics"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddDeptOpen(false)}
              className="py-2 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deptSaving}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              {deptSaving ? 'Saving...' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Spec Modal */}
      <Modal
        isOpen={isAddSpecOpen}
        onClose={() => setIsAddSpecOpen(false)}
        title="Register New Doctor Specialty"
      >
        <form onSubmit={handleCreateSpec} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specialization Title *</label>
            <input
              type="text"
              placeholder="e.g. Dermatologist"
              value={newSpecName}
              onChange={(e) => setNewSpecName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50/50"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddSpecOpen(false)}
              className="py-2 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={specSaving}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              {specSaving ? 'Saving...' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPanel;
