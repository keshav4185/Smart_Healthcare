import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getFieldError } from '../../utils/validation';
import { MdPending } from 'react-icons/md';
import { FaUserMd, FaUser, FaShieldAlt, FaBrain, FaXRay, FaCalendarCheck, FaFileMedical, FaLanguage } from 'react-icons/fa';
import { MdEmergency } from 'react-icons/md';
import { SiMongodb, SiReact, SiNodedotjs, SiGooglegemini } from 'react-icons/si';

const features = [
  { icon: <FaBrain className="text-purple-400" />, title: 'AI Symptom Diagnosis', desc: 'Gemini AI analyzes symptoms & suggests specialist' },
  { icon: <FaXRay className="text-blue-400" />, title: 'Scan Analysis', desc: 'Upload X-Ray / MRI / CT — AI reads it instantly' },
  { icon: <FaCalendarCheck className="text-green-400" />, title: 'Smart Appointments', desc: 'Book, reschedule & manage with slot blocking' },
  { icon: <FaFileMedical className="text-orange-400" />, title: 'Medical Records', desc: 'Store scans, reports & doctor prescriptions' },
  { icon: <FaLanguage className="text-yellow-400" />, title: 'Bilingual Support', desc: 'Full English + Marathi language support' },
  { icon: <MdEmergency className="text-red-400" />, title: 'Emergency SOS', desc: 'One-tap call to 108 / 112 / Hospital' },
];

const roles = [
  { icon: <FaUser className="text-primary-400" />, role: 'Patient', desc: 'AI diagnosis, book doctors, manage records' },
  { icon: <FaUserMd className="text-green-400" />, role: 'Doctor', desc: 'Manage appointments, write prescriptions' },
  { icon: <FaShieldAlt className="text-yellow-400" />, role: 'Admin', desc: 'Verify doctors, manage platform' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pendingMsg, setPendingMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: getFieldError(name, value, { ...formData, [name]: value }) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = getFieldError('email', formData.email);
    const passErr = getFieldError('password', formData.password);
    if (emailErr || passErr) { setErrors({ email: emailErr, password: passErr }); return; }
    setLoading(true);
    setPendingMsg('');
    const result = await login(formData);
    if (result.success) {
      navigate(`/${result.data.user.role}/dashboard`);
    } else if (result.statusCode === 403 || result.error?.includes('pending') || result.error?.includes('approval') || result.error?.includes('rejected')) {
      setPendingMsg(result.error);
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT — Project Info */}
      <div className="lg:w-3/5 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white flex flex-col justify-center px-8 py-12 lg:px-16">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
              🏥
            </div>
            <div>
              <h1 className="text-3xl font-bold">HealthCare+</h1>
              <p className="text-primary-200 text-sm">Smart Healthcare Management System</p>
            </div>
          </div>
          <p className="text-primary-100 text-sm leading-relaxed max-w-lg">
            An AI-powered healthcare platform that connects patients with verified doctors,
            provides instant medical diagnosis, and manages complete health records — in English & Marathi.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider mb-3">Key Features</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white bg-opacity-10 rounded-xl p-3 hover:bg-opacity-15 transition-all">
                <span className="text-xl mt-0.5 shrink-0">{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-primary-200 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="mb-8">
          <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider mb-3">User Roles</p>
          <div className="flex flex-wrap gap-3">
            {roles.map((r, i) => (
              <div key={i} className="flex items-center gap-2 bg-white bg-opacity-10 rounded-lg px-4 py-2">
                <span className="text-lg">{r.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{r.role}</p>
                  <p className="text-primary-200 text-xs">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <SiReact />, label: 'React 19' },
              { icon: <SiNodedotjs />, label: 'Node.js' },
              { icon: <SiMongodb />, label: 'MongoDB' },
              { icon: <SiGooglegemini />, label: 'Gemini AI' },
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-white bg-opacity-10 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {t.icon}{t.label}
              </span>
            ))}
            {['Tailwind CSS', 'JWT Auth', 'Cloudinary', 'Nodemailer'].map(t => (
              <span key={t} className="bg-white bg-opacity-10 text-white text-xs px-3 py-1.5 rounded-full font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div className="lg:w-2/5 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{errors.general}</div>
          )}

          {pendingMsg && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <MdPending className="text-yellow-500 text-xl mt-0.5 shrink-0" />
              <div>
                <p className="text-yellow-800 font-medium text-sm">Account Not Active</p>
                <p className="text-yellow-700 text-sm mt-0.5">{pendingMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input label="Email" type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Enter your email" required error={errors.email} />
            <Input label="Password" type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter your password" required error={errors.password} />
            <div className="text-right -mt-2 mb-4">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline font-medium">Register here</Link>
          </p>

          {/* MCA Project Badge */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">MCA Final Year Major Project</p>
            <p className="text-xs text-gray-400 mt-0.5">Developed with React + Node.js + Gemini AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
