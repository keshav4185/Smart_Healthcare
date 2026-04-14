import axiosInstance from './axiosInstance';

export const appointmentService = {
  getPatientAppointments: async () => {
    const res = await axiosInstance.get('/patient/appointments');
    return res.data.data;
  },

  getDoctorAppointments: async () => {
    const res = await axiosInstance.get('/doctor/appointments');
    return res.data.data;
  },

  create: async ({ doctorId, date, timeSlot, reason, symptoms, type = 'In-person' }) => {
    const res = await axiosInstance.post('/appointments/create', { doctorId, date, timeSlot, reason, symptoms, type });
    return res.data.data;
  },

  update: async (id, fields) => {
    const res = await axiosInstance.put(`/appointments/update/${id}`, fields);
    return res.data.data;
  },

  cancel: async (id) => {
    const res = await axiosInstance.delete(`/appointments/cancel/${id}`);
    return res.data;
  },

  reschedule: async (id, date, timeSlot) => {
    const res = await axiosInstance.put(`/appointments/reschedule/${id}`, { date, timeSlot });
    return res.data.data;
  },

  getBookedSlots: async (doctorId, date) => {
    const res = await axiosInstance.get(`/appointments/booked-slots?doctorId=${doctorId}&date=${date}`);
    return res.data.data?.bookedSlots || [];
  },
};
