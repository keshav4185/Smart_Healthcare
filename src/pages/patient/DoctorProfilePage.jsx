import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import axiosInstance from '../../services/api/axiosInstance';

const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/patient/doctors')
      .then(res => {
        const list = res.data.data || [];
        const found = list.find(d => (d._id || d.id) === id);
        setDoctor(found || null);
      })
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading doctor profile...</div>;
  if (!doctor) return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">Doctor not found.</p>
      <Button variant="primary" onClick={() => navigate('/patient/doctors')}>Browse Doctors</Button>
    </div>
  );

  const doctorId = doctor._id || doctor.id;

  return (
    <div className="max-w-6xl mx-auto">
      <EmergencySOS />
      <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">← Back</Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="text-8xl mb-4">👨⚕️</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✅ Verified</span>
              </div>
              <p className="text-primary-600 font-medium text-lg">{doctor.specialty}</p>
              <p className="text-sm text-gray-600 mt-1">{doctor.education}</p>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-bold">{doctor.rating || 'N/A'}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {doctor.experience} {typeof doctor.experience === 'number' ? 'years' : ''} experience
                </p>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-2xl font-bold text-green-600">₹{doctor.fee}</p>
                <p className="text-sm text-gray-600">Consultation Fee</p>
              </div>

              <div className="mt-4 pt-4 border-t text-left space-y-2">
                <p className="text-sm"><span className="font-medium">📋 License:</span> {doctor.licenseNumber}</p>
                <p className="text-sm"><span className="font-medium">🏥 Hospital:</span> {doctor.hospital}</p>
                <p className="text-sm">
                  <span className="font-medium">🟢 Status:</span>{' '}
                  <span className={doctor.available !== false ? 'text-green-600' : 'text-red-500'}>
                    {doctor.available !== false ? 'Available' : 'Unavailable'}
                  </span>
                </p>
              </div>

              <Button
                variant="primary"
                className="w-full mt-4"
                disabled={doctor.available === false}
                onClick={() => navigate(`/patient/book-appointment/${doctorId}`)}
              >
                {doctor.available !== false ? 'Book Appointment' : 'Currently Unavailable'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="About">
            <p className="text-gray-700">
              {doctor.name} is a highly experienced {doctor.specialty} with{' '}
              {doctor.experience} {typeof doctor.experience === 'number' ? 'years' : ''} of practice.
              Currently practicing at {doctor.hospital}.
              {doctor.bio ? ` ${doctor.bio}` : ' Specialized in providing quality healthcare with a patient-first approach.'}
            </p>
          </Card>

          <Card title="Education & Credentials">
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">🎓 Education:</span> {doctor.education || '—'}</p>
              <p><span className="font-medium">📋 License No:</span> {doctor.licenseNumber || '—'}</p>
              <p><span className="font-medium">🏥 Hospital:</span> {doctor.hospital || '—'}</p>
            </div>
          </Card>

          <Card title="Languages">
            <div className="flex gap-2 flex-wrap">
              {['English', 'Hindi', 'Marathi'].map(lang => (
                <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{lang}</span>
              ))}
            </div>
          </Card>

          <Card title="Consultation Fee">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-700">Per Consultation</span>
              <span className="text-2xl font-bold text-green-600">₹{doctor.fee}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
