import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';
import { patientService } from '../../services/api/patientService';

const SCAN_TYPES = ['X-Ray', 'CT Scan', 'MRI Scan', 'Lab Report', 'Prescription'];

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadForm, setUploadForm] = useState({ type: 'X-Ray', file: null, symptoms: '' });

  const fetchRecords = () => {
    setLoading(true);
    patientService.getMedicalRecords()
      .then(data => setRecords(data || []))
      .catch(() => setRecords([]))
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
      fetchRecords(); // refresh list
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleView = (record) => {
    if (record.fileUrl) window.open(record.fileUrl, '_blank');
  };

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
    if (navigator.share) {
      navigator.share({ title: record.title, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Medical Records</h1>
        <Button variant="primary" onClick={() => { setShowUpload(true); setUploadError(''); }}>
          + Upload New Record
        </Button>
      </div>

      {/* Success message */}
      {uploadSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          ✅ {uploadSuccess}
        </div>
      )}

      {/* Upload Form */}
      {showUpload && (
        <Card title="📤 Upload Medical Record" className="mb-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                  className="input-field"
                  required
                >
                  {SCAN_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File (JPG, PNG, PDF) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                  className="input-field text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms / Notes (Optional)
              </label>
              <textarea
                value={uploadForm.symptoms}
                onChange={(e) => setUploadForm({ ...uploadForm, symptoms: e.target.value })}
                className="input-field min-h-16 text-sm"
                placeholder="e.g., Chest pain, Fever..."
              />
            </div>
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setShowUpload(false); setUploadError(''); setUploadForm({ type: 'X-Ray', file: null, symptoms: '' }); }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={uploading}>
                {uploading ? '⏳ Uploading...' : '📤 Upload Record'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Records List */}
      {loading ? (
        <Card><p className="text-center text-gray-500 py-8">Loading records...</p></Card>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <Card key={record._id || record.id}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {record.type}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      record.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                    {record.fileSize && (
                      <span className="text-xs text-gray-500">📄 {record.fileSize}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{record.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 {formatDate(record.createdAt || record.date)}
                    {(record.doctorId?.name || record.doctor) && ` • 👨⚕️ ${record.doctorId?.name || record.doctor}`}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button size="sm" variant="primary" className="flex-1 sm:flex-none" onClick={() => handleView(record)}>
                    👁️ View
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1 sm:flex-none" onClick={() => handleDownload(record)}>
                    ⬇️ Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => handleShare(record)}>
                    📤 Share
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {records.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500 mb-4">No medical records found</p>
                <Button variant="primary" onClick={() => setShowUpload(true)}>
                  + Upload Your First Record
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
