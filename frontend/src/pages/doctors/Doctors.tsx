import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { DoctorDto } from '../../types';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Phone, Mail, Award, DollarSign, CalendarCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAllDoctors(searchTerm);
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to load doctors directories.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this doctor from the system? This will delete their login user account.')) {
      try {
        await doctorService.deleteDoctor(id);
        toast.success('Doctor removed successfully.');
        fetchDoctors();
      } catch (error) {
        toast.error('Failed to delete doctor profile.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Clinical Staff & Doctors</h1>
          <p className="text-slate-500 text-xs mt-1">View availability, specializations, and fee details</p>
        </div>
        {user && user.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/doctors/add')}
            className="flex items-center justify-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all space-x-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, specialization, or department..."
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
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="p-16 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-16 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
          No doctor records found matching the criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              
              {/* Doctor Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 bg-primary-50 text-primary-700 font-bold rounded-lg border border-primary-100 flex items-center justify-center">
                      🩺
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Dr. {doc.firstName} {doc.lastName}</h3>
                      <p className="text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100 rounded px-1.5 py-0.5 inline-block mt-0.5">
                        {doc.specializationName}
                      </p>
                    </div>
                  </div>
                  <Badge status={doc.availabilityStatus} />
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-3 text-xs text-slate-600">
                  <div className="flex items-center">
                    <Award className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                    <span>{doc.qualification} ({doc.experience} yrs exp)</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarCheck className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                    <span>Dept: {doc.departmentName}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                    <span>Consultation Fee: <strong>${doc.consultationFee.toFixed(2)}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                    <span>{doc.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                    <span className="truncate">{doc.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              {user && (user.role === 'ADMIN' || (user.role === 'DOCTOR' && user.id === doc.userId)) && (
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/doctors/edit/${doc.id}`)}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                  >
                    Edit Profile
                  </button>
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDelete(doc.id!)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
