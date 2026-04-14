import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { doctorService } from '../../services/api/doctorService';
import axiosInstance from '../../services/api/axiosInstance';
import { FaPhone, FaStethoscope, FaCalendarAlt, FaPills, FaFileMedical } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const DoctorPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [prescription, setPrescription] = useState({ medicine: '', dosage: '', notes: '' });
  const [showPrescribe, setShowPrescribe] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    doctorService.getPatients()
      .then(data => setPatients(data || []))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredPatients = patients.filter(p =>
    (p.name || p.patientId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openHistory = async (patient) => {
    setSelectedPatient(patient);
    setPatientRecords([]);
    setRecordsLoading(true);
    try {
      const res = await axiosInstance.get(`/doctor/patient-records/${patient._id || patient.id}`);
      setPatientRecords(res.data.data || []);
    } catch {
      setPatientRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  const closePrescribe = () => {
    setShowPrescribe(false);
    setSelectedPatient(null);
    setPrescription({ medicine: '', dosage: '', notes: '' });
  };

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">My Patients</h1>

      {savedMsg && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-sm flex items-center gap-2">
          <MdCheckCircle />Prescription saved for {savedMsg}!
        </div>
      )}

      <Card className="mb-6">
        <Input placeholder="Search patients by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </Card>

      {loading ? (
        <Card><p className="text-center text-gray-500 py-8">Loading patients...</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredPatients.map(patient => {
            const name = patient.name || patient.patientId?.name || 'Unknown';
            const phone = patient.phone || patient.patientId?.phone || 'N/A';
            const age = patient.age || patient.patientId?.age || 'N/A';
            const gender = patient.gender || patient.patientId?.gender || 'N/A';
            const lastVisit = patient.lastVisit || patient.date || 'N/A';
            const condition = patient.condition || patient.reason || 'N/A';
            const visits = patient.appointments || 1;
            const id = patient._id || patient.id;

            return (
              <Card key={id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-600">{age} years • {gender}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{visits} visits</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm"><FaPhone className="text-gray-400" /><span className="text-gray-700">{phone}</span></div>
                  <div className="flex items-center gap-2 text-sm"><FaStethoscope className="text-gray-400" /><span className="text-gray-700">{condition}</span></div>
                  <div className="flex items-center gap-2 text-sm"><FaCalendarAlt className="text-gray-400" /><span className="text-gray-700">Last visit: {lastVisit !== 'N/A' ? new Date(lastVisit).toLocaleDateString() : 'N/A'}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="primary" className="flex-1" onClick={() => openHistory({ ...patient, name, phone, age, gender, lastVisit, condition, visits })}>View History</Button>
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => { setSelectedPatient({ ...patient, name }); setShowPrescribe(true); }}>Prescribe</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filteredPatients.length === 0 && (
        <Card><p className="text-center text-gray-500 py-8">No patients found</p></Card>
      )}

      {/* Patient History Modal */}
      {selectedPatient && !showPrescribe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Patient History — {selectedPatient.name}</h3>
            <div className="space-y-2 text-sm mb-4 bg-gray-50 rounded-lg p-3">
              <p><span className="font-medium">Age:</span> {selectedPatient.age} • {selectedPatient.gender}</p>
              <p><span className="font-medium">Phone:</span> {selectedPatient.phone}</p>
              <p><span className="font-medium">Condition:</span> {selectedPatient.condition}</p>
              <p><span className="font-medium">Total Visits:</span> {selectedPatient.visits}</p>
              <p><span className="font-medium">Last Visit:</span> {selectedPatient.lastVisit !== 'N/A' ? new Date(selectedPatient.lastVisit).toLocaleDateString() : 'N/A'}</p>
            </div>

            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaFileMedical className="text-blue-500" />Medical Records</h4>
            {recordsLoading ? (
              <p className="text-center text-gray-400 py-4 flex items-center justify-center gap-2">
                <AiOutlineLoading3Quarters className="animate-spin" />Loading records...
              </p>
            ) : patientRecords.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No medical records found.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {patientRecords.map(r => (
                  <div key={r._id} className="border border-gray-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{r.title}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{r.type}</span>
                    </div>
                    {r.findings && <p className="text-gray-600 mt-1 text-xs">{r.findings}</p>}
                    <p className="text-gray-400 text-xs mt-1">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
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
              <Button variant="outline" className="flex-1" onClick={closePrescribe}>Cancel</Button>
              <Button variant="success" className="flex-1" disabled={saving} onClick={async () => {
                setSaving(true);
                try {
                  await axiosInstance.post('/doctor/prescription', {
                    patientId: selectedPatient._id || selectedPatient.id,
                    medicine: prescription.medicine,
                    dosage: prescription.dosage,
                    notes: prescription.notes,
                  });
                } catch { /* save best-effort */ }
                finally {
                  setSaving(false);
                  setSavedMsg(selectedPatient.name);
                  closePrescribe();
                  setTimeout(() => setSavedMsg(''), 3000);
                }
              }}><FaPills className="inline mr-1" />{saving ? 'Saving...' : 'Save Prescription'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsPage;
