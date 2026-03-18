import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import { useAppointments } from '../../context/AppointmentContext';

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { appointments, cancelAppointment } = useAppointments();
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const handleCancel = (id) => {
    cancelAppointment(id);
    setCancelId(null);
  };

  return (
    <div>
      <EmergencySOS />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">My Appointments</h1>
        <Button variant="primary" onClick={() => navigate('/patient/doctors')} className="w-full sm:w-auto">
          + Book New Appointment
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">No appointments found.</p>
          </Card>
        ) : (
          filtered.map(apt => (
            <Card key={apt.id}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{apt.doctorName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[apt.status]}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-primary-600 text-sm font-medium">{apt.specialty}</p>
                  <p className="text-gray-600 text-sm mt-1">📅 {apt.date} at {apt.time}</p>
                  <p className="text-gray-500 text-sm">📝 {apt.reason}</p>
                  <p className="text-green-600 text-sm font-medium">💰 ₹{apt.fee}</p>
                </div>
                <div className="flex gap-2">
                  {apt.status === 'confirmed' && (
                    <Button size="sm" variant="danger" onClick={() => setCancelId(apt.id)}>
                      Cancel
                    </Button>
                  )}
                  {apt.status === 'completed' && (
                    <Button size="sm" variant="outline" onClick={() => navigate('/patient/records')}>
                      View Report
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Cancel Appointment?</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to cancel this appointment?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelId(null)}>No, Keep it</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleCancel(cancelId)}>Yes, Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
