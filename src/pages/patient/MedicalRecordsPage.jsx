import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
import { patientService } from '../../services/api/patientService';
import { FaCalendarAlt, FaUserMd, FaFileAlt, FaFileMedical, FaPills } from 'react-icons/fa';
import { FiUpload, FiEye, FiDownload, FiShare2 } from 'react-icons/fi';
import { MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const SCAN_TYPES = ['X-Ray', 'CT Scan', 'MRI Scan', 'Lab Report', 'Prescription'];

const MedicalRecordsPage = () => {
  const [tab, setTab] = useState('records');
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadForm, setUploadForm] = useState({ type: 'X-Ray', file: null, symptoms: '' });

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
    try {
      await patientService.uploadScan(uploadForm.file, uploadForm.type, uploadForm.symptoms);
      setUploadSuccess('File uploaded successfully!');
      setShowUpload(false);
      setUploadForm({ type: 'X-Ray', file: null, symptoms: '' });
      fetchRecords();
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
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
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => { setShowUpload(false); setUploadError(''); setUploadForm({ type: 'X-Ray', file: null, symptoms: '' }); }}>Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={uploading}>
                {uploading ? <><AiOutlineLoading3Quarters className="inline animate-spin mr-1" />Uploading...</> : <><FiUpload className="inline mr-1" />Upload Record</>}
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
