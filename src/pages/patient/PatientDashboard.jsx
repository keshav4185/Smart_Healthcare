import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import { useNavigate } from 'react-router-dom';
import { getSeverityColor } from '../../utils/aiAnalysis';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/api/patientService';
import axiosInstance from '../../services/api/axiosInstance';
import { FaSearch, FaUserMd, FaStar } from 'react-icons/fa';
import { MdSick, MdVerified, MdCircle } from 'react-icons/md';
import { FiDownload, FiCamera, FiAlertTriangle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [stats, setStats] = useState({ upcomingAppointments: 0, completedAppointments: 0, pendingDiagnoses: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadForm, setUploadForm] = useState({ type: 'X-Ray', file: null, symptoms: '' });
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);

  useEffect(() => {
    patientService.getDashboard()
      .then(data => {
        const apts = data.appointments || [];
        setRecentAppointments(apts.slice(0, 2));
        setStats({
          upcomingAppointments: apts.filter(a => a.status === 'confirmed').length,
          completedAppointments: apts.filter(a => a.status === 'completed').length,
          pendingDiagnoses: (data.diagnoses || []).length,
        });
      })
      .catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.symptoms) return;
    setUploading(true);
    setUploadError('');
    setSuggestedDoctors([]);
    try {
      const formData = new FormData();
      formData.append('image', uploadForm.file);
      formData.append('scanType', uploadForm.type);
      formData.append('symptoms', JSON.stringify(uploadForm.symptoms.split(',').map(s => s.trim())));
      const { data } = await axiosInstance.post('/ai/scan-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setAiAnalysis(data.data);
      fetchSuggestedDoctors(data.data.recommendation || '', data.data.possible_conditions || []);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'Analysis failed. Please try again.';
      if (status === 422) {
        setUploadError(msg); // not a medical image
      } else {
        setUploadError(msg);
      }
    } finally {
      setUploading(false);
    }
  };

  const fetchSuggestedDoctors = async (recommendation, possibleConditions = []) => {
    try {
      const res = await axiosInstance.get('/patient/doctors');
      const allDoctors = res.data.data || [];
      const searchText = (recommendation + ' ' + possibleConditions.join(' ')).toLowerCase();

      const matched = allDoctors.filter(d => {
        if (!d.specialty) return false;
        const specialty = d.specialty.toLowerCase();
        // Check if any word of the specialty appears in the AI text
        return specialty.split(' ').some(word => word.length > 3 && searchText.includes(word));
      });

      // Only show doctors if there's a real match — never show all doctors
      setSuggestedDoctors(matched.slice(0, 3));
    } catch {
      setSuggestedDoctors([]);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await axiosInstance.post('/ai/download-report', { ...aiAnalysis, scanType: uploadForm.type }, { responseType: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(res.data);
      a.download = 'scan-report.pdf';
      a.click();
    } catch {
      alert('Failed to download report. Please try again.');
    }
  };

  const resetUpload = () => {
    setAiAnalysis(null);
    setUploadError('');
    setSuggestedDoctors([]);
    setUploadForm({ type: 'X-Ray', file: null, symptoms: '' });
  };

  return (
    <div>
      <EmergencySOS />
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">Patient Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">{stats.upcomingAppointments}</p>
            <p className="text-gray-600 mt-2">Upcoming Appointments</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{stats.completedAppointments}</p>
            <p className="text-gray-600 mt-2">Completed Appointments</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-600">{stats.pendingDiagnoses}</p>
            <p className="text-gray-600 mt-2">Pending Diagnoses</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card title={<span className="flex items-center gap-2"><FiCamera /> Quick Scan Upload</span>}>
          {aiAnalysis ? (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border-2 ${getSeverityColor(aiAnalysis.severity)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">Severity:</span>
                  <span className="font-bold text-sm capitalize">{aiAnalysis.severity}</span>
                </div>
                {aiAnalysis.affected_area && (
                  <p className="text-xs text-gray-600">Affected Area: {aiAnalysis.affected_area}</p>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-1 text-sm"><FaSearch className="inline mr-1" />Finding:</h4>
                <p className="text-sm text-gray-700">{aiAnalysis.finding}</p>
              </div>

              {(aiAnalysis.predicted_symptoms_en || aiAnalysis.predicted_symptoms_mr) && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-bold text-yellow-900 mb-2 text-sm"><MdSick className="inline mr-1" />Predicted Symptoms</h4>
                  {aiAnalysis.predicted_symptoms_en && (
                    <p className="text-sm text-gray-700">{aiAnalysis.predicted_symptoms_en}</p>
                  )}
                  {aiAnalysis.predicted_symptoms_mr && (
                    <p className="text-sm text-orange-700 mt-1 pt-1 border-t border-yellow-200">{aiAnalysis.predicted_symptoms_mr}</p>
                  )}
                </div>
              )}

              {aiAnalysis.possible_conditions?.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-bold text-purple-900 mb-1 text-sm"><FaUserMd className="inline mr-1" />Possible Conditions:</h4>
                  <p className="text-sm text-gray-700">{aiAnalysis.possible_conditions.join(', ')}</p>
                </div>
              )}

              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-bold text-green-900 mb-1 text-sm"><FaUserMd className="inline mr-1" />Recommendation:</h4>
                <p className="text-sm text-gray-700">{aiAnalysis.recommendation}</p>
              </div>

              {aiAnalysis.home_therapy?.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <h4 className="font-bold text-emerald-800 mb-2 text-sm">🏠 Home Remedies / घरगुती उपाय</h4>
                  <div className="space-y-2">
                    {aiAnalysis.home_therapy.map((remedy, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-emerald-600 font-bold text-xs mt-0.5 shrink-0">{i + 1}.</span>
                        <div>
                          <p className="text-emerald-800 text-xs">{remedy}</p>
                          {aiAnalysis.home_therapy_mr?.[i] && (
                            <p className="text-emerald-600 text-xs mt-0.5">{aiAnalysis.home_therapy_mr[i]}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Doctors */}
              {suggestedDoctors.length > 0 && (
                <div className="bg-white border border-primary-200 rounded-lg p-3">
                  <h4 className="font-bold text-primary-800 mb-2 text-sm flex items-center gap-1">
                    <FaUserMd className="text-primary-500" />Suggested Doctors
                  </h4>
                  <div className="space-y-2">
                    {suggestedDoctors.map(doc => (
                      <div key={doc._id || doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <div>
                          <p className="font-medium text-gray-800 text-sm flex items-center gap-1">
                            {doc.name} <MdVerified className="text-green-500 text-xs" />
                          </p>
                          <p className="text-xs text-primary-600">{doc.specialty}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaStar className="text-yellow-400" />{doc.rating || 'N/A'} • ₹{doc.fee}
                            <span className={`ml-1 flex items-center gap-0.5 ${ doc.available !== false ? 'text-green-600' : 'text-red-500'}`}>
                              <MdCircle className="text-xs" />{doc.available !== false ? 'Available' : 'Unavailable'}
                            </span>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={doc.available !== false ? 'primary' : 'secondary'}
                          disabled={doc.available === false}
                          onClick={() => navigate(`/patient/book-appointment/${doc._id || doc.id}`)}
                        >
                          Book
                        </Button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate(`/patient/doctors`)} className="text-xs text-primary-600 hover:underline mt-2 block">
                    View all doctors →
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="primary" className="flex-1" onClick={handleDownloadReport}>
                  <FiDownload className="inline mr-1" />Download Report
                </Button>
                <Button variant="secondary" className="flex-1" onClick={resetUpload}>
                  Upload Another
                </Button>
              </div>
            </div>
          ) : showUpload ? (
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scan Type <span className="text-red-500">*</span></label>
                <select value={uploadForm.type} onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })} className="input-field" required>
                  <option>X-Ray</option>
                  <option>CT Scan</option>
                  <option>MRI Scan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File <span className="text-red-500">*</span></label>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })} className="input-field text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms <span className="text-red-500">*</span></label>
                <textarea value={uploadForm.symptoms} onChange={(e) => setUploadForm({ ...uploadForm, symptoms: e.target.value })} className="input-field min-h-20 text-sm" placeholder="e.g., Chest pain, Fever" required />
              </div>
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <FiAlertTriangle className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-red-600 text-xs">{uploadError}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => { setShowUpload(false); setUploadError(''); }}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" className="flex-1" disabled={uploading}>
                  {uploading ? <><AiOutlineLoading3Quarters className="inline animate-spin mr-1" />Analyzing...</> : 'Get AI Analysis'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Upload your X-Ray, CT Scan, or MRI for instant AI analysis</p>
              <Button variant="primary" className="w-full" onClick={() => setShowUpload(true)}><FiCamera className="inline mr-1" />Upload Scan Now</Button>
            </div>
          )}
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={() => navigate('/patient/symptoms')}>Check Symptoms</Button>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/patient/appointments')}>Book Appointment</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/patient/records')}>View Medical Records</Button>
          </div>
        </Card>

        <Card title="Recent Activity" className="lg:col-span-2">
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map(apt => (
                <div key={apt._id || apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Appointment with {apt.doctorId?.name || apt.doctorName}</p>
                    <p className="text-sm text-gray-600">{apt.date} at {apt.timeSlot || apt.time}</p>
                  </div>
                  <span className={`text-sm font-medium capitalize ${apt.status === 'confirmed' ? 'text-green-600' : apt.status === 'completed' ? 'text-blue-600' : 'text-gray-500'}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
