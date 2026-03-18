import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const DoctorPatientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState({ medicine: '', dosage: '', notes: '' });
  const [showPrescribe, setShowPrescribe] = useState(false);

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
              <Button size="sm" variant="primary" className="flex-1" onClick={() => setSelectedPatient(patient)}>
                View History
              </Button>
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => { setSelectedPatient(patient); setShowPrescribe(true); }}>
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

      {/* Patient History Modal */}
      {selectedPatient && !showPrescribe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Patient History — {selectedPatient.name}</h3>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="font-medium">Age:</span> {selectedPatient.age} • {selectedPatient.gender}</p>
              <p><span className="font-medium">Phone:</span> {selectedPatient.phone}</p>
              <p><span className="font-medium">Condition:</span> {selectedPatient.condition}</p>
              <p><span className="font-medium">Total Visits:</span> {selectedPatient.appointments}</p>
              <p><span className="font-medium">Last Visit:</span> {new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setSelectedPatient(null)}>Close</Button>
          </div>
        </div>
      )}

      {/* Prescribe Modal */}
      {selectedPatient && showPrescribe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Prescribe — {selectedPatient.name}</h3>
            <div className="space-y-3 mb-4">
              <Input label="Medicine" value={prescription.medicine} onChange={e => setPrescription({ ...prescription, medicine: e.target.value })} placeholder="e.g. Paracetamol 500mg" />
              <Input label="Dosage" value={prescription.dosage} onChange={e => setPrescription({ ...prescription, dosage: e.target.value })} placeholder="e.g. 1 tablet twice daily" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={prescription.notes} onChange={e => setPrescription({ ...prescription, notes: e.target.value })} className="input-field min-h-16" placeholder="Additional instructions..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setShowPrescribe(false); setSelectedPatient(null); setPrescription({ medicine: '', dosage: '', notes: '' }); }}>Cancel</Button>
              <Button variant="success" className="flex-1" onClick={() => { alert(`Prescription saved for ${selectedPatient.name}!`); setShowPrescribe(false); setSelectedPatient(null); setPrescription({ medicine: '', dosage: '', notes: '' }); }}>💊 Save Prescription</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
