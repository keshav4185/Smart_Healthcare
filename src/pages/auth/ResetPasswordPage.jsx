import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getFieldError } from '../../utils/validation';
import { FaKey, FaLock } from 'react-icons/fa';
import { FiXCircle } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'newPassword') setErrors(prev => ({ ...prev, newPassword: getFieldError('password', value) }));
    if (name === 'confirmPassword') setErrors(prev => ({ ...prev, confirmPassword: value !== formData.newPassword ? 'Passwords do not match' : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwErr = getFieldError('password', formData.newPassword);
    const matchErr = formData.newPassword !== formData.confirmPassword ? 'Passwords do not match' : '';
    if (pwErr || matchErr) { setErrors({ newPassword: pwErr, confirmPassword: matchErr }); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-4"><FiXCircle className="text-5xl text-red-400" /></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-500 text-sm mb-4">This reset link is missing or invalid.</p>
          <Link to="/forgot-password" className="text-primary-600 hover:underline font-medium text-sm">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><FaKey className="text-5xl text-primary-400" /></div>
          <h1 className="text-2xl font-bold text-gray-800">Set New Password</h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your new password below</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm flex items-center justify-center gap-2">
              <MdCheckCircle />Password reset successful! Redirecting to login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              error={errors.newPassword}
              hint="At least 8 characters"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your new password"
              error={errors.confirmPassword}
              required
            />
            <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
              {loading ? 'Resetting...' : <><FaLock className="inline mr-1" />Reset Password</>}
            </Button>
            <p className="text-center text-gray-500 mt-4 text-sm">
              <Link to="/login" className="text-primary-600 hover:underline font-medium">← Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
