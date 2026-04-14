import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import axiosInstance from '../../services/api/axiosInstance';
import { FaUserMd, FaStar } from 'react-icons/fa';
import { FiSearch, FiX } from 'react-icons/fi';
import { MdVerified, MdCircle } from 'react-icons/md';

const DoctorListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const defaultSpecialty = params.get('specialty') || 'all';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(defaultSpecialty);
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all | available | unavailable
  const [feeFilter, setFeeFilter] = useState('all'); // all | low | mid | high

  useEffect(() => {
    axiosInstance.get('/patient/doctors')
      .then(res => setDoctors(res.data.data || []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty).filter(Boolean))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.specialty || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const matchesAvailability = availabilityFilter === 'all'
      || (availabilityFilter === 'available' && doctor.available !== false)
      || (availabilityFilter === 'unavailable' && doctor.available === false);
    const fee = doctor.fee || 0;
    const matchesFee = feeFilter === 'all'
      || (feeFilter === 'low' && fee <= 300)
      || (feeFilter === 'mid' && fee > 300 && fee <= 700)
      || (feeFilter === 'high' && fee > 700);
    return matchesSearch && matchesSpecialty && matchesAvailability && matchesFee;
  });

  const getId = (d) => d._id || d.id;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Find Doctors</h1>
        {selectedSpecialty !== 'all' && (
          <div className="flex items-center gap-2">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <FiSearch className="inline" /> {selectedSpecialty}
            </span>
            <button onClick={() => setSelectedSpecialty('all')} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1"><FiX />Clear</button>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <Input placeholder="Search by name or specialty..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="input-field">
            {specialties.map(s => <option key={s} value={s}>{s === 'all' ? 'All Specialties' : s}</option>)}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Availability filter */}
          {[{v:'all',l:'All'},{v:'available',l:'🟢 Available'},{v:'unavailable',l:'🔴 Unavailable'}].map(opt => (
            <button key={opt.v} onClick={() => setAvailabilityFilter(opt.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                availabilityFilter === opt.v ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
              }`}>{opt.l}</button>
          ))}
          <span className="text-gray-300 text-sm self-center">|</span>
          {/* Fee filter */}
          {[{v:'all',l:'Any Fee'},{v:'low',l:'₹0–300'},{v:'mid',l:'₹301–700'},{v:'high',l:'₹700+'}].map(opt => (
            <button key={opt.v} onClick={() => setFeeFilter(opt.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                feeFilter === opt.v ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
              }`}>{opt.l}</button>
          ))}
        </div>
      </Card>

      {loading ? (
        <Card><p className="text-center text-gray-500 py-8">Loading doctors...</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredDoctors.map(doctor => (
            <Card key={getId(doctor)}>
              <div className="text-center mb-4">
                <div className="text-6xl mb-3 flex justify-center"><FaUserMd className="text-primary-400" /></div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><MdVerified />Verified</span>
                </div>
                <p className="text-primary-600 font-medium">{doctor.specialty}</p>
                <p className="text-sm text-gray-600">{doctor.education}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  doctor.available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {doctor.available !== false ? <span className="flex items-center gap-1"><MdCircle className="text-green-500 text-xs" />Available</span> : <span className="flex items-center gap-1"><MdCircle className="text-red-500 text-xs" />Unavailable Today</span>}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{doctor.experience} {typeof doctor.experience === 'number' ? 'years' : ''}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Consultation:</span>
                  <span className="font-medium text-green-600">₹{doctor.fee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium flex items-center gap-1"><FaStar className="text-yellow-400" />{doctor.rating || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Hospital:</span>
                  <span className="font-medium text-xs">{doctor.hospital}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" className="flex-1" size="sm" onClick={() => navigate(`/patient/doctor/${getId(doctor)}`)}>
                  View Profile
                </Button>
                <Button
                  variant={doctor.available !== false ? 'success' : 'secondary'}
                  className="flex-1" size="sm"
                  disabled={doctor.available === false}
                  onClick={() => navigate(`/patient/book-appointment/${getId(doctor)}`)}
                >
                  {doctor.available !== false ? 'Book Now' : 'Unavailable'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <Card><p className="text-center text-gray-500 py-8">No verified doctors found</p></Card>
      )}
    </div>
  );
};

export default DoctorListPage;
