import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/roles';
import { mockDoctors } from '../services/api/mockAuthService';

const ProfilePage = () => {
  const { user } = useAuth();
  const isDoctor = user?.role === USER_ROLES.DOCTOR;

  const doctorData = isDoctor ? mockDoctors.find(d => d.id === user.id) : null;

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    dob: '1990-05-15',
    bloodGroup: 'B+',
    // Doctor fields from mockDoctors
    specialty: doctorData?.specialty || '',
    hospital: doctorData?.hospital || '',
    experience: doctorData?.experience || '',
    licenseNumber: doctorData?.licenseNumber || '',
    education: doctorData?.education || '',
    bio: doctorData ? `${doctorData.name} is a highly experienced ${doctorData.specialty} with ${doctorData.experience} of practice at ${doctorData.hospital}.` : '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Profile</h1>
        {!editing ? (
          <Button variant="primary" onClick={() => setEditing(true)}>✏️ Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="success" onClick={handleSave}>💾 Save</Button>
          </div>
        )}
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Avatar & Role */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-4xl">
            {isDoctor ? '👨⚕️' : '🧑'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{formData.name}</h2>
            <p className="text-gray-500 capitalize">{user?.role}</p>
            {isDoctor && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✅ Verified Doctor</span>
            )}
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card title="Personal Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editing ? (
            <>
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
              {!isDoctor && (
                <>
                  <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-field">
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{formData.name}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{formData.email}</p></div>
              <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{formData.phone}</p></div>
              <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">{formData.address}</p></div>
              {!isDoctor && (
                <>
                  <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{formData.dob}</p></div>
                  <div><p className="text-sm text-gray-500">Blood Group</p><p className="font-medium text-red-600">{formData.bloodGroup}</p></div>
                </>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Doctor-specific Info */}
      {isDoctor && (
        <Card title="Professional Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editing ? (
              <>
                <Input label="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} />
                <Input label="Hospital" name="hospital" value={formData.hospital} onChange={handleChange} />
                <Input label="Experience" name="experience" value={formData.experience} onChange={handleChange} />
                <Input label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                <Input label="Education" name="education" value={formData.education} onChange={handleChange} />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field min-h-20" />
                </div>
              </>
            ) : (
              <>
                <div><p className="text-sm text-gray-500">Specialty</p><p className="font-medium">{formData.specialty}</p></div>
                <div><p className="text-sm text-gray-500">Hospital</p><p className="font-medium">{formData.hospital}</p></div>
                <div><p className="text-sm text-gray-500">Experience</p><p className="font-medium">{formData.experience}</p></div>
                <div><p className="text-sm text-gray-500">License No.</p><p className="font-medium">{formData.licenseNumber}</p></div>
                <div><p className="text-sm text-gray-500">Education</p><p className="font-medium">{formData.education}</p></div>
                <div className="md:col-span-2"><p className="text-sm text-gray-500">Bio</p><p className="font-medium">{formData.bio}</p></div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
