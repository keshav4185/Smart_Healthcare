import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const DoctorPatientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    {
      id: 1,
      name: 'Rahul Patil',
      age: 35,
      gender: 'Male',
      lastVisit: '2024-02-15',
      condition: 'Hypertension',
      phone: '9876543210',
      appointments: 5,
    },
    {
      id: 2,
      name: 'Priya Deshmukh',
      age: 28,
      gender: 'Female',
      lastVisit: '2024-02-10',
      condition: 'Diabetes',
      phone: '9876543211',
      appointments: 3,
    },
    {
      id: 3,
      name: 'Amit Kumar',
      age: 42,
      gender: 'Male',
      lastVisit: '2024-02-05',
      condition: 'Heart Disease',
      phone: '9876543212',
      appointments: 8,
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">My Patients</h1>

      <Card className="mb-6">
        <Input
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredPatients.map(patient => (
          <Card key={patient.id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{patient.name}</h3>
                <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {patient.appointments} visits
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">📞</span>
                <span className="text-gray-700">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">🩺</span>
                <span className="text-gray-700">{patient.condition}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">📅</span>
                <span className="text-gray-700">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="primary" className="flex-1">
                View History
              </Button>
              <Button size="sm" variant="secondary" className="flex-1">
                Prescribe
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 py-8">No patients found</p>
        </Card>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
