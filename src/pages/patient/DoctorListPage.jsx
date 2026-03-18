import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { mockDoctors } from '../../services/api/mockAuthService';

const DoctorListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-filter from URL params (e.g. /patient/doctors?specialty=Neurologist)
  const params = new URLSearchParams(location.search);
  const defaultSpecialty = params.get('specialty') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(defaultSpecialty);

  const doctors = mockDoctors.filter(d => d.status === 'verified');
  const specialties = ['all', ...new Set(mockDoctors.map(d => d.specialty))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Find Doctors</h1>
        {selectedSpecialty !== 'all' && (
          <div className="flex items-center gap-2">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
              🔍 {selectedSpecialty}
            </span>
            <button onClick={() => setSelectedSpecialty('all')} className="text-gray-400 hover:text-gray-600 text-sm">✕ Clear</button>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="input-field"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty === 'all' ? 'All Specialties' : specialty}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredDoctors.map(doctor => (
          <Card key={doctor.id}>
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">👨‍⚕️</div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">✅ Verified</span>
              </div>
              <p className="text-primary-600 font-medium">{doctor.specialty}</p>
              <p className="text-sm text-gray-600">{doctor.education}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{doctor.experience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Consultation:</span>
                <span className="font-medium text-green-600">₹{doctor.fee}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">⭐ {doctor.rating}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hospital:</span>
                <span className="font-medium text-xs">{doctor.hospital}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                className="flex-1"
                size="sm"
                onClick={() => navigate(`/patient/doctor/${doctor.id}`)}
              >
                View Profile
              </Button>
              <Button
                variant={doctor.available ? 'success' : 'secondary'}
                className="flex-1"
                size="sm"
                disabled={!doctor.available}
                onClick={() => navigate(`/patient/book-appointment/${doctor.id}`)}
              >
                {doctor.available ? 'Book Now' : 'Unavailable'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 py-8">No verified doctors found</p>
        </Card>
      )}
    </div>
  );
};

export default DoctorListPage;
