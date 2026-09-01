import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { medicalRecordService } from '../../services/medicalRecordService';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { PatientDto, MedicalRecordDto, PrescriptionDto, AppointmentDto } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Pill,
  History,
  Calendar,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { toast } from 'react-toastify';

const MedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const stateData = location.state as { patientId?: number; apptId?: number; doctorId?: number } | null;

  // States
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [historyRecords, setHistoryRecords] = useState<MedicalRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Form Fields State
  const [patientId, setPatientId] = useState('');
  const [apptId, setApptId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  
  // Custom prescription builder state
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load patient list
      const pats = await patientService.getPatients('', 'ACTIVE', 0, 100);
      setPatients(pats.content);

      // Load appointments for today/yesterday to link
      const appts = await appointmentService.getAppointments({ status: 'CONFIRMED' });
      setAppointments(appts);

      // Check if redirected from clinical queue check
      if (stateData?.patientId) {
        setPatientId(String(stateData.patientId));
        if (stateData.apptId) setApptId(String(stateData.apptId));
      }
    } catch (err) {
      toast.error('Failed to load clinical registries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch patient medical records history when patient selection changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!patientId) {
        setHistoryRecords([]);
        return;
      }

      try {
        setHistoryLoading(true);
        const data = await medicalRecordService.getMedicalRecordsByPatient(Number(patientId));
        setHistoryRecords(data);
      } catch (err) {
        toast.error('Failed to load patient timeline history.');
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  const handleAddPrescription = () => {
    if (!medName || !dosage || !frequency || !duration) {
      toast.warn('Please complete medication name, dosage, frequency, and duration.');
      return;
    }

    const rxItem: PrescriptionDto = {
      patientId: Number(patientId),
      doctorId: Number(user?.id), // doctor logged in
      medicineName: medName,
      dosage,
      frequency,
      duration,
      instructions,
    };

    setPrescriptions(prev => [...prev, rxItem]);
    
    // Reset med fields
    setMedName('');
    setDosage('');
    setFrequency('');
    setDuration('');
    setInstructions('');
  };

  const handleRemovePrescription = (idx: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitEncounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !diagnosis || !symptoms || !treatment) {
      toast.warn('Please complete required diagnosis, symptoms, and treatment details.');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload: MedicalRecordDto = {
        patientId: Number(patientId),
        doctorId: Number(user?.id), // logged in user (must be a doctor)
        appointmentId: apptId ? Number(apptId) : undefined,
        diagnosis,
        symptoms,
        treatment,
        notes,
        prescriptions, // nested prescriptions list
      };

      await medicalRecordService.addMedicalRecord(payload);
      toast.success('Consultation encounter filed successfully.');

      // Reset form
      setDiagnosis('');
      setSymptoms('');
      setTreatment('');
      setNotes('');
      setApptId('');
      setPrescriptions([]);

      // Reload patient history timeline
      const updatedHistory = await medicalRecordService.getMedicalRecordsByPatient(Number(patientId));
      setHistoryRecords(updatedHistory);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to file medical record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Clinical Records Room</h1>
        <p className="text-slate-500 text-xs mt-1">Diagnose patients, issue prescriptions, and review timelines</p>
      </div>

      {loading ? (
        <div className="p-16 flex justify-center bg-white rounded-xl border border-slate-200">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left panel: File Encounter */}
          {user && ['ADMIN', 'DOCTOR'].includes(user.role) ? (
            <form onSubmit={handleSubmitEncounter} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ClipboardList className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold text-slate-800 text-sm">Consultation Diagnostics</h2>
              </div>

              {/* Patient Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Patient *</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                    required
                  >
                    <option value="">Choose Patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (ID: P-{p.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Related Appointment</label>
                  <select
                    value={apptId}
                    onChange={(e) => setApptId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                  >
                    <option value="">None / Walk-in</option>
                    {appointments
                      .filter(a => !patientId || String(a.patientId) === patientId)
                      .map(a => (
                        <option key={a.id} value={a.id}>{a.appointmentDate} - Dr. {a.doctorName}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Consultation Fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Symptoms Description *</label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe patient symptoms (e.g. sore throat, high fever, fatigue)..."
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Diagnosis / Assessment *</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter final diagnosis (e.g. Acute Tonsillitis, Influenza)..."
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Treatment Plan *</label>
                  <textarea
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    placeholder="Treatment details, prescription details, recommended rest..."
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Additional Clinical Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Recommended lifestyle shifts, diet adjustments, or warning symptoms..."
                    rows={1.5}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 resize-none"
                  />
                </div>
              </div>

              {/* Prescription builder */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                  <Pill className="w-3.5 h-3.5 text-primary-600 mr-2" />
                  Prescribe Medications
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      placeholder="e.g. Amoxicillin"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="e.g. 500mg / 1 tablet"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Frequency</label>
                    <input
                      type="text"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="e.g. Twice daily"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-500 mb-1">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 7 days"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-medium text-slate-500 mb-1">Special Instructions</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="e.g. Take after food"
                        className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50/50"
                      />
                      <button
                        type="button"
                        onClick={handleAddPrescription}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline prescription list */}
                {prescriptions.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 max-h-48 overflow-y-auto">
                    {prescriptions.map((rx, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0">
                        <div>
                          <span className="font-bold text-slate-800">{rx.medicineName}</span>
                          <span className="text-slate-500 text-[11px] ml-2">({rx.dosage} - {rx.frequency} - {rx.duration})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePrescription(idx)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Encounter */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Filing...' : 'Submit Encounter File'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-500 text-xs">
              Patients do not have write access to medical records. Please refer to your medical history timeline.
            </div>
          )}

          {/* Right panel: Timeline history */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-slate-500" />
                <h2 className="font-bold text-slate-800 text-sm">Patient Medical History Timeline</h2>
              </div>
              {historyRecords.length > 0 && (
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                  {historyRecords.length} Record{historyRecords.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* If no patient is selected */}
            {!patientId ? (
              <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-100">
                  📖
                </div>
                <span>Select a Patient to view their clinical history timeline.</span>
              </div>
            ) : historyLoading ? (
              <div className="p-16 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : historyRecords.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs">
                No past consultations or medical records have been filed for this patient.
              </div>
            ) : (
              /* Timeline */
              <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-200 max-h-[550px] overflow-y-auto pr-1">
                {historyRecords.map((mr) => (
                  <div key={mr.id} className="relative bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                    <div className="absolute -left-[24px] top-4.5 w-3 h-3 bg-slate-400 rounded-full ring-4 ring-white" />
                    
                    <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-bold text-slate-700">{mr.recordDate}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Consulted by {mr.doctorName}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Symptoms</span>
                        <p className="text-slate-700 font-medium">{mr.symptoms}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Diagnosis</span>
                        <p className="text-primary-800 font-bold">{mr.diagnosis}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Treatment Plan</span>
                        <p className="text-slate-700 font-medium">{mr.treatment}</p>
                      </div>
                      {mr.notes && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Notes</span>
                          <p className="text-slate-500 italic">{mr.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Prescriptions */}
                    {mr.prescriptions && mr.prescriptions.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Prescriptions</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {mr.prescriptions.map((rx) => (
                            <span key={rx.id} className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] py-0.5 px-2 rounded-full font-medium">
                              💊 {rx.medicineName} ({rx.dosage} - {rx.frequency})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
