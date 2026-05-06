import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import { useAppointments } from '../../context/AppointmentContext';
import { appointmentService } from '../../services/api/appointmentService';
import { FaCalendarAlt, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

const TIME_SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'];

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { appointments, cancelAppointment, fetchAppointments } = useAppointments();
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', timeSlot: '' });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const handleCancel = (id) => {
    cancelAppointment(id);
    setCancelId(null);
  };

  const openReschedule = async (apt) => {
    setRescheduleApt(apt);
    setRescheduleError('');
    const existingDate = apt.date ? new Date(apt.date).toISOString().split('T')[0] : '';
    setRescheduleForm({ date: existingDate, timeSlot: apt.timeSlot || '' });
    if (existingDate) {
      try {
        const slots = await appointmentService.getBookedSlots(apt.doctorId?._id || apt.doctorId, existingDate);
        setBookedSlots(slots);
      } catch { setBookedSlots([]); }
    }
  };

  const handleDateChange = async (date) => {
    setRescheduleForm(prev => ({ ...prev, date, timeSlot: '' }));
    if (date && rescheduleApt) {
      try {
        const slots = await appointmentService.getBookedSlots(rescheduleApt.doctorId?._id || rescheduleApt.doctorId, date);
        setBookedSlots(slots);
      } catch { setBookedSlots([]); }
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleForm.date || !rescheduleForm.timeSlot) return;
    setRescheduling(true);
    setRescheduleError('');
    try {
      await appointmentService.reschedule(rescheduleApt._id || rescheduleApt.id, rescheduleForm.date, rescheduleForm.timeSlot);
      await fetchAppointments();
      setRescheduleApt(null);
    } catch (err) {
      setRescheduleError(err?.response?.data?.message || 'Reschedule failed. Please try again.');
    } finally {
      setRescheduling(false);
    }
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

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card><p className="text-center text-gray-500 py-8">No appointments found.</p></Card>
        ) : (
          filtered.map(apt => {
            const id = apt._id || apt.id;
            const doctorName = apt.doctorId?.name || apt.doctorName;
            const specialty = apt.doctorId?.specialty || apt.specialty;
            const time = apt.timeSlot || apt.time;
            const date = apt.date ? new Date(apt.date).toLocaleDateString('en-IN') : '';
            return (
              <Card key={id}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{doctorName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[apt.status]}`}>{apt.status}</span>
                    </div>
                    <p className="text-primary-600 text-sm font-medium">{specialty}</p>
                    <p className="text-gray-600 text-sm mt-1"><FaCalendarAlt className="inline mr-1 text-gray-400" />{date} at {time}</p>
                    <p className="text-gray-500 text-sm"><FaFileAlt className="inline mr-1 text-gray-400" />{apt.reason}</p>
                    {apt.fee > 0 && <p className="text-green-600 text-sm font-medium"><FaMoneyBillWave className="inline mr-1" />₹{apt.fee}</p>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {apt.status === 'confirmed' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => openReschedule(apt)}>
                          <FiRefreshCw className="inline mr-1" />Reschedule
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setCancelId(id)}>Cancel</Button>
                      </>
                    )}
                    {apt.status === 'pending' && (
                      <Button size="sm" variant="danger" onClick={() => setCancelId(id)}>Cancel</Button>
                    )}
                    {apt.status === 'completed' && (
                      <Button size="sm" variant="outline" onClick={() => navigate('/patient/records')}>View Report</Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Cancel Modal */}
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

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Reschedule Appointment</h3>
            <p className="text-sm text-gray-500 mb-4">Dr. {rescheduleApt.doctorId?.name || rescheduleApt.doctorName}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Date <span className="text-red-500">*</span></label>
                <input type="date" className="input-field" value={rescheduleForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => handleDateChange(e.target.value)} />
              </div>
              {rescheduleForm.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Time Slot <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const isBooked = bookedSlots.includes(slot) && slot !== rescheduleApt.timeSlot;
                      return (
                        <button key={slot} type="button" disabled={isBooked}
                          onClick={() => setRescheduleForm(prev => ({ ...prev, timeSlot: slot }))}
                          className={`py-2 px-1 text-xs rounded-lg border transition-all ${
                            rescheduleForm.timeSlot === slot ? 'bg-primary-600 text-white border-primary-600'
                            : isBooked ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                          }`}>
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {rescheduleError && <p className="text-red-500 text-sm">{rescheduleError}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setRescheduleApt(null)}>Cancel</Button>
              <Button variant="primary" className="flex-1" disabled={!rescheduleForm.date || !rescheduleForm.timeSlot || rescheduling}
                onClick={handleReschedule}>
                {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
