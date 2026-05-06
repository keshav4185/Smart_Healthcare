import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import axiosInstance from '../../services/api/axiosInstance';
import { FaUserMd, FaStar, FaMoneyBillWave, FaCalendarAlt, FaClock, FaIdCard } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { GiPartyPopper } from 'react-icons/gi';

const timeSlots = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','03:30 PM'];

const getNextDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; dates.length < 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${day}`);
    }
  }
  return dates;
};

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [bookedApt, setBookedApt] = useState(null);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formData, setFormData] = useState({
    date: '', timeSlot: '', reason: '', symptoms: '',
    patientName: user?.name || '', patientAge: '', patientGender: '',
  });

  const availableDates = getNextDates();

  useEffect(() => {
    axiosInstance.get(`/patient/doctors/${doctorId}`)
      .then(res => setDoctor(res.data.data || null))
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDateSelect = async (date) => {
    setFormData(prev => ({ ...prev, date, timeSlot: '' }));
    try {
      const res = await axiosInstance.get(`/appointments/booked-slots?doctorId=${doctor._id || doctor.id}&date=${date}`);
      setBookedSlots(res.data.data?.bookedSlots || []);
    } catch {
      setBookedSlots([]);
    }
  };

  const handleConfirm = async () => {
    setBooking(true);
    setBookingError('');
    try {
      const apt = await addAppointment(doctor, formData);
      setBookedApt(apt);
      setStep(4);
    } catch (err) {
      setBookingError(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading doctor info...</div>;
  if (!doctor) return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">Doctor not found.</p>
      <Button variant="primary" onClick={() => navigate('/patient/doctors')}>Browse Doctors</Button>
    </div>
  );

  const doctorId = doctor._id || doctor.id;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Book Appointment</h1>

      {step < 4 && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>{s}</div>
                {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm">
            <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Date & Time</span>
            <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Patient Details</span>
            <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Confirm</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {step < 4 && (
          <Card className="lg:col-span-1 h-fit">
            <div className="text-center">
              <div className="flex justify-center mb-3"><FaUserMd className="text-6xl text-primary-400" /></div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                <MdVerified className="text-green-600" />
              </div>
              <p className="text-primary-600 font-medium">{doctor.specialty}</p>
              <p className="text-sm text-gray-500">{doctor.hospital}</p>
              <p className="text-2xl font-bold text-green-600 mt-3">₹{doctor.fee}</p>
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="text-sm mt-2 flex items-center justify-center gap-1">
                <FaStar className="text-yellow-400" />{doctor.rating || 'N/A'} • {doctor.experience} {typeof doctor.experience === 'number' ? 'yrs' : ''}
              </p>
            </div>
          </Card>
        )}

        <div className={step < 4 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {step === 1 && (
            <Card title="Select Date & Time">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {availableDates.map(date => (
                    <button key={date} onClick={() => handleDateSelect(date)}
                      className={`p-3 rounded-lg border-2 text-sm transition-colors ${
                        formData.date === date ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 hover:border-primary-300'
                      }`}>
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>
              {formData.date && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <button key={slot}
                          onClick={() => !isBooked && setFormData({ ...formData, timeSlot: slot })}
                          disabled={isBooked}
                          className={`p-2 rounded-lg border-2 text-sm transition-colors ${
                            isBooked
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                              : formData.timeSlot === slot
                              ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}>
                          {slot}
                          {isBooked && <span className="block text-xs">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Available / Booked</p>
                </div>
              )}
              <Button variant="primary" className="w-full mt-2" disabled={!formData.date || !formData.timeSlot} onClick={() => setStep(2)}>
                Continue →
              </Button>
            </Card>
          )}

          {step === 2 && (
            <Card title="Patient Details">
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <Input label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Age" name="patientAge" type="number" value={formData.patientAge} onChange={handleChange} required />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                    <select name="patientGender" value={formData.patientGender} onChange={handleChange} className="input-field" required>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit <span className="text-red-500">*</span></label>
                  <textarea name="reason" value={formData.reason} onChange={handleChange} className="input-field min-h-20" placeholder="Describe your reason..." required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (Optional)</label>
                  <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} className="input-field min-h-20" placeholder="e.g. Fever, Headache..." />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                  <Button type="submit" variant="primary" className="flex-1">Continue →</Button>
                </div>
              </form>
            </Card>
          )}

          {step === 3 && (
            <Card title="Confirm Appointment">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Doctor:</span><span className="font-medium">{doctor.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Specialty:</span><span className="font-medium">{doctor.specialty}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-medium">{new Date(formData.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Time:</span><span className="font-medium">{formData.timeSlot}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Patient:</span><span className="font-medium">{formData.patientName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Age / Gender:</span><span className="font-medium">{formData.patientAge} yrs / {formData.patientGender}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Reason:</span><span className="font-medium">{formData.reason}</span></div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Consultation Fee</span>
                  <span className="text-2xl font-bold text-green-600">₹{doctor.fee}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                  <Button variant="primary" className="flex-1" onClick={handleConfirm} disabled={booking}>
                    {booking
                      ? <><AiOutlineLoading3Quarters className="inline animate-spin mr-1" />Booking...</>
                      : <><FiCheckCircle className="inline mr-1" />Confirm & Book</>}
                  </Button>
                </div>
                {bookingError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
                    <FiXCircle />{bookingError}
                  </div>
                )}
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <div className="text-center py-8">
                <div className="flex justify-center mb-4"><GiPartyPopper className="text-7xl text-green-400" /></div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Appointment Booked!</h2>
                <p className="text-gray-500 mb-6">Your appointment has been confirmed successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
                  <p className="flex items-center gap-2"><FaIdCard className="text-gray-400" />Appointment ID: <span className="font-bold text-primary-600">#{bookedApt?._id || bookedApt?.id}</span></p>
                  <p className="flex items-center gap-2"><FaUserMd className="text-gray-400" />Doctor: <span className="font-medium">{doctor.name}</span></p>
                  <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400" />Date: <span className="font-medium">{new Date(formData.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
                  <p className="flex items-center gap-2"><FaClock className="text-gray-400" />Time: <span className="font-medium">{formData.timeSlot}</span></p>
                  <p className="flex items-center gap-2"><FaMoneyBillWave className="text-gray-400" />Fee: <span className="font-medium text-green-600">₹{doctor.fee}</span></p>
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1" onClick={() => navigate('/patient/appointments')}>View Appointments</Button>
                  <Button variant="secondary" className="flex-1" onClick={() => navigate('/patient/dashboard')}>Dashboard</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
