import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';

const MedicalRecordsPage = () => {
  const [records] = useState([
    {
      id: 1,
      type: 'Lab Report',
      title: 'Blood Test Results',
      date: '2024-02-15',
      doctor: 'Dr. Sarah Smith',
      status: 'Completed',
      fileSize: '2.5 MB',
    },
    {
      id: 2,
      type: 'Prescription',
      title: 'Medication for Fever',
      date: '2024-02-10',
      doctor: 'Dr. John Doe',
      status: 'Active',
      fileSize: '1.2 MB',
    },
    {
      id: 3,
      type: 'X-Ray',
      title: 'Chest X-Ray',
      date: '2024-01-28',
      doctor: 'Dr. Michael Brown',
      status: 'Completed',
      fileSize: '3.8 MB',
    },
  ]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Medical Records</h1>
      </div>

      <div className="space-y-4">
        {records.map(record => (
          <Card key={record.id}>
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
                  <span className="text-xs text-gray-500">
                    📄 {record.fileSize}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{record.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  📅 {formatDate(record.date)} • 👨⚕️ {record.doctor}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button size="sm" variant="primary" className="flex-1 sm:flex-none">
                  👁️ View
                </Button>
                <Button size="sm" variant="secondary" className="flex-1 sm:flex-none">
                  ⬇️ Download
                </Button>
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
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
              <p className="text-sm text-gray-600">Upload scans from Dashboard for instant AI analysis</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
