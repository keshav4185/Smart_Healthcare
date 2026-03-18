import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../constants/roles';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const patientMenu = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: '📊' },
    { name: 'Find Doctors', path: '/patient/doctors', icon: '👨⚕️' },
    { name: 'Symptoms', path: '/patient/symptoms', icon: '🩺' },
    { name: 'Appointments', path: '/patient/appointments', icon: '📅' },
    { name: 'Medical Records', path: '/patient/records', icon: '📋' },
    { name: 'My Profile', path: '/profile', icon: '👤' },
  ];

  const doctorMenu = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: '📊' },
    { name: 'Appointments', path: '/doctor/appointments', icon: '📅' },
    { name: 'Patients', path: '/doctor/patients', icon: '👥' },
    { name: 'Diagnoses', path: '/doctor/diagnoses', icon: '🩺' },
    { name: 'My Profile', path: '/profile', icon: '👤' },
  ];

  const adminMenu = [
    { name: 'Doctor Verification', path: '/admin/dashboard', icon: '🛡️' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case USER_ROLES.PATIENT:
        return patientMenu;
      case USER_ROLES.DOCTOR:
        return doctorMenu;
      case USER_ROLES.ADMIN:
        return adminMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-800 text-white rounded-lg"
      >
        <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`bg-primary-800 text-white w-64 min-h-screen fixed left-0 top-0 z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold">HealthCare+</h2>
          <p className="text-primary-200 text-sm mt-1 capitalize">{user?.role} Portal</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-700 border-l-4 border-white'
                  : 'hover:bg-primary-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
