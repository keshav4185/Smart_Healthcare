import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const initialAppointments = [
  { id: 1, patientName: 'Rahul Patil', age: 35, time: '10:00 AM', date: '2025-07-20', reason: 'Regular checkup', status: 'confirmed', type: 'In-person' },
  { id: 2, patientName: 'Priya Deshmukh', age: 28, time: '11:00 AM', date: '2025-07-20', reason: 'Follow-up consultation', status: 'confirmed', type: 'Video' },
  { id: 3, patientName: 'Amit Kumar', age: 42, time: '02:00 PM', date: '2025-07-20', reason: 'Chest pain', status: 'pending', type: 'In-person' },
  { id: 4, patientName: 'Sunita Jadhav', age: 55, time: '03:00 PM', date: '2025-07-21', reason: 'Diabetes checkup', status: 'pending', type: 'In-person' },
  { id: 5, patientName: 'Vikram Rao', age: 30, time: '10:30 AM', date: '2025-07-15', reason: 'Routine ECG', status: 'completed', type: 'In-person' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState('all');

  const updateStatus = (id, status) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Appointments</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', count: counts.all, color: 'text-blue-600' },
          { label: 'Pending', count: counts.pending, color: 'text-yellow-600' },
          { label: 'Confirmed', count: counts.confirmed, color: 'text-green-600' },
          { label: 'Completed', count: counts.completed, color: 'text-gray-600' },
        ].map(s => (
          <Card key={s.label}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card><p className="text-center text-gray-500 py-8">No appointments found</p></Card>
        ) : (
          filtered.map(apt => (
            <Card key={apt.id}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{apt.patientName}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[apt.status]}`}>
                      {apt.status}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      {apt.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>👤 Age: {apt.age} years</p>
                    <p>📅 {apt.date} at {apt.time}</p>
                    <p>📝 {apt.reason}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {apt.status === 'pending' && (
                    <>
                      <Button size="sm" variant="success" onClick={() => updateStatus(apt.id, 'confirmed')}>
                        ✅ Accept
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(apt.id, 'cancelled')}>
                        ❌ Decline
                      </Button>
                    </>
                  )}
                  {apt.status === 'confirmed' && (
                    <>
                      <Button size="sm" variant="primary" onClick={() => updateStatus(apt.id, 'completed')}>
                        ✔ Complete
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(apt.id, 'cancelled')}>
                        Cancel
                      </Button>
                    </>
                  )}
                  {apt.status === 'completed' && (
                    <span className="text-sm text-blue-600 font-medium">✔ Done</span>
                  )}
                  {apt.status === 'cancelled' && (
                    <span className="text-sm text-red-500 font-medium">✗ Cancelled</span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
