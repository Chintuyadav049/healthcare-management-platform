import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { doctorService } from '../../services/doctorService';
import { DoctorDto, Specialization, Department } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Save, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const doctorSchema = zod.object({
  firstName: zod.string().min(1, 'First name is required'),
  lastName: zod.string().min(1, 'Last name is required'),
  email: zod.string().min(1, 'Email is required').email('Invalid email format'),
  phone: zod.string().min(8, 'Phone number must be at least 8 digits'),
  gender: zod.string().min(1, 'Gender is required'),
  specializationId: zod.string().min(1, 'Specialization is required'),
  departmentId: zod.string().min(1, 'Department is required'),
  licenseNumber: zod.string().min(1, 'License number is required'),
  qualification: zod.string().min(1, 'Qualification is required'),
  experience: zod.string().min(1, 'Experience is required'),
  consultationFee: zod.string().min(1, 'Consultation fee is required'),
  availabilityStatus: zod.string().default('AVAILABLE'),
  password: zod.string().optional(),
});

type DoctorFormValues = zod.infer<typeof doctorSchema>;

const DoctorForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      availabilityStatus: 'AVAILABLE',
      gender: '',
      specializationId: '',
      departmentId: '',
    }
  });

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const specs = await doctorService.getSpecializations();
        setSpecializations(specs);

        const depts = await doctorService.getDepartments();
        setDepartments(depts);
      } catch (err) {
        toast.error('Failed to load dropdown directories.');
      }
    };

    loadDropdownData();
  }, []);

  useEffect(() => {
    if (isEditMode && specializations.length > 0 && departments.length > 0) {
      const loadDoctor = async () => {
        try {
          setLoading(true);
          const data = await doctorService.getDoctorById(Number(id));
          reset({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            specializationId: String(data.specializationId),
            departmentId: String(data.departmentId),
            licenseNumber: data.licenseNumber,
            qualification: data.qualification,
            experience: String(data.experience),
            consultationFee: String(data.consultationFee),
            availabilityStatus: data.availabilityStatus,
          });
        } catch (error) {
          toast.error('Failed to load doctor profile.');
          navigate('/doctors');
        } finally {
          setLoading(false);
        }
      };
      loadDoctor();
    }
  }, [id, isEditMode, reset, navigate, specializations, departments]);

  const onSubmit = async (values: DoctorFormValues) => {
    setSaving(true);
    try {
      const payload: DoctorDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        specializationId: Number(values.specializationId),
        departmentId: Number(values.departmentId),
        licenseNumber: values.licenseNumber,
        qualification: values.qualification,
        experience: Number(values.experience),
        consultationFee: Number(values.consultationFee),
        availabilityStatus: values.availabilityStatus,
        password: values.password || '',
      };

      if (isEditMode) {
        await doctorService.updateDoctor(Number(id), payload);
        toast.success('Doctor profile updated successfully.');
      } else {
        await doctorService.createDoctor(payload);
        toast.success('Doctor profile created successfully.');
      }
      navigate('/doctors');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to save doctor details.';
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
          onClick={() => navigate('/doctors')}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {isEditMode ? 'Edit Doctor Profile' : 'Add New Clinical Doctor'}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            {isEditMode ? 'Modify profile credentials and department settings' : 'Register a new clinician and credentials in CareSync'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
            Clinician Credentials
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number *</label>
              <input
                type="text"
                {...register('phone')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message}</p>}
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

            {!isEditMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Login Password *</label>
                <input
                  type="password"
                  placeholder="doctor123"
                  {...register('password')}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                />
              </div>
            )}
          </div>

          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2 pt-4">
            Practice Details & Specializations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Specialization *</label>
              <select
                {...register('specializationId')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.specializationId ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              >
                <option value="">Choose Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>
              {errors.specializationId && <p className="text-red-500 text-[10px] mt-1">{errors.specializationId.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Department *</label>
              <select
                {...register('departmentId')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.departmentId ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              >
                <option value="">Choose Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.departmentId && <p className="text-red-500 text-[10px] mt-1">{errors.departmentId.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Medical License Number *</label>
              <input
                type="text"
                {...register('licenseNumber')}
                placeholder="LIC-XXX-000"
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.licenseNumber ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.licenseNumber && <p className="text-red-500 text-[10px] mt-1">{errors.licenseNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Qualification *</label>
              <input
                type="text"
                {...register('qualification')}
                placeholder="MD, DNB Cardiology"
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.qualification ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.qualification && <p className="text-red-500 text-[10px] mt-1">{errors.qualification.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Experience (in years) *</label>
              <input
                type="number"
                {...register('experience')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.experience ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.experience && <p className="text-red-500 text-[10px] mt-1">{errors.experience.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Consultation Fee ($) *</label>
              <input
                type="number"
                step="0.01"
                {...register('consultationFee')}
                className={`w-full p-2 border rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50 ${
                  errors.consultationFee ? 'border-red-300 focus:border-red-500' : 'border-slate-200'
                }`}
              />
              {errors.consultationFee && <p className="text-red-500 text-[10px] mt-1">{errors.consultationFee.message}</p>}
            </div>

            {isEditMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Availability Status *</label>
                <select
                  {...register('availabilityStatus')}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-slate-50/50"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
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

export default DoctorForm;
