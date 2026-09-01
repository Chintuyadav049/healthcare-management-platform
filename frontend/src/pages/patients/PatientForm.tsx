import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { patientService } from '../../services/patientService';
import { PatientDto } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Save, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const patientSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  dateOfBirth: zod.string().min(1, 'Date of birth is required'),
  gender: zod.string().min(1, 'Gender is required'),
  bloodGroup: zod.string().optional(),
  phone: zod.string().min(8, 'Phone number must be at least 8 digits'),
  email: zod.string().min(1, 'Email is required').email('Invalid email format'),
  address: zod.string().optional(),
  emergencyContact: zod.string().optional(),
  medicalHistory: zod.string().max(2000, 'History details too long').optional(),
  allergies: zod.string().max(1000, 'Allergy details too long').optional(),
  status: zod.string().default('ACTIVE'),
});

type PatientFormValues = zod.infer<typeof patientSchema>;

const PatientForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      status: 'ACTIVE',
      bloodGroup: '',
      gender: '',
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const loadPatient = async () => {
        try {
          setLoading(true);
          const data = await patientService.getPatientById(Number(id));
          // Prepopulate form values
          reset({
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            bloodGroup: data.bloodGroup || '',
            phone: data.phone,
            email: data.email,
            address: data.address || '',
            emergencyContact: data.emergencyContact || '',
            medicalHistory: data.medicalHistory || '',
            allergies: data.allergies || '',
            status: data.status,
          });
        } catch (error) {
          toast.error('Failed to load patient records.');
          navigate('/patients');
        } finally {
          setLoading(false);
        }
      };
      loadPatient();
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (values: PatientFormValues) => {
    setSaving(true);
    try {
      const payload: PatientDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        bloodGroup: values.bloodGroup || '',
        phone: values.phone,
        email: values.email,
        address: values.address || '',
        emergencyContact: values.emergencyContact || '',
        medicalHistory: values.medicalHistory || '',
        allergies: values.allergies || '',
        status: values.status,
      };

      if (isEditMode) {
        await patientService.updatePatient(Number(id), payload);
        toast.success('Patient record updated successfully.');
      } else {
        await patientService.createPatient(payload);
        toast.success('Patient record created successfully.');
      }
      navigate('/patients');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to save patient record.';
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => navigate('/patients')}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {isEditMode ? 'Edit Patient Chart' : 'New Patient Registration'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {isEditMode ? 'Modify details of existing chart profile' : 'Create a new clinical chart profile'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
            Demographic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name *</label>
              <input
                type="text"
                {...register('firstName')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name *</label>
              <input
                type="text"
                {...register('lastName')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth *</label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.dateOfBirth ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-[10px] mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender *</label>
              <select
                {...register('gender')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.gender ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
              <select
                {...register('bloodGroup')}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
              >
                <option value="">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {isEditMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status *</label>
                <select
                  {...register('status')}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 pt-4">
            Contact & Address Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number *</label>
              <input
                type="text"
                {...register('phone')}
                placeholder="555-0100"
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
              <input
                type="email"
                {...register('email')}
                placeholder="name@email.com"
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Residential Address</label>
              <input
                type="text"
                {...register('address')}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Emergency Contact Details</label>
              <input
                type="text"
                {...register('emergencyContact')}
                placeholder="Name - Phone Number"
                className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
              />
            </div>
          </div>

          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 pt-4">
            Medical Context
          </h3>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Medical History / Chronic Conditions</label>
              <textarea
                {...register('medicalHistory')}
                rows={3}
                placeholder="e.g. Hypertension, Diabetes, Asthma..."
                className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Known Allergies</label>
              <textarea
                {...register('allergies')}
                rows={2}
                placeholder="e.g. Penicillin, Peanuts, Pollen..."
                className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="py-2 px-4 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm hover:shadow disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
