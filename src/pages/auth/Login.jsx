import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      const role = result.data.user.role;
      navigate(`/${role}/dashboard`);
    } else {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">HealthCare+</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600 mb-2">Demo Credentials:</p>
          <p>🧑 Patient: {import.meta.env.VITE_PATIENT_EMAIL}</p>
          <p>👨⚕️ Doctor: {import.meta.env.VITE_DOCTOR_EMAIL}</p>
          <p>🛡️ Admin: {import.meta.env.VITE_ADMIN_EMAIL}</p>
        </div>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
