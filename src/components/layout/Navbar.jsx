import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppointments } from '../../context/AppointmentContext';
import { MdLanguage } from 'react-icons/md';
import { FiLogOut, FiBell } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleLanguage, isMarathi } = useLanguage();
  const { appointments } = useAppointments();
  const navigate = useNavigate();

  // Unread = confirmed appointments patient hasn't acted on, or pending for doctor
  const unread = appointments.filter(a =>
    user?.role === 'patient'
      ? a.status === 'confirmed'
      : a.status === 'pending'
  ).length;

  return (
    <nav className="bg-white shadow-md h-16 fixed top-0 right-0 left-0 lg:left-64 z-10">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center ml-12 lg:ml-0">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-800">Smart Healthcare</h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors text-sm font-medium"
          >
            <MdLanguage className="text-lg" />
            <span className="hidden sm:inline">{isMarathi ? 'मराठी' : 'English'}</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => navigate(user?.role === 'doctor' ? '/doctor/appointments' : '/patient/appointments')}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={user?.role === 'patient' ? 'Confirmed appointments' : 'Pending appointments'}
          >
            <FiBell className="text-xl text-gray-600" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
              {user?.profilePhoto
                ? <img src={user.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                : <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              }
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </button>

          <button
            onClick={logout}
            className="px-2 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
          >
            <FiLogOut /><span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
