import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { medicalRecordService } from '../../services/medicalRecordService';
import { appointmentService } from '../../services/appointmentService';
import { PatientDto, MedicalRecordDto, AppointmentDto, PrescriptionDto } from '../../types';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  HeartHandshake,
  Calendar,
  FileText,
  Pill,
  ArrowLeft,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { toast } from 'react-toastify';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [patient, setPatient] = useState<PatientDto | null>(null);
  const [records, setRecords] = useState<MedicalRecordDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'timeline' | 'prescriptions'>('profile');

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const patientId = Number(id);

      const patientData = await patientService.getPatientById(patientId);
      setPatient(patientData);

      const recordsData = await medicalRecordService.getMedicalRecordsByPatient(patientId);
      setRecords(recordsData);

      const apptsData = await appointmentService.getAppointments({ patientId });
      setAppointments(apptsData);
    } catch (error) {
      toast.error('Failed to load patient profile data.');
      console.error(error);
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!patient) return null;

  // Extract all prescriptions across all records
  const allPrescriptions: PrescriptionDto[] = records.reduce((acc, curr) => {
    if (curr.prescriptions) {
      return [...acc, ...curr.prescriptions];
    }
    return acc;
  }, [] as PrescriptionDto[]);

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(user?.role === 'PATIENT' ? '/dashboard' : '/patients')}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-slate-500 text-xs">Back to Directory</span>
      </div>

      {/* Patient Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 bg-primary-50 border border-primary-200 text-primary-600 rounded-full flex items-center justify-center font-bold text-2xl">
            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-800">{patient.firstName} {patient.lastName}</h2>
              <Badge status={patient.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Patient ID: <strong>P-{String(patient.id).padStart(4, '0')}</strong> | Registered: {patient.registrationDate}
            </p>
          </div>
        </div>
        
        {user && ['ADMIN', 'RECEPTIONIST'].includes(user.role) && (
          <button
            onClick={() => navigate(`/patients/edit/${patient.id}`)}
            className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Edit Chart
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === 'profile' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            General Profile
          </span>
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === 'appointments' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Appointments ({appointments.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === 'timeline' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Medical History ({records.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors ${
            activeTab === 'prescriptions' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center">
            <Pill className="w-4 h-4 mr-2" />
            Prescriptions ({allPrescriptions.length})
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* Panel 1: Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Demographics Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Date of Birth</p>
                  <p className="text-slate-800 font-semibold mt-1">{patient.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Gender</p>
                  <p className="text-slate-800 font-semibold mt-1">{patient.gender}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Blood Group</p>
                  <p className="text-slate-800 font-semibold mt-1">{patient.bloodGroup || 'Not Specified'}</p>
                </div>
              </div>

              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 pt-4">
                Contact details
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center text-slate-600">
                  <Phone className="w-4 h-4 mr-3 text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Mail className="w-4 h-4 mr-3 text-slate-400" />
                  <span>{patient.email}</span>
                </div>
                {patient.address && (
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                    <span>{patient.address}</span>
                  </div>
                )}
                {patient.emergencyContact && (
                  <div className="flex items-center text-slate-600 pt-2 border-t border-slate-50">
                    <HeartHandshake className="w-4 h-4 mr-3 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Emergency Contact</span>
                      <span className="font-semibold">{patient.emergencyContact}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Context Box */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Known Allergies</h4>
                <p className="text-slate-600 text-xs bg-white p-3 rounded-lg border border-slate-100 min-h-[60px]">
                  {patient.allergies || 'No known allergies reported.'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Medical History Outline</h4>
                <p className="text-slate-600 text-xs bg-white p-3 rounded-lg border border-slate-100 min-h-[80px]">
                  {patient.medicalHistory || 'No previous medical history recorded.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Panel 2: Appointments */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {appointments.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs">
                No appointment history found for this patient.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="px-6 py-3.5">Appt ID</th>
                      <th className="px-6 py-3.5">Doctor</th>
                      <th className="px-6 py-3.5">Date & Time</th>
                      <th className="px-6 py-3.5">Reason</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="px-6 py-3.5 font-semibold text-slate-600">AP-{String(appt.id).padStart(4, '0')}</td>
                        <td className="px-6 py-3.5 font-bold text-slate-800">{appt.doctorName}</td>
                        <td className="px-6 py-3.5 text-slate-600">{appt.appointmentDate} at {appt.appointmentTime.substring(0, 5)}</td>
                        <td className="px-6 py-3.5 text-slate-600">{appt.reason}</td>
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
        )}

        {/* Panel 3: Medical History Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {records.length === 0 ? (
              <div className="bg-white p-16 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                No clinical records have been documented for this patient yet.
              </div>
            ) : (
              <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-200">
                {records.map((record) => (
                  <div key={record.id} className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    {/* Circle icon on timeline */}
                    <div className="absolute -left-[24px] top-6 w-3 h-3 bg-primary-600 rounded-full ring-4 ring-white" />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis date</span>
                        <span className="text-xs font-bold text-slate-700">{record.recordDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consulting Doctor</span>
                        <span className="text-xs font-semibold text-slate-800">{record.doctorName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Symptoms Description</h4>
                        <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-150">{record.symptoms}</p>
                      </div>
                      <div>
                        <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Diagnosis</h4>
                        <p className="text-slate-800 font-semibold bg-blue-50/30 p-2.5 rounded-lg border border-blue-100">{record.diagnosis}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Treatment Details</h4>
                        <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-150">{record.treatment}</p>
                      </div>
                      {record.notes && (
                        <div className="md:col-span-2">
                          <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">Clinical Notes</h4>
                          <p className="text-slate-600 italic bg-slate-50/50 p-2.5 rounded-lg border border-slate-150">{record.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Prescriptions under this specific record */}
                    {record.prescriptions && record.prescriptions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                          <Pill className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                          Prescribed Medication
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {record.prescriptions.map((rx) => (
                            <div key={rx.id} className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-lg text-xs">
                              <p className="font-bold text-emerald-800">{rx.medicineName} ({rx.dosage})</p>
                              <p className="text-slate-500 mt-1 text-[11px]">{rx.frequency} | {rx.duration}</p>
                              {rx.instructions && <p className="text-slate-400 text-[10px] italic mt-0.5">{rx.instructions}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Panel 4: Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {allPrescriptions.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs">
                No prescriptions recorded for this patient.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="px-6 py-3.5">Medicine Name</th>
                      <th className="px-6 py-3.5">Dosage</th>
                      <th className="px-6 py-3.5">Frequency</th>
                      <th className="px-6 py-3.5">Duration</th>
                      <th className="px-6 py-3.5">Instructions</th>
                      <th className="px-6 py-3.5">Doctor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPrescriptions.map((rx) => (
                      <tr key={rx.id} className="hover:bg-slate-50/20">
                        <td className="px-6 py-3.5 font-bold text-slate-800">{rx.medicineName}</td>
                        <td className="px-6 py-3.5 text-slate-600">{rx.dosage}</td>
                        <td className="px-6 py-3.5 text-slate-600">{rx.frequency}</td>
                        <td className="px-6 py-3.5 text-slate-600">{rx.duration}</td>
                        <td className="px-6 py-3.5 text-slate-500 italic">{rx.instructions || 'N/A'}</td>
                        <td className="px-6 py-3.5 text-slate-700">{rx.doctorName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PatientDetails;
