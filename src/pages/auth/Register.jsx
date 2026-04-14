import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { USER_ROLES } from '../../constants/roles';
import { getFieldError } from '../../utils/validation';
import { FaUserMd, FaUser, FaCamera } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import { FiAlertTriangle, FiList, FiUpload, FiX } from 'react-icons/fi';

const FileUploadField = ({ label, name, file, preview, onChange, onClear, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {preview ? (
      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
        {preview.startsWith('data:image') ? (
          <img src={preview} alt={label} className="w-full h-32 object-cover" />
        ) : (
          <div className="h-32 flex items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-600 text-center px-2">📄 {file?.name}</p>
          </div>
        )}
        <button type="button" onClick={onClear}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
          <FiX size={12} />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
        <FiUpload className="text-gray-400 mb-1" />
        <span className="text-xs text-gray-500">Click to upload (JPG, PNG, PDF)</span>
        <input type="file" name={name} accept="image/*,application/pdf" className="hidden" onChange={onChange} />
      </label>
    )}
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: USER_ROLES.PATIENT, phone: '',
    age: '', gender: '', bloodGroup: '',
    specialty: '', licenseNumber: '', hospital: '', experience: '', education: '', fee: '',
  });
  const [files, setFiles] = useState({
    profilePhoto: null,
    degreeCertificate: null,
    idProof: null,
    selfieWithId: null,
  });
  const [previews, setPreviews] = useState({
    profilePhoto: '',
    degreeCertificate: '',
    idProof: '',
    selfieWithId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const specialties = ['Cardiologist','Neurologist','Pediatrician','Orthopedic','Dermatologist','General Physician','Gynecologist','Psychiatrist','Ophthalmologist','ENT Specialist'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && /[a-zA-Z]/.test(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: getFieldError(name, value, { ...formData, [name]: value }) }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [name]: file }));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews(prev => ({ ...prev, [name]: ev.target.result }));
      reader.readAsDataURL(file);
    } else {
      setPreviews(prev => ({ ...prev, [name]: 'pdf' }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const clearFile = (name) => {
    setFiles(prev => ({ ...prev, [name]: null }));
    setPreviews(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const newErrors = {};
    fields.forEach(f => {
      const err = getFieldError(f, formData[f], formData);
      if (err) newErrors[f] = err;
    });
    if (formData.role === USER_ROLES.DOCTOR) {
      ['specialty', 'licenseNumber', 'hospital', 'experience', 'education'].forEach(f => {
        if (!formData[f]?.trim()) newErrors[f] = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`;
      });
      if (!files.degreeCertificate) newErrors.degreeCertificate = 'Degree certificate is required';
      if (!files.idProof) newErrors.idProof = 'ID proof is required';
      if (!files.selfieWithId) newErrors.selfieWithId = 'Selfie with ID is required';
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
    const result = await register(formData, files);
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
          <div className="flex justify-center mb-4"><MdPending className="text-6xl text-yellow-400" /></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
          <p className="text-gray-600 mb-2">Your doctor registration is under review.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-yellow-800 text-sm font-medium mb-1 flex items-center gap-1"><FiList />Verification Process:</p>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Admin will verify your license &amp; documents</li>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Register as</label>
            <div className="grid grid-cols-2 gap-3">
              {[USER_ROLES.PATIENT, USER_ROLES.DOCTOR].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-3 rounded-lg border-2 font-medium capitalize transition-colors flex items-center justify-center gap-2 ${
                    formData.role === role
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {role === USER_ROLES.PATIENT ? <><FaUser />Patient</> : <><FaUserMd />Doctor</>}
                </button>
              ))}
            </div>
          </div>

          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required error={errors.name} />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required error={errors.email} />
          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" required error={errors.phone} hint="Only 10 digits allowed, no letters" />

          {formData.role === USER_ROLES.PATIENT && (
            <div className="grid grid-cols-3 gap-3 mb-2">
              <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 25" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-field">
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
          )}

          {formData.role === USER_ROLES.DOCTOR && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 space-y-3">
              <p className="text-blue-800 font-medium text-sm flex items-center gap-2"><FaUserMd />Doctor Information</p>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-white shrink-0">
                    {previews.profilePhoto ? (
                      <img src={previews.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600 w-fit">
                      <FiUpload size={14} />
                      {files.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                      <input type="file" name="profilePhoto" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    {files.profilePhoto && (
                      <button type="button" onClick={() => clearFile('profilePhoto')}
                        className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                        <FiX size={10} />Remove
                      </button>
                    )}
                    <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 10MB</p>
                  </div>
                </div>
              </div>

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
              <Input label="Consultation Fee (₹)" type="number" name="fee" value={formData.fee} onChange={handleChange} placeholder="e.g. 500" required error={errors.fee} />

              <div className="border-t border-blue-200 pt-3">
                <p className="text-blue-800 font-medium text-sm mb-3 flex items-center gap-2"><FiUpload />Verification Documents</p>
                <div className="space-y-3">
                  <FileUploadField
                    label="Degree Certificate"
                    name="degreeCertificate"
                    file={files.degreeCertificate}
                    preview={previews.degreeCertificate}
                    onChange={handleFileChange}
                    onClear={() => clearFile('degreeCertificate')}
                    required
                  />
                  {errors.degreeCertificate && <p className="text-red-500 text-xs">{errors.degreeCertificate}</p>}

                  <FileUploadField
                    label="Government ID Proof"
                    name="idProof"
                    file={files.idProof}
                    preview={previews.idProof}
                    onChange={handleFileChange}
                    onClear={() => clearFile('idProof')}
                    required
                  />
                  {errors.idProof && <p className="text-red-500 text-xs">{errors.idProof}</p>}

                  <FileUploadField
                    label="Selfie with ID"
                    name="selfieWithId"
                    file={files.selfieWithId}
                    preview={previews.selfieWithId}
                    onChange={handleFileChange}
                    onClear={() => clearFile('selfieWithId')}
                    required
                  />
                  {errors.selfieWithId && <p className="text-red-500 text-xs">{errors.selfieWithId}</p>}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-yellow-800 text-xs flex items-center gap-1"><FiAlertTriangle />Your account will be reviewed by admin before activation.</p>
              </div>
            </div>
          )}

          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" required error={errors.password} hint="At least 8 characters" />
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
