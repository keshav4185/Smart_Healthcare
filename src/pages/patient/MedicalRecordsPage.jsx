import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import useSpeech from '../../hooks/useSpeech';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
import { patientService } from '../../services/api/patientService';
import axiosInstance from '../../services/api/axiosInstance';
import { FaCalendarAlt, FaUserMd, FaFileAlt, FaFileMedical, FaPills } from 'react-icons/fa';
import { FiUpload, FiEye, FiDownload, FiShare2 } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const SCAN_TYPES = ['X-Ray', 'CT Scan', 'MRI Scan', 'Lab Report', 'Prescription'];

const MedicalRecordsPage = () => {
  const navigate = useNavigate();
  const { isMarathi } = useLanguage();
  const { speak, stop, speaking, supported } = useSpeech();
  const [tab, setTab] = useState('records');
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadForm, setUploadForm] = useState({ type: 'X-Ray', file: null, symptoms: '' });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchRecords = () => {
    setLoading(true);
    Promise.all([
      patientService.getMedicalRecords(),
      patientService.getPrescriptions(),
    ])
      .then(([recs, presc]) => { setRecords(recs || []); setPrescriptions(presc || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) return;
    setUploading(true);
    setUploadError('');
    setAnalyzing(true);
    setAiAnalysis(null);
    setSuggestedDoctors([]);
    try {
      // First analyze with AI
      const formData = new FormData();
      formData.append('image', uploadForm.file);
      formData.append('scanType', uploadForm.type);
      if (uploadForm.symptoms) formData.append('symptoms', JSON.stringify(uploadForm.symptoms.split(',').map(s => s.trim())));
      
      const aiRes = await axiosInstance.post('/ai/scan-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const analysis = aiRes.data.data;
      setAiAnalysis(analysis);
      
      // Extract specialist from recommendation
      const recommendation = analysis.recommendation || '';
      const specialistMatch = recommendation.match(/consult\s+(?:a\s+)?([A-Za-z\s]+?)(?:\s+for|\s+immediately|\.|$)/i);
      const specialist = specialistMatch ? specialistMatch[1].trim() : '';
      
      // Fetch matching doctors
      if (specialist) {
        const doctorsRes = await axiosInstance.get('/patient/doctors');
        const allDoctors = Array.isArray(doctorsRes.data.data) ? doctorsRes.data.data : doctorsRes.data.data?.doctors || [];
        const keyword = specialist.toLowerCase();
        const matched = allDoctors.filter(d => {
          if (!d.specialty) return false;
          const specialty = d.specialty.toLowerCase();
          return specialty.includes(keyword) || keyword.includes(specialty);
        });
        setSuggestedDoctors(matched.slice(0, 3));
      }
      
      // Then upload the scan
      await patientService.uploadScan(uploadForm.file, uploadForm.type, uploadForm.symptoms);
      setUploadSuccess('Scan analyzed and uploaded successfully!');
      fetchRecords();
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleView = (record) => { if (record.fileUrl) window.open(record.fileUrl, '_blank'); };

  const handleDownload = (record) => {
    if (record.fileUrl) {
      const a = document.createElement('a');
      a.href = record.fileUrl;
      a.download = record.title;
      a.click();
    }
  };

  const handleShare = (record) => {
    const text = `Medical record: ${record.title} by ${record.doctorId?.name || record.doctor || 'Doctor'}`;
    if (navigator.share) navigator.share({ title: record.title, text });
    else navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Medical Records</h1>
        {tab === 'records' && (
          <Button variant="primary" onClick={() => { setShowUpload(true); setUploadError(''); }}>
            + Upload New Record
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('records')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'records' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          <FaFileMedical />Records
        </button>
        <button onClick={() => setTab('prescriptions')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            tab === 'prescriptions' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          <FaPills />Prescriptions
          {prescriptions.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{prescriptions.length}</span>
          )}
        </button>
      </div>

      {uploadSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <MdCheckCircle />{uploadSuccess}
        </div>
      )}

      {/* Upload Form */}
      {tab === 'records' && showUpload && (
        <Card title={<span className="flex items-center gap-2"><FiUpload />Upload Medical Record</span>} className="mb-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Record Type <span className="text-red-500">*</span></label>
                <select value={uploadForm.type} onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })} className="input-field" required>
                  {SCAN_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File (JPG, PNG, PDF) <span className="text-red-500">*</span></label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })} className="input-field text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Notes (Optional)</label>
              <textarea value={uploadForm.symptoms} onChange={(e) => setUploadForm({ ...uploadForm, symptoms: e.target.value })} className="input-field min-h-16 text-sm" placeholder="e.g., Chest pain, Fever..." />
            </div>
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
            
            {analyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <AiOutlineLoading3Quarters className="inline animate-spin mr-2" />{isMarathi ? 'AI स्कॅन विश्लेषण करत आहे...' : 'Analyzing scan with AI...'}
              </div>
            )}
            
            {aiAnalysis && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-green-800">{isMarathi ? 'AI विश्लेषण पूर्ण' : 'AI Analysis Complete'}</p>
                  {supported && (
                    <button
                      onClick={() => {
                        const text = isMarathi
                          ? `निष्कर्ष: ${aiAnalysis.finding}. तीव्रता: ${aiAnalysis.severity}. अंदाजित लक्षणे: ${aiAnalysis.predicted_symptoms_mr || aiAnalysis.predicted_symptoms_en}. शिफारस: ${aiAnalysis.recommendation}`
                          : `Finding: ${aiAnalysis.finding}. Severity: ${aiAnalysis.severity}. Predicted symptoms: ${aiAnalysis.predicted_symptoms_en}. Recommendation: ${aiAnalysis.recommendation}`;
                        speaking ? stop() : speak(text, isMarathi ? 'mr' : 'en');
                      }}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-medium transition-colors ${
                        speaking ? 'bg-red-50 border-red-300 text-red-600' : 'bg-blue-50 border-blue-300 text-blue-600'
                      }`}>
                      {speaking ? <><FaVolumeMute />{isMarathi ? 'थांबवा' : 'Stop'}</> : <><FaVolumeUp />{isMarathi ? 'ऐका' : 'Listen'}</>}
                    </button>
                  )}
                </div>
                <p className="text-xs text-green-700"><strong>{isMarathi ? 'निष्कर्ष:' : 'Finding:'}</strong> {aiAnalysis.finding}</p>
                <p className="text-xs text-green-700"><strong>{isMarathi ? 'तीव्रता:' : 'Severity:'}</strong> {aiAnalysis.severity}</p>
                <p className="text-xs text-green-700"><strong>{isMarathi ? 'अंदाजित लक्षणे:' : 'Predicted Symptoms:'}</strong> {isMarathi ? aiAnalysis.predicted_symptoms_mr : aiAnalysis.predicted_symptoms_en}</p>
                <p className="text-xs text-green-700"><strong>{isMarathi ? 'शिफारस:' : 'Recommendation:'}</strong> {aiAnalysis.recommendation}</p>

                {aiAnalysis.home_therapy?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-green-300">
                    <p className="text-xs font-semibold text-green-800 mb-1">🏠 {isMarathi ? 'घरगुती उपाय:' : 'Home Remedies:'}</p>
                    <ul className="space-y-1">
                      {(isMarathi ? aiAnalysis.home_therapy_mr : aiAnalysis.home_therapy).map((remedy, i) => (
                        <li key={i} className="text-xs text-green-700 flex gap-1"><span>{i + 1}.</span><span>{remedy}</span></li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestedDoctors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-300">
                    <p className="text-xs font-semibold text-green-800 mb-2">{isMarathi ? 'सुचवलेले डॉक्टर:' : 'Suggested Doctors:'}</p>
                    <div className="space-y-2">
                      {suggestedDoctors.map(doc => (
                        <div key={doc._id} className="flex items-center justify-between bg-white rounded p-2">
                          <div>
                            <p className="text-xs font-medium text-gray-800">{doc.name}</p>
                            <p className="text-xs text-gray-600">{doc.specialty} • ₹{doc.fee} • {doc.available !== false ? '🟢' : '🔴'}</p>
                          </div>
                          <Button size="sm" variant="primary" disabled={doc.available === false} onClick={() => navigate(`/patient/book-appointment/${doc._id}`)}>{isMarathi ? 'बुक करा' : 'Book'}</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => { setShowUpload(false); setUploadError(''); setUploadForm({ type: 'X-Ray', file: null, symptoms: '' }); setAiAnalysis(null); setSuggestedDoctors([]); }}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={uploading || analyzing}>
                {uploading ? <><AiOutlineLoading3Quarters className="inline animate-spin mr-1" />Uploading...</> : <><FiUpload className="inline mr-1" />Analyze & Upload</>}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <Card><p className="text-center text-gray-500 py-8">Loading...</p></Card>
      ) : tab === 'records' ? (
        <div className="space-y-4">
          {records.map(record => (
            <Card key={record._id || record.id}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{record.type}</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${ record.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{record.status}</span>
                    {record.fileSize && <span className="text-xs text-gray-500 flex items-center gap-1"><FaFileAlt className="text-gray-400" />{record.fileSize}</span>}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{record.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                    <FaCalendarAlt className="text-gray-400" />{formatDate(record.createdAt || record.date)}
                    {(record.doctorId?.name || record.doctor) && (
                      <span className="flex items-center gap-1"><FaUserMd className="text-gray-400" />{record.doctorId?.name || record.doctor}</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button size="sm" variant="primary" className="flex-1 sm:flex-none" onClick={() => handleView(record)}><FiEye className="inline mr-1" />View</Button>
                  <Button size="sm" variant="secondary" className="flex-1 sm:flex-none" onClick={() => handleDownload(record)}><FiDownload className="inline mr-1" />Download</Button>
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => handleShare(record)}><FiShare2 className="inline mr-1" />Share</Button>
                </div>
              </div>
            </Card>
          ))}
          {records.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4 flex justify-center"><FaFileMedical className="text-gray-300" /></div>
                <p className="text-gray-500 mb-4">No medical records found</p>
                <Button variant="primary" onClick={() => setShowUpload(true)}>+ Upload Your First Record</Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        // Prescriptions Tab
        <div className="space-y-4">
          {prescriptions.map(p => (
            <Card key={p._id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center gap-1"><FaPills />Prescription</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{p.status || 'Active'}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{p.title}</h3>
                  {p.findings && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-line">{p.findings}</div>
                  )}
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-3 flex-wrap">
                    {p.doctorId?.name && <span className="flex items-center gap-1"><FaUserMd className="text-gray-400" />Dr. {p.doctorId.name} ({p.doctorId.specialty})</span>}
                    <span className="flex items-center gap-1"><FaCalendarAlt className="text-gray-400" />{formatDate(p.createdAt)}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
          {prescriptions.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <FaPills className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No prescriptions yet</p>
                <p className="text-gray-400 text-sm mt-1">Prescriptions written by your doctor will appear here</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsPage;



