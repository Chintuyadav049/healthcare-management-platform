import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicalService } from '../../services/clinicalService';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { ClinicalOperationDto, PatientDto, DoctorDto, AppointmentDto } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Plus,
  ArrowRight,
  UserCheck,
  UserX,
  Stethoscope,
  Clock,
  ClipboardCheck,
  ClipboardList
} from 'lucide-react';
import { toast } from 'react-toastify';

const ClinicalQueue: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [queue, setQueue] = useState<ClinicalOperationDto[]>([]);
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedApptId, setSelectedApptId] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      const queueList = await clinicalService.getActiveQueue();
      setQueue(queueList);

      if (user && ['ADMIN', 'RECEPTIONIST'].includes(user.role)) {
        // Fetch active patients & doctors for check-in
        const pats = await patientService.getPatients('', 'ACTIVE', 0, 100);
        setPatients(pats.content);

        const docs = await doctorService.getAllDoctors();
        setDoctors(docs);

        // Fetch today's appointments that are BOOKED or CONFIRMED
        const todayStr = new Date().toISOString().split('T')[0];
        const appts = await appointmentService.getAppointments({ date: todayStr });
        setAppointments(appts.filter(a => a.status === 'BOOKED' || a.status === 'CONFIRMED'));
      }
    } catch (err) {
      toast.error('Failed to load clinical queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.warn('Please select a patient.');
      return;
    }

    try {
      setCheckingIn(true);
      
      const patId = Number(selectedPatientId);
      const docId = selectedDoctorId ? Number(selectedDoctorId) : undefined;
      const apptId = selectedApptId ? Number(selectedApptId) : undefined;

      await clinicalService.checkInPatient(patId, docId, apptId);
      toast.success('Patient checked in successfully!');
      setIsCheckInOpen(false);
      
      // Reset form
      setSelectedPatientId('');
      setSelectedDoctorId('');
      setSelectedApptId('');

      // Reload
      const queueList = await clinicalService.getActiveQueue();
      setQueue(queueList);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Patient is already in the queue.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleUpdateStatus = async (id: number, nextStatus: string) => {
    try {
      await clinicalService.updateStatus(id, nextStatus);
      toast.success(`Patient queue state updated to ${nextStatus.toLowerCase().replace('_', ' ')}`);
      
      // Reload
      const queueList = await clinicalService.getActiveQueue();
      setQueue(queueList);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update queue state.');
    }
  };

  // Helper to filter queue items by status
  const filterByStatus = (status: string) => {
    return queue.filter(item => item.status === status);
  };

  // Get current duration checked-in (in minutes)
  const getWaitingTime = (checkInStr?: string) => {
    if (!checkInStr) return '0 min';
    const checkIn = new Date(checkInStr);
    const diffMs = Date.now() - checkIn.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min`;
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Clinical Operations Queue</h1>
          <p className="text-slate-500 text-xs mt-1">Track patient routing stages from check-in to discharge</p>
        </div>

        {user && ['ADMIN', 'RECEPTIONIST'].includes(user.role) && (
          <button
            onClick={() => setIsCheckInOpen(true)}
            className="flex items-center justify-center py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all space-x-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Check-in Patient</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-16 flex justify-center bg-white rounded-xl border border-slate-200">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        /* Clinical Kanban Columns Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          
          {/* Column 1: WAITING */}
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/50 flex flex-col space-y-4 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-yellow-500" />
                Waiting Queue
              </h3>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                {filterByStatus('WAITING').length}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {filterByStatus('WAITING').map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{item.patientName}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Token: <strong>{item.tokenNumber}</strong></p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center">
                      <Clock className="w-2.5 h-2.5 mr-0.5" />
                      {getWaitingTime(item.checkInTime)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Doc: {item.doctorName}</div>
                  
                  <button
                    onClick={() => handleUpdateStatus(item.id!, 'CHECKED_IN')}
                    className="w-full py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>Check In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: CHECKED_IN */}
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/50 flex flex-col space-y-4 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
                Checked In
              </h3>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                {filterByStatus('CHECKED_IN').length}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {filterByStatus('CHECKED_IN').map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{item.patientName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Token: <strong>{item.tokenNumber}</strong></p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Doc: {item.doctorName}</div>

                  <button
                    onClick={() => handleUpdateStatus(item.id!, 'WITH_DOCTOR')}
                    className="w-full py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 text-[10px] font-bold rounded flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>Send to Doctor</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: WITH_DOCTOR */}
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/50 flex flex-col space-y-4 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                With Doctor
              </h3>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                {filterByStatus('WITH_DOCTOR').length}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {filterByStatus('WITH_DOCTOR').map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{item.patientName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Token: <strong>{item.tokenNumber}</strong></p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Doc: {item.doctorName}</div>

                  {user && ['ADMIN', 'DOCTOR'].includes(user.role) ? (
                    <button
                      onClick={() => navigate('/medical-records', { state: { patientId: item.patientId, apptId: item.appointmentId, doctorId: item.doctorId } })}
                      className="w-full py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold rounded flex items-center justify-center space-x-1 transition-colors"
                    >
                      <ClipboardList className="w-3.5 h-3.5 mr-1" />
                      <span>Diagnose</span>
                    </button>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic text-center py-1">Awaiting Consultation...</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: UNDER_TREATMENT */}
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/50 flex flex-col space-y-4 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                Under Treatment
              </h3>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                {filterByStatus('UNDER_TREATMENT').length}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {filterByStatus('UNDER_TREATMENT').map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{item.patientName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Token: <strong>{item.tokenNumber}</strong></p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Doc: {item.doctorName}</div>

                  <button
                    onClick={() => handleUpdateStatus(item.id!, 'COMPLETED')}
                    className="w-full py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold rounded flex items-center justify-center space-x-1 transition-colors"
                  >
                    <span>Complete Treatment</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 5: COMPLETED */}
          <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/50 flex flex-col space-y-4 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <ClipboardCheck className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                Completed
              </h3>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                {filterByStatus('COMPLETED').length}
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {filterByStatus('COMPLETED').map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{item.patientName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Token: <strong>{item.tokenNumber}</strong></p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Doc: {item.doctorName}</div>

                  <button
                    onClick={() => handleUpdateStatus(item.id!, 'DISCHARGED')}
                    className="w-full py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded flex items-center justify-center transition-colors"
                  >
                    <span>Discharge Patient</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Check-In Modal */}
      <Modal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        title="Check-In Patient Queue Token"
      >
        <form onSubmit={handleCheckInSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient *</label>
            <select
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                // Try to find matching appointment for today and prefill doctor
                const appt = appointments.find(a => String(a.patientId) === e.target.value);
                if (appt) {
                  setSelectedDoctorId(String(appt.doctorId));
                  setSelectedApptId(String(appt.id));
                }
              }}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (ID: P-{p.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assign Consult Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specializationName})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Link Booking Appointment</label>
            <select
              value={selectedApptId}
              onChange={(e) => setSelectedApptId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
            >
              <option value="">Choose Appointment</option>
              {appointments
                .filter(a => !selectedPatientId || String(a.patientId) === selectedPatientId)
                .map(a => (
                  <option key={a.id} value={a.id}>{a.appointmentTime.substring(0, 5)} - Dr. {a.doctorName} ({a.reason})</option>
                ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCheckInOpen(false)}
              className="py-2 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={checkingIn}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              {checkingIn ? 'Processing...' : 'Issue Token'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClinicalQueue;
