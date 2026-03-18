import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { USER_ROLES } from '../../constants/roles';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: USER_ROLES.PATIENT, phone: '',
    // Doctor fields
    specialty: '', licenseNumber: '', hospital: '', experience: '', education: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const specialties = ['Cardiologist','Neurologist','Pediatrician','Orthopedic','Dermatologist','General Physician','Gynecologist','Psychiatrist','Ophthalmologist','ENT Specialist'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.role === USER_ROLES.DOCTOR) {
      if (!formData.specialty) newErrors.specialty = 'Specialty is required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData.hospital.trim()) newErrors.hospital = 'Hospital name is required';
      if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
      if (!formData.education.trim()) newErrors.education = 'Education is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      if (formData.role === USER_ROLES.DOCTOR) {
        setSuccess(true);
      } else {
        navigate('/login');
      }
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
          <p className="text-gray-600 mb-2">Your doctor registration is under review.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-yellow-800 text-sm font-medium mb-1">📋 Verification Process:</p>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Admin will verify your license & documents</li>
              <li>• You will be notified once approved</li>
              <li>• Only verified doctors appear to patients</li>
            </ul>
          </div>
          <Button variant="primary" className="w-full" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join HealthCare+ today</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Register as</label>
            <div className="grid grid-cols-2 gap-3">
              {[USER_ROLES.PATIENT, USER_ROLES.DOCTOR].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-3 rounded-lg border-2 font-medium capitalize transition-colors ${
                    formData.role === role
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {role === USER_ROLES.PATIENT ? '🧑 Patient' : '👨‍⚕️ Doctor'}
                </button>
              ))}
            </div>
          </div>

          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required error={errors.name} />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required error={errors.email} />
          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required error={errors.phone} />

          {/* Doctor-specific fields */}
          {formData.role === USER_ROLES.DOCTOR && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 space-y-3">
              <p className="text-blue-800 font-medium text-sm">👨‍⚕️ Doctor Information</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty <span className="text-red-500">*</span></label>
                <select name="specialty" value={formData.specialty} onChange={handleChange} className="input-field">
                  <option value="">Select Specialty</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
              </div>

              <Input label="Medical License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="e.g. MH-12345" required error={errors.licenseNumber} />
              <Input label="Hospital / Clinic Name" name="hospital" value={formData.hospital} onChange={handleChange} placeholder="e.g. City Hospital, Mumbai" required error={errors.hospital} />
              <Input label="Education" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. MBBS, MD - Cardiology" required error={errors.education} />
              <Input label="Experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5 years" required error={errors.experience} />

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-xs">⚠️ Your account will be reviewed by admin before activation.</p>
              </div>
            </div>
          )}

          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" required error={errors.password} />
          <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required error={errors.confirmPassword} />

          <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
