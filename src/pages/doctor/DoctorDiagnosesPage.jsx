import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAppointments } from '../../context/AppointmentContext';
import { doctorService } from '../../services/api/doctorService';
import { FaUserAlt, FaCalendarAlt, FaFileAlt, FaStethoscope } from 'react-icons/fa';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const RECORD_TYPES = ['Lab Report', 'Prescription', 'X-Ray', 'CT Scan', 'MRI Scan'];

const DoctorDiagnosesPage = () => {
  const { appointments, updateAppointment } = useAppointments();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'Lab Report', findings: '' });
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('confirmed');

  const pendingAppointments = appointments.filter(a =>
    filter === 'all' ? true : a.status === filter
  );

  useEffect(() => {
    if (selected) {
      setForm({
        title: `Diagnosis — ${selected.patientId?.name || selected.patientName || 'Patient'}`,
        type: 'Lab Report',
        findings: '',
      });
      setError('');
    }
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.findings) { setError('Title and findings are required.'); return; }
    setSaving(true);
    setError('');
    try {
      await doctorService.saveDiagnosis({
        appointmentId: selected._id || selected.id,
        patientId: selected.patientId?._id || selected.patientId,
        title: form.title,
        type: form.type,
        findings: form.findings,
      });
      await updateAppointment(selected._id || selected.id, { status: 'completed' });
      setSavedId(selected._id || selected.id);
      setSelected(null);
      setTimeout(() => setSavedId(''), 4000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save diagnosis. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    all: appointments.length,
  };

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Diagnoses</h1>

      {savedId && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <MdCheckCircle /> Diagnosis saved and appointment marked as completed.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Confirmed', count: counts.confirmed, color: 'text-green-600' },
          { label: 'Completed', count: counts.completed, color: 'text-blue-600' },
          { label: 'Total', count: counts.all, color: 'text-gray-700' },
        ].map(s => (
          <Card key={s.label}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['confirmed', 'completed', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f} ({counts[f] ?? appointments.filter(a => a.status === f).length})
          </button>
        ))}
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {pendingAppointments.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              {filter === 'confirmed' ? 'No confirmed appointments to diagnose.' : 'No appointments found.'}
            </p>
          </Card>
        ) : (
          pendingAppointments.map(apt => {
            const id = apt._id || apt.id;
            const patientName = apt.patientId?.name || apt.patientName || 'Patient';
            const date = apt.date ? new Date(apt.date).toLocaleDateString('en-IN') : '—';
            const isCompleted = apt.status === 'completed';

            return (
              <Card key={id}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{patientName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isCompleted ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400 text-xs" />{date} at {apt.timeSlot || apt.time}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <FaFileAlt className="text-gray-400 text-xs" />{apt.reason}
                    </p>
                    {apt.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {apt.symptoms.map(s => (
                          <span key={s} className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    {isCompleted ? (
                      <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                        <FiCheckCircle /> Diagnosed
                      </span>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => setSelected(apt)}>
                        <FaStethoscope className="inline mr-1" /> Write Diagnosis
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Diagnosis Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Write Diagnosis</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <FiXCircle size={22} />
              </button>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
              <p className="flex items-center gap-2 font-medium text-gray-800">
                <FaUserAlt className="text-gray-400" />
                {selected.patientId?.name || selected.patientName}
              </p>
              <p className="text-gray-500">
                {new Date(selected.date).toLocaleDateString('en-IN')} at {selected.timeSlot || selected.time}
              </p>
              <p className="text-gray-600">{selected.reason}</p>
              {selected.symptoms?.length > 0 && (
                <p className="text-gray-500">Symptoms: {selected.symptoms.join(', ')}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Diagnosis — Fever"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="input-field"
                >
                  {RECORD_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Findings & Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.findings}
                  onChange={e => setForm({ ...form, findings: e.target.value })}
                  className="input-field min-h-32"
                  placeholder="Describe your diagnosis, observations, and treatment plan..."
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <FiXCircle />{error}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="success" className="flex-1" disabled={saving}>
                  {saving
                    ? <><AiOutlineLoading3Quarters className="inline animate-spin mr-1" />Saving...</>
                    : <><FiCheckCircle className="inline mr-1" />Save & Complete</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDiagnosesPage;
