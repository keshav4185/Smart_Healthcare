import { createContext, useContext, useState, useEffect } from 'react';
import { appointmentService } from '../services/api/appointmentService';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const data = user.role === 'doctor'
        ? await appointmentService.getDoctorAppointments()
        : await appointmentService.getPatientAppointments();
      setAppointments(data || []);
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [isAuthenticated, user]);

  const addAppointment = async (doctor, formData) => {
    const payload = {
      doctorId: doctor._id || doctor.id,
      date: formData.date,
      timeSlot: formData.timeSlot,
      reason: formData.reason,
      symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : [],
      type: 'In-person',
    };
    const newApt = await appointmentService.create(payload);
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  };

  const cancelAppointment = async (id) => {
    await appointmentService.cancel(id);
    setAppointments(prev => prev.map(a => a._id === id || a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const updateAppointment = async (id, fields) => {
    const updated = await appointmentService.update(id, fields);
    setAppointments(prev => prev.map(a => a._id === id || a.id === id ? updated : a));
    return updated;
  };

  return (
    <AppointmentContext.Provider value={{ appointments, loading, addAppointment, cancelAppointment, updateAppointment, fetchAppointments }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointments must be used within AppointmentProvider');
  return context;
};
