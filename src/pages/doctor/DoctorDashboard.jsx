import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/api/doctorService';
import { useAppointments } from '../../context/AppointmentContext';
import { FaCalendarAlt, FaUsers, FaStethoscope } from 'react-icons/fa';
import { MdCircle } from 'react-icons/md';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const [stats, setStats] = useState({ todayAppointments: 0, totalPatients: 0, pendingReports: 0, completedToday: 0 });
  const [available, setAvailable] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    doctorService.getDashboard()
      .then(data => {
        const todayStr = new Date().toISOString().split('T')[0];
        setStats({
          todayAppointments: data.appointments?.filter(a => a.date && new Date(a.date).toISOString().split('T')[0] === todayStr).length || 0,
          totalPatients: data.totalPatients || 0,
          pendingReports: data.appointments?.filter(a => a.status === 'pending').length || 0,
          completedToday: data.appointments?.filter(a => a.status === 'completed').length || 0,
        });
        if (data.available !== undefined) setAvailable(data.available);
      })
      .catch(() => {});
  }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const data = await doctorService.toggleAvailability();
      setAvailable(data.available);
    } catch { /* ignore */ }
    finally { setToggling(false); }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date && a.date.split('T')[0] === todayStr);
  const recentPatients = appointments.filter(a => a.status === 'completed').slice(0, 3);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome, {user?.name || 'Doctor'} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Today: {new Date().toDateString()}</p>
        </div>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${available ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          <div>
            <p className="text-sm font-semibold text-gray-700">Availability Status</p>
            <p className={`text-xs font-medium ${available ? 'text-green-600' : 'text-red-500'}`}>
          {available ? <MdCircle className="text-green-500 text-xs inline mr-1" /> : <MdCircle className="text-red-500 text-xs inline mr-1" />}
            {available ? 'Available for appointments' : 'Not available today'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
              available ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
              available ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><div className="text-center"><p className="text-3xl font-bold text-primary-600">{stats.todayAppointments}</p><p className="text-gray-600 text-sm mt-1">Today's Appointments</p></div></Card>
        <Card><div className="text-center"><p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p><p className="text-gray-600 text-sm mt-1">Total Patients</p></div></Card>
        <Card><div className="text-center"><p className="text-3xl font-bold text-orange-600">{stats.pendingReports}</p><p className="text-gray-600 text-sm mt-1">Pending Reports</p></div></Card>
        <Card><div className="text-center"><p className="text-3xl font-bold text-blue-600">{stats.completedToday}</p><p className="text-gray-600 text-sm mt-1">Completed Today</p></div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={<span className="flex items-center gap-2"><FaCalendarAlt />Today's Schedule</span>}>
          <div className="space-y-3">
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No appointments today</p>
            ) : (
              todayAppointments.map(apt => (
                <div key={apt._id || apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{apt.patientId?.name || apt.patientName}</p>
                    <p className="text-sm text-gray-500">{apt.timeSlot || apt.time} • {apt.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {apt.status}
                    </span>
                    <Button size="sm" variant="primary" onClick={() => navigate('/doctor/appointments')}>View</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card title={<span className="flex items-center gap-2"><FaStethoscope />Quick Actions</span>}>
            <div className="space-y-3">
              <Button variant="primary" className="w-full" onClick={() => navigate('/doctor/appointments')}><FaCalendarAlt className="inline mr-1" />View All Appointments</Button>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/doctor/patients')}><FaUsers className="inline mr-1" />Manage Patients</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/doctor/diagnoses')}><FaStethoscope className="inline mr-1" />Pending Diagnoses</Button>
            </div>
          </Card>

          <Card title={<span className="flex items-center gap-2"><FaUsers />Recent Patients</span>}>
            <div className="space-y-3">
              {recentPatients.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-2">No recent patients</p>
              ) : (
                recentPatients.map(apt => (
                  <div key={apt._id || apt.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{apt.patientId?.name || apt.patientName}</p>
                      <p className="text-xs text-gray-500">{apt.reason}</p>
                    </div>
                    <p className="text-xs text-gray-400">{apt.date}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
