import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { PatientDto } from '../../types';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

const Patients: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getPatients(searchTerm, statusFilter, page, pageSize);
      setPatients(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error('Failed to load patient records.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchPatients();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        await patientService.deletePatient(id);
        toast.success('Patient record deleted successfully.');
        fetchPatients();
      } catch (error) {
        toast.error('Failed to delete patient record.');
      }
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Patient Directory</h1>
          <p className="text-slate-500 text-xs mt-1">Manage clinical charts and registrations</p>
        </div>
        {user && ['ADMIN', 'RECEPTIONIST'].includes(user.role) && (
          <button
            onClick={() => navigate('/patients/add')}
            className="flex items-center justify-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all space-x-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 w-full">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, email or phone..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 text-xs">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
          >
            <option value="ALL">All Patients</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : patients.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            No patient records matched the current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Patient ID</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Age / Gender</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Blood Group</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-700">P-{String(patient.id).padStart(4, '0')}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800">{patient.firstName} {patient.lastName}</div>
                      <div className="text-[10px] text-slate-400">{patient.email}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {calculateAge(patient.dateOfBirth)} yrs / {patient.gender}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{patient.phone}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-700">{patient.bloodGroup || 'N/A'}</td>
                    <td className="px-6 py-3.5">
                      <Badge status={patient.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          title="View Details"
                          className="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50/50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user && ['ADMIN', 'RECEPTIONIST'].includes(user.role) && (
                          <>
                            <button
                              onClick={() => navigate(`/patients/edit/${patient.id}`)}
                              title="Edit Record"
                              className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50/50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {user.role === 'ADMIN' && (
                              <button
                                onClick={() => handleDelete(patient.id!)}
                                title="Delete Record"
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-xs">
              Showing page <strong>{page + 1}</strong> of <strong>{totalPages}</strong> ({totalElements} total patients)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
