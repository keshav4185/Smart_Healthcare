import { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext(null);

const initialAppointments = [
  { id: 1, doctorId: 'd1', doctorName: 'Dr. Sarah Smith', specialty: 'Cardiologist', date: '2025-07-20', time: '10:00 AM', status: 'confirmed', reason: 'Chest pain checkup', fee: 800 },
  { id: 2, doctorId: 'd1', doctorName: 'Dr. Sarah Smith', specialty: 'Cardiologist', date: '2025-06-15', time: '11:00 AM', status: 'completed', reason: 'Follow-up consultation', fee: 800 },
  { id: 3, doctorId: 'd1', doctorName: 'Dr. Sarah Smith', specialty: 'Cardiologist', date: '2025-06-01', time: '02:00 PM', status: 'cancelled', reason: 'Routine checkup', fee: 800 },
];

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(initialAppointments);

  const addAppointment = (doctor, formData) => {
    const newApt = {
      id: Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: formData.date,
      time: formData.timeSlot,
      status: 'confirmed',
      reason: formData.reason,
      fee: doctor.fee,
    };
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, cancelAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointments must be used within AppointmentProvider');
  return context;
};
