import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FaLock, FaEnvelope, FaFlask } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, { email });
      setSuccess(true);
      if (res.data?.data?.previewUrl) setPreviewUrl(res.data.data.previewUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3"><FaLock className="text-5xl text-primary-400" /></div>
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your email and we'll send you a reset link</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm flex items-center justify-center gap-2">
              <MdCheckCircle />Reset link sent successfully!
            </div>
            {previewUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-blue-800 mb-2 flex items-center gap-1"><FaFlask />Dev Mode — Click to view email:</p>
                <a href={previewUrl} target="_blank" rel="noreferrer"
                  className="text-blue-600 hover:underline break-all text-xs">
                  {previewUrl}
                </a>
              </div>
            )}
            <Link to="/login" className="block text-primary-600 hover:underline text-sm font-medium">
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
            <Button type="submit" variant="primary" className="w-full mt-4" disabled={loading}>
              {loading ? 'Sending...' : <><FaEnvelope className="inline mr-1" />Send Reset Link</>}
            </Button>
            <p className="text-center text-gray-500 mt-4 text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
