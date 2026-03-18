import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const todaySchedule = [
  { id: 1, patient: 'Rahul Patil', time: '10:00 AM', reason: 'Chest pain', status: 'confirmed' },
  { id: 2, patient: 'Priya Sharma', time: '11:00 AM', reason: 'Follow-up', status: 'confirmed' },
  { id: 3, patient: 'Amit Desai', time: '12:00 PM', reason: 'ECG Report', status: 'pending' },
  { id: 4, patient: 'Sunita Jadhav', time: '02:00 PM', reason: 'Routine checkup', status: 'confirmed' },
];

const recentPatients = [
  { id: 1, name: 'Rahul Patil', age: 45, lastVisit: '2025-07-10', diagnosis: 'Hypertension' },
  { id: 2, name: 'Priya Sharma', age: 32, lastVisit: '2025-07-08', diagnosis: 'Arrhythmia' },
  { id: 3, name: 'Amit Desai', age: 58, lastVisit: '2025-07-05', diagnosis: 'Heart failure' },
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const stats = {
    todayAppointments: todaySchedule.length,
    totalPatients: 145,
    pendingReports: 3,
    completedToday: 1,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Welcome, {user?.name || 'Doctor'} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Today: {new Date().toDateString()}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{stats.todayAppointments}</p>
            <p className="text-gray-600 text-sm mt-1">Today's Appointments</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
            <p className="text-gray-600 text-sm mt-1">Total Patients</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.pendingReports}</p>
            <p className="text-gray-600 text-sm mt-1">Pending Reports</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.completedToday}</p>
            <p className="text-gray-600 text-sm mt-1">Completed Today</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card title="📅 Today's Schedule">
          <div className="space-y-3">
            {todaySchedule.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{apt.patient}</p>
                  <p className="text-sm text-gray-500">{apt.time} • {apt.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                  <Button size="sm" variant="primary" onClick={() => navigate('/doctor/appointments')}>
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card title="⚡ Quick Actions">
            <div className="space-y-3">
              <Button variant="primary" className="w-full" onClick={() => navigate('/doctor/appointments')}>
                📅 View All Appointments
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/doctor/patients')}>
                👥 Manage Patients
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/doctor/diagnoses')}>
                🩺 Pending Diagnoses
              </Button>
            </div>
          </Card>

          {/* Recent Patients */}
          <Card title="👥 Recent Patients">
            <div className="space-y-3">
              {recentPatients.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">Age {p.age} • {p.diagnosis}</p>
                  </div>
                  <p className="text-xs text-gray-400">{p.lastVisit}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
