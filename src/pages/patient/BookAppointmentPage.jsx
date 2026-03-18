import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { mockDoctors } from '../../services/api/mockAuthService';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

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

  const doctor = mockDoctors.find(d => d.id === doctorId) || mockDoctors[0];
  const availableDates = getNextDates();

  const [step, setStep] = useState(1);
  const [bookedApt, setBookedApt] = useState(null);
  const [formData, setFormData] = useState({
    date: '', timeSlot: '', reason: '', symptoms: '',
    patientName: user?.name || '', patientAge: '', patientGender: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConfirm = () => {
    const apt = addAppointment(doctor, formData);
    setBookedApt(apt);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Book Appointment</h1>

      {/* Stepper */}
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
        {/* Doctor Info */}
        {step < 4 && (
          <Card className="lg:col-span-1 h-fit">
            <div className="text-center">
              <div className="text-6xl mb-3">👨⚕️</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
                <span className="text-green-600 text-xs">✅</span>
              </div>
              <p className="text-primary-600 font-medium">{doctor.specialty}</p>
              <p className="text-sm text-gray-500">{doctor.hospital}</p>
              <p className="text-2xl font-bold text-green-600 mt-3">₹{doctor.fee}</p>
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="text-sm mt-2">⭐ {doctor.rating} • {doctor.experience}</p>
            </div>
          </Card>
        )}

        <div className={step < 4 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {/* Step 1 - Date & Time */}
          {step === 1 && (
            <Card title="Select Date & Time">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {availableDates.map(date => (
                    <button key={date} onClick={() => setFormData({ ...formData, date })}
                      className={`p-3 rounded-lg border-2 text-sm transition-colors ${
                        formData.date === date ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 hover:border-primary-300'
                      }`}>
                      {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              </div>

              {formData.date && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                      <button key={slot} onClick={() => setFormData({ ...formData, timeSlot: slot })}
                        className={`p-2 rounded-lg border-2 text-sm transition-colors ${
                          formData.timeSlot === slot ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 hover:border-primary-300'
                        }`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="primary" className="w-full mt-2" disabled={!formData.date || !formData.timeSlot} onClick={() => setStep(2)}>
                Continue →
              </Button>
            </Card>
          )}

          {/* Step 2 - Patient Details */}
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
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
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

          {/* Step 3 - Confirm */}
          {step === 3 && (
            <Card title="Confirm Appointment">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Doctor:</span><span className="font-medium">{doctor.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Specialty:</span><span className="font-medium">{doctor.specialty}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-medium">{new Date(formData.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
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
                  <Button variant="primary" className="flex-1" onClick={handleConfirm}>✅ Confirm & Book</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4 - Success */}
          {step === 4 && (
            <Card>
              <div className="text-center py-8">
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Appointment Booked!</h2>
                <p className="text-gray-500 mb-6">Your appointment has been confirmed successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
                  <p>🆔 Appointment ID: <span className="font-bold text-primary-600">#{bookedApt?.id}</span></p>
                  <p>👨⚕️ Doctor: <span className="font-medium">{doctor.name}</span></p>
                  <p>📅 Date: <span className="font-medium">{new Date(formData.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
                  <p>🕐 Time: <span className="font-medium">{formData.timeSlot}</span></p>
                  <p>💰 Fee: <span className="font-medium text-green-600">₹{doctor.fee}</span></p>
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
