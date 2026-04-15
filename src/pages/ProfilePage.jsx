import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/roles';
import { userService } from '../services/api/userService';
import { getFieldError } from '../utils/validation';
import { FaUserMd, FaUser, FaCamera, FaLock } from 'react-icons/fa';
import { FiEdit, FiSave } from 'react-icons/fi';
import { MdVerified, MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const isDoctor = user?.role === USER_ROLES.DOCTOR;

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',
    dob: '', bloodGroup: '', age: '', gender: '',
    specialty: '', hospital: '', experience: '',
    licenseNumber: '', education: '', bio: '', fee: '',
  });

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [photo, setPhoto] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    userService.getProfile()
      .then(data => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          dob: data.dob ? data.dob.split('T')[0] : '',
          bloodGroup: data.bloodGroup || '',
          age: data.age || '',
          gender: data.gender || '',
          specialty: data.specialty || '',
          hospital: data.hospital || '',
          experience: data.experience || '',
          licenseNumber: data.licenseNumber || '',
          education: data.education || '',
          bio: data.bio || '',
          fee: data.fee || '',
        });
        if (data.profilePhoto) setPhoto(data.profilePhoto);
      })
      .catch(() => {
        setFormData(prev => ({ ...prev, name: user?.name || '', email: user?.email || '' }));
      });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
    setPhotoLoading(true);
    try {
      const data = await userService.uploadPhoto(file);
      if (data?.profilePhoto) {
        setPhoto(data.profilePhoto);
        updateUser({ profilePhoto: data.profilePhoto });
      }
    } catch (err) {
      setPhoto(user?.profilePhoto || '');
      alert(err?.response?.data?.message || 'Photo upload failed. Please try again.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm(prev => ({ ...prev, [name]: value }));
    if (name === 'newPassword') setPwErrors(prev => ({ ...prev, newPassword: getFieldError('password', value) }));
    if (name === 'confirmPassword') setPwErrors(prev => ({ ...prev, confirmPassword: value !== pwForm.newPassword ? 'Passwords do not match' : '' }));
  };

  const handlePasswordSave = async () => {
    const errors = {};
    if (!pwForm.currentPassword) errors.currentPassword = 'Current password is required';
    const newPwErr = getFieldError('password', pwForm.newPassword);
    if (newPwErr) errors.newPassword = newPwErr;
    if (pwForm.newPassword !== pwForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length > 0) { setPwErrors(errors); return; }
    setPwLoading(true);
    try {
      await userService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwMsg({ type: 'success', text: '✅ Password updated successfully!' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwErrors({});
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setPwLoading(false);
      setTimeout(() => setPwMsg({ type: '', text: '' }), 4000);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await userService.updateProfile(formData);
      updateUser(updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Profile</h1>
        {!editing ? (
          <Button variant="primary" onClick={() => setEditing(true)}><FiEdit className="inline mr-1" />Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="success" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : <><FiSave className="inline mr-1" />Save</>}</Button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <MdCheckCircle />Profile updated successfully!
        </div>
      )}

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Photo Circle */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-primary-200 shadow-md">
              {photo
                ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-5xl">{isDoctor ? <FaUserMd className="text-primary-400" /> : <FaUser className="text-primary-400" />}</span>
              }
            </div>
            {/* Camera overlay button */}
            <label className="absolute bottom-1 right-1 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg transition-colors" title="Change photo">
              {photoLoading
                ? <AiOutlineLoading3Quarters className="animate-spin text-sm" />
                : <FaCamera className="text-sm" />
              }
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} disabled={photoLoading} />
            </label>
          </div>

          {/* Info + Upload hint */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
            <p className="text-gray-500 capitalize mt-0.5">{user?.role}</p>
            {isDoctor && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mt-1">
                <MdVerified />Verified Doctor
              </span>
            )}
            {!isDoctor && formData.bloodGroup && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full mt-1 ml-1">
                🩸 {formData.bloodGroup}
              </span>
            )}
            <div className="mt-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                {photoLoading
                  ? <><AiOutlineLoading3Quarters className="animate-spin" />Uploading...</>
                  : <><FaCamera />Change Photo</>
                }
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} disabled={photoLoading} />
              </label>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or WebP — max 2MB</p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Personal Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editing ? (
            <>
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
              {!isDoctor && (
                <>
                  <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 25" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-field">
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{formData.name || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{formData.email || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{formData.phone || '—'}</p></div>
              <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">{formData.address || '—'}</p></div>
              {!isDoctor && (
                <>
                  <div><p className="text-sm text-gray-500">Age</p><p className="font-medium">{formData.age ? `${formData.age} years` : '—'}</p></div>
                  <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium">{formData.gender || '—'}</p></div>
                  <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{formData.dob || '—'}</p></div>
                  <div><p className="text-sm text-gray-500">Blood Group</p><p className="font-medium text-red-600 font-bold">{formData.bloodGroup || '—'}</p></div>
                </>
              )}
            </>
          )}
        </div>
      </Card>

      {isDoctor && (
        <Card title="Professional Information" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editing ? (
              <>
                <Input label="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} />
                <Input label="Hospital" name="hospital" value={formData.hospital} onChange={handleChange} />
                <Input label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
                <Input label="Consultation Fee (₹)" type="number" name="fee" value={formData.fee} onChange={handleChange} placeholder="e.g. 500" />
                <Input label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                <Input label="Education" name="education" value={formData.education} onChange={handleChange} />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field min-h-20" />
                </div>
              </>
            ) : (
              <>
                <div><p className="text-sm text-gray-500">Specialty</p><p className="font-medium">{formData.specialty || '—'}</p></div>
                <div><p className="text-sm text-gray-500">Hospital</p><p className="font-medium">{formData.hospital || '—'}</p></div>
                <div><p className="text-sm text-gray-500">Experience</p><p className="font-medium">{formData.experience || '—'}</p></div>
                <div><p className="text-sm text-gray-500">Consultation Fee</p><p className="font-medium text-green-600">{formData.fee ? `₹${formData.fee}` : '—'}</p></div>
                <div><p className="text-sm text-gray-500">License No.</p><p className="font-medium">{formData.licenseNumber || '—'}</p></div>
                <div><p className="text-sm text-gray-500">Education</p><p className="font-medium">{formData.education || '—'}</p></div>
                <div className="md:col-span-2"><p className="text-sm text-gray-500">Bio</p><p className="font-medium">{formData.bio || '—'}</p></div>
              </>
            )}
          </div>
        </Card>
      )}

      <Card title={<span className="flex items-center gap-2"><FaLock />Change Password</span>}>
        {pwMsg.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${pwMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {pwMsg.text}
          </div>
        )}
        <div className="space-y-1">
          <Input label="Current Password" type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} placeholder="Enter current password" error={pwErrors.currentPassword} />
          <Input label="New Password" type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} placeholder="Minimum 8 characters" error={pwErrors.newPassword} hint="At least 8 characters" />
          <Input label="Confirm New Password" type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} placeholder="Confirm new password" error={pwErrors.confirmPassword} />
        </div>
        <Button variant="primary" className="mt-2" onClick={handlePasswordSave} disabled={pwLoading}>
          {pwLoading ? 'Updating...' : <><FaLock className="inline mr-1" />Update Password</>}
        </Button>
      </Card>
    </div>
  );
};

export default ProfilePage;
