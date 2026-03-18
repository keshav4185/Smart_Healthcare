import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import { useNavigate } from 'react-router-dom';
import { analyzeScanWithSymptoms, getSeverityColor } from '../../utils/aiAnalysis';
import { generateMedicalReportPDF } from '../../utils/pdfGenerator';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats] = useState({
    upcomingAppointments: 3,
    completedAppointments: 12,
    pendingDiagnoses: 1,
  });

  const [showUpload, setShowUpload] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    type: 'X-Ray',
    file: null,
    symptoms: '',
  });

  const handleFileChange = (e) => {
    setUploadForm({ ...uploadForm, file: e.target.files[0] });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    if ((uploadForm.type === 'X-Ray' || uploadForm.type === 'CT Scan' || uploadForm.type === 'MRI Scan') && uploadForm.symptoms) {
      const analysis = analyzeScanWithSymptoms(uploadForm.type, uploadForm.symptoms);
      setAiAnalysis(analysis);
      
      const reportData = {
        patientName: user?.name || 'Patient',
        age: 35,
        gender: 'Male',
        symptoms: uploadForm.symptoms.split(',').map(s => s.trim()),
        scanType: uploadForm.type,
        date: new Date().toISOString(),
        findings: analysis.finding,
      };
      
      generateMedicalReportPDF(reportData);
    }
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
        <Card title="📸 Quick Scan Upload">
          {aiAnalysis ? (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border-2 ${getSeverityColor(aiAnalysis.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">Severity:</span>
                  <span className="font-bold">{aiAnalysis.severity}</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-1 text-sm">🔍 Finding:</h4>
                <p className="text-sm text-gray-700">{aiAnalysis.finding}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-bold text-green-900 mb-1 text-sm">👨⚕️ Recommendation:</h4>
                <p className="text-sm text-gray-700">{aiAnalysis.recommendation}</p>
              </div>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => {
                  setAiAnalysis(null);
                  setUploadForm({ type: 'X-Ray', file: null, symptoms: '' });
                }}
              >
                Upload Another Scan
              </Button>
            </div>
          ) : showUpload ? (
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scan Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                  className="input-field"
                  required
                >
                  <option>X-Ray</option>
                  <option>CT Scan</option>
                  <option>MRI Scan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="input-field text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={uploadForm.symptoms}
                  onChange={(e) => setUploadForm({ ...uploadForm, symptoms: e.target.value })}
                  className="input-field min-h-20 text-sm"
                  placeholder="e.g., Chest pain, Fever"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="flex-1">
                  Get AI Analysis
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Upload your X-Ray, CT Scan, or MRI for instant AI analysis</p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowUpload(true)}
              >
                📸 Upload Scan Now
              </Button>
            </div>
          )}
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/patient/symptoms')}
            >
              Check Symptoms
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/patient/appointments')}
            >
              Book Appointment
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/patient/records')}
            >
              View Medical Records
            </Button>
          </div>
        </Card>

        <Card title="Recent Activity" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Appointment with Dr. Smith</p>
                <p className="text-sm text-gray-600">Tomorrow at 10:00 AM</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Confirmed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Lab Results Available</p>
                <p className="text-sm text-gray-600">2 days ago</p>
              </div>
              <span className="text-blue-600 text-sm font-medium">New</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
