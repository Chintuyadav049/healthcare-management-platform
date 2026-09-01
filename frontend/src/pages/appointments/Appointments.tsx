import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import { AppointmentDto, PatientDto, DoctorDto } from '../../types';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Clock,
  Trash2,
  CalendarDays,
  ListFilter,
  CheckCircle,
  XCircle,
  FileCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

const WORKING_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30'
];

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  // Filters State
  const [doctorIdFilter, setDoctorIdFilter] = useState('');
  const [patientIdFilter, setPatientIdFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Booking Form State
  const [bookPatientId, setBookPatientId] = useState('');
  const [bookDoctorId, setBookDoctorId] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookReason, setBookReason] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>(WORKING_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch patients & doctors for filters and booking dropdowns
      const docs = await doctorService.getAllDoctors();
      setDoctors(docs);

      if (user && ['ADMIN', 'RECEPTIONIST', 'DOCTOR'].includes(user.role)) {
        const pats = await patientService.getPatients('', 'ACTIVE', 0, 100);
        setPatients(pats.content);
      }

      await fetchAppointments();
    } catch (error) {
      toast.error('Failed to load clinic directories.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const filters: any = {};
      if (doctorIdFilter) filters.doctorId = Number(doctorIdFilter);
      if (patientIdFilter) filters.patientId = Number(patientIdFilter);
      if (dateFilter) filters.date = dateFilter;
      if (statusFilter !== 'ALL') filters.status = statusFilter;

      // Patients can only see their own appointments (enforced in frontend, validated in backend)
      if (user?.role === 'PATIENT') {
        filters.patientId = user.id;
      }
      // Doctors can filter or see their own
      if (user?.role === 'DOCTOR') {
        // If no filter selected, default to their doctor ID
        if (!doctorIdFilter) {
          // Find doctor profile mapping to login user id
          const docProfile = doctors.find(d => d.userId === user.id);
          if (docProfile) {
            filters.doctorId = docProfile.id;
          }
        }
      }

      const list = await appointmentService.getAppointments(filters);
      setAppointments(list);
    } catch (err) {
      console.error(err);
      toast.error('Failed to query appointments.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [doctorIdFilter, patientIdFilter, dateFilter, statusFilter, doctors]);

  // Load available time slots when date or doctor is selected in booking form
  useEffect(() => {
    const loadSlots = async () => {
      if (!bookDoctorId || !bookDate) {
        setAvailableSlots(WORKING_SLOTS);
        return;
      }

      try {
        setLoadingSlots(true);
        const bookedLocalTimes = await appointmentService.getDoctorAvailability(Number(bookDoctorId), bookDate);
        // Map booked times from "10:30:00" to "10:30"
        const bookedTimes = bookedLocalTimes.map(t => t.substring(0, 5));
        
        // Filter out booked times
        const filtered = WORKING_SLOTS.filter(slot => !bookedTimes.includes(slot));
        setAvailableSlots(filtered);
      } catch (err) {
        toast.error('Failed to check doctor availability slots.');
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [bookDoctorId, bookDate]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookPatientId || !bookDoctorId || !bookDate || !bookTime || !bookReason) {
      toast.warn('Please complete all required fields.');
      return;
    }

    try {
      setBookingInProgress(true);
      const apptPayload: AppointmentDto = {
        patientId: Number(bookPatientId),
        doctorId: Number(bookDoctorId),
        appointmentDate: bookDate,
        appointmentTime: bookTime + ':00', // format as LocalTime
        reason: bookReason,
        notes: bookNotes,
      };

      await appointmentService.bookAppointment(apptPayload);
      toast.success('Appointment booked successfully!');
      setIsBookModalOpen(false);
      
      // Reset form
      setBookPatientId('');
      setBookDoctorId('');
      setBookDate('');
      setBookTime('');
      setBookReason('');
      setBookNotes('');

      fetchAppointments();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Double booking detected. Try another slot.';
      toast.error(errMsg);
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await appointmentService.updateStatus(id, status);
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  // Calendar Calculations
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const array = [];
    for (let i = 1; i <= days; i++) {
      array.push(new Date(year, month, i));
    }
    return array;
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Clinical Scheduler</h1>
          <p className="text-slate-500 text-xs mt-1">Book consultations and manage daily queue schedules</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* View Toggles */}
          <div className="border border-slate-200 rounded-lg p-1 bg-white flex space-x-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 ${
                viewMode === 'table' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 ${
                viewMode === 'calendar' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Calendar</span>
            </button>
          </div>

          {user && ['ADMIN', 'RECEPTIONIST', 'PATIENT'].includes(user.role) && (
            <button
              onClick={() => {
                if (user.role === 'PATIENT') {
                  setBookPatientId(String(user.id));
                }
                setIsBookModalOpen(true);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {user?.role !== 'PATIENT' && (
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Patient</label>
            <select
              value={patientIdFilter}
              onChange={(e) => setPatientIdFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
            >
              <option value="">All Patients</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Doctor</label>
          <select
            value={doctorIdFilter}
            onChange={(e) => setDoctorIdFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
          >
            <option value="">All Doctors</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
          >
            <option value="ALL">All Statuses</option>
            <option value="BOOKED">Booked</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      {/* Main View Panel */}
      {loading ? (
        <div className="p-16 flex justify-center bg-white rounded-xl border border-slate-200">
          <LoadingSpinner size="lg" />
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-xs">
              No appointments found for the selected filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3.5">Appt ID</th>
                    <th className="px-6 py-3.5">Patient</th>
                    <th className="px-6 py-3.5">Doctor</th>
                    <th className="px-6 py-3.5">Date & Time</th>
                    <th className="px-6 py-3.5">Reason</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/20">
                      <td className="px-6 py-3.5 font-semibold text-slate-500">AP-{String(appt.id).padStart(4, '0')}</td>
                      <td className="px-6 py-3.5 font-bold text-slate-800">{appt.patientName}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-700">{appt.doctorName}</td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {appt.appointmentDate} at <strong>{appt.appointmentTime.substring(0, 5)}</strong>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{appt.reason}</td>
                      <td className="px-6 py-3.5">
                        <Badge status={appt.status || 'BOOKED'} />
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                          <div className="flex items-center justify-end space-x-1.5">
                            {user && ['ADMIN', 'RECEPTIONIST'].includes(user.role) && (
                              <button
                                onClick={() => handleUpdateStatus(appt.id!, 'CONFIRMED')}
                                title="Confirm Slot"
                                className="p-1 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(appt.id!, 'CANCELLED')}
                              title="Cancel Appt"
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleMonthChange('prev')}
                className="py-1 px-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-semibold"
              >
                Previous
              </button>
              <button
                onClick={() => handleMonthChange('next')}
                className="py-1 px-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-semibold"
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Blank placeholder spaces before start of month */}
            {Array.from({ length: days[0].getDay() }).map((_, i) => (
              <div key={`blank-${i}`} className="h-20 bg-slate-50/50 rounded-lg border border-transparent" />
            ))}
            
            {/* Days grids */}
            {days.map((day) => {
              const dateStr = day.toISOString().split('T')[0];
              const apptsToday = appointments.filter(a => a.appointmentDate === dateStr);
              return (
                <div
                  key={dateStr}
                  onClick={() => setDateFilter(dateStr)}
                  className={`h-20 p-2 border rounded-lg flex flex-col justify-between cursor-pointer transition-colors ${
                    dateFilter === dateStr
                      ? 'border-primary-500 bg-primary-50/10'
                      : 'border-slate-100 hover:border-slate-350 hover:bg-slate-50/20'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${dateFilter === dateStr ? 'text-primary-600' : 'text-slate-500'}`}>
                    {day.getDate()}
                  </span>
                  {apptsToday.length > 0 && (
                    <div className="bg-primary-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded text-center truncate">
                      {apptsToday.length} Appt{apptsToday.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Clinic Appointment"
      >
        <form onSubmit={handleBookAppointment} className="space-y-4">
          {user?.role !== 'PATIENT' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient *</label>
              <select
                value={bookPatientId}
                onChange={(e) => setBookPatientId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                required
              >
                <option value="">Choose Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (ID: P-{p.id})</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Booking for Patient</label>
              <div className="p-2 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700">
                {user.firstName} {user.lastName}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Doctor *</label>
            <select
              value={bookDoctorId}
              onChange={(e) => setBookDoctorId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
              required
            >
              <option value="">Choose Doctor</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specializationName})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
              {loadingSlots ? (
                <div className="p-2 flex justify-center border border-slate-200 bg-slate-50/50 rounded-lg">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <select
                  value={bookTime}
                  onChange={(e) => setBookTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                  required
                  disabled={!bookDate || !bookDoctorId}
                >
                  <option value="">Select Time</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit *</label>
            <input
              type="text"
              placeholder="e.g. Annual physical checkup, cardiac consult"
              value={bookReason}
              onChange={(e) => setBookReason(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes (Optional)</label>
            <textarea
              placeholder="Any additional details or context..."
              value={bookNotes}
              onChange={(e) => setBookNotes(e.target.value)}
              rows={2}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(false)}
              className="py-2 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookingInProgress}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              {bookingInProgress ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
