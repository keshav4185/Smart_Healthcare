import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import { mockDoctors } from '../../services/api/mockAuthService';

const reviews = [
  { id: 1, name: 'Rahul Patil', rating: 5, comment: 'Excellent doctor! Very caring and professional.', date: '2025-06-15' },
  { id: 2, name: 'Priya Deshmukh', rating: 5, comment: 'Best doctor in the city. Highly recommended!', date: '2025-06-10' },
  { id: 3, name: 'Amit Kumar', rating: 4, comment: 'Good experience. Explained everything clearly.', date: '2025-06-05' },
];

const slots = [
  { day: 'Monday', time: '10:00 AM - 2:00 PM' },
  { day: 'Wednesday', time: '10:00 AM - 2:00 PM' },
  { day: 'Friday', time: '3:00 PM - 7:00 PM' },
];

const DoctorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = mockDoctors.find(d => d.id === id) || mockDoctors[0];

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
                {doctor.status === 'verified' && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✅ Verified</span>
                )}
              </div>
              <p className="text-primary-600 font-medium text-lg">{doctor.specialty}</p>
              <p className="text-sm text-gray-600 mt-1">{doctor.education}</p>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-bold">{doctor.rating}</span>
                </div>
                <p className="text-sm text-gray-600">{doctor.experience} experience</p>
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
                  <span className={doctor.available ? 'text-green-600' : 'text-red-500'}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                </p>
              </div>

              <Button
                variant="primary"
                className="w-full mt-4"
                disabled={!doctor.available}
                onClick={() => navigate(`/patient/book-appointment/${doctor.id}`)}
              >
                {doctor.available ? 'Book Appointment' : 'Currently Unavailable'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="About">
            <p className="text-gray-700">
              {doctor.name} is a highly experienced {doctor.specialty} with {doctor.experience} of practice.
              Currently practicing at {doctor.hospital}. Specialized in providing quality healthcare with a patient-first approach.
            </p>
          </Card>

          <Card title="Languages">
            <div className="flex gap-2 flex-wrap">
              {['English', 'Hindi', 'Marathi'].map(lang => (
                <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{lang}</span>
              ))}
            </div>
          </Card>

          <Card title="Available Time Slots">
            <div className="space-y-3">
              {slots.map((slot, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{slot.day}</span>
                  <span className="text-primary-600">{slot.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Patient Reviews">
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{review.name}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(review.rating)].map((_, i) => <span key={i}>⭐</span>)}
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
