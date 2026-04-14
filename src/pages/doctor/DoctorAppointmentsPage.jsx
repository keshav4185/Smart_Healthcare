import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAppointments } from '../../context/AppointmentContext';
import { FaUserAlt, FaCalendarAlt, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const DoctorAppointmentsPage = () => {
  const { appointments, updateAppointment, loading } = useAppointments();
  const [filter, setFilter] = useState('all');

  const updateStatus = async (id, status) => {
    await updateAppointment(id, { status });
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

      <div className="space-y-4">
        {loading ? (
          <Card><p className="text-center text-gray-500 py-8">Loading appointments...</p></Card>
        ) : filtered.length === 0 ? (
          <Card><p className="text-center text-gray-500 py-8">No appointments found</p></Card>
        ) : (
          filtered.map(apt => {
            const id = apt._id || apt.id;
            const patientName = apt.patientId?.name || apt.patientName || 'Patient';
            const patientAge = apt.patientId?.age || apt.age || 'N/A';
            const date = apt.date ? new Date(apt.date).toLocaleDateString('en-IN') : apt.date;
            const time = apt.timeSlot || apt.time;

            return (
              <Card key={id}>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{patientName}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {apt.type || 'In-person'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      {patientAge !== 'N/A' && <p className="flex items-center gap-1"><FaUserAlt className="text-gray-400 text-xs" />Age: {patientAge} years</p>}
                      <p className="flex items-center gap-1"><FaCalendarAlt className="text-gray-400 text-xs" />{date} at {time}</p>
                      <p className="flex items-center gap-1"><FaFileAlt className="text-gray-400 text-xs" />{apt.reason}</p>
                      {apt.fee && <p className="flex items-center gap-1"><FaMoneyBillWave className="text-gray-400 text-xs" />₹{apt.fee}</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {apt.status === 'pending' && (
                      <>
                        <Button size="sm" variant="success" onClick={() => updateStatus(id, 'confirmed')}><FiCheckCircle className="inline mr-1" />Accept</Button>
                        <Button size="sm" variant="danger" onClick={() => updateStatus(id, 'cancelled')}><FiXCircle className="inline mr-1" />Decline</Button>
                      </>
                    )}
                    {apt.status === 'confirmed' && (
                      <>
                        <Button size="sm" variant="primary" onClick={() => updateStatus(id, 'completed')}><FiCheckCircle className="inline mr-1" />Complete</Button>
                        <Button size="sm" variant="danger" onClick={() => updateStatus(id, 'cancelled')}>Cancel</Button>
                      </>
                    )}
                    {apt.status === 'completed' && <span className="text-sm text-blue-600 font-medium flex items-center gap-1"><FiCheckCircle />Done</span>}
                    {apt.status === 'cancelled' && <span className="text-sm text-red-500 font-medium flex items-center gap-1"><FiXCircle />Cancelled</span>}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
