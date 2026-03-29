import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { adminService } from '../../services/api/adminService';

const statusBadge = {
  verified: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
};

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({ totalDoctors: 0, pending: 0, verified: 0, rejected: 0 });
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getDashboard(), adminService.getDoctors()])
      .then(([dashData, doctorList]) => {
        setDoctors(doctorList || []);
        setStats({
          totalDoctors: dashData.totalDoctors || doctorList.length,
          pending: dashData.pendingDoctors || doctorList.filter(d => d.status === 'pending').length,
          verified: doctorList.filter(d => d.status === 'verified').length,
          rejected: doctorList.filter(d => d.status === 'rejected').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? doctors : doctors.filter(d => d.status === filter);

  const updateStatus = async (id, status) => {
    await adminService.updateDoctorStatus(id, status);
    setDoctors(prev => prev.map(d => (d._id || d.id) === id ? { ...d, status } : d));
    setStats(prev => ({
      ...prev,
      pending: status === 'verified' || status === 'rejected' ? prev.pending - 1 : prev.pending,
      verified: status === 'verified' ? prev.verified + 1 : prev.verified,
      rejected: status === 'rejected' ? prev.rejected + 1 : prev.rejected,
    }));
    setSelected(null);
  };

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Doctors', count: stats.totalDoctors, color: 'text-blue-600' },
          { label: 'Pending', count: stats.pending, color: 'text-yellow-600' },
          { label: 'Verified', count: stats.verified, color: 'text-green-600' },
          { label: 'Rejected', count: stats.rejected, color: 'text-red-600' },
        ].map(s => (
          <Card key={s.label}>
            <div className="text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-gray-600 text-sm mt-1">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'pending', 'verified', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f} ({f === 'all' ? doctors.length : doctors.filter(d => d.status === f).length})
          </button>
        ))}
      </div>

      <Card title="🩺 Doctor Verification">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading doctors...</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(doctor => {
              const id = doctor._id || doctor.id;
              return (
                <div key={id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[doctor.status]}`}>
                          {doctor.status === 'verified' ? '✅ Verified' : doctor.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{doctor.specialty} • {doctor.experience}</p>
                      <p className="text-sm text-gray-500">{doctor.hospital}</p>
                      <p className="text-xs text-gray-400 mt-1">License: {doctor.licenseNumber} • {doctor.education}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelected({ ...doctor, id })}>Review</Button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No doctors found</p>}
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Doctor Review</h2>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><span className="font-medium">Name:</span> {selected.name}</p>
                <p><span className="font-medium">Specialty:</span> {selected.specialty}</p>
                <p><span className="font-medium">Experience:</span> {selected.experience}</p>
                <p><span className="font-medium">Hospital:</span> {selected.hospital}</p>
                <p><span className="font-medium">Education:</span> {selected.education}</p>
                <p><span className="font-medium">License No:</span> {selected.licenseNumber}</p>
                <p><span className="font-medium">Email:</span> {selected.email}</p>
              </div>
              {selected.certificate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">📄 Certificate: <span className="font-medium">{selected.certificate}</span></p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Current Status:</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge[selected.status]}`}>{selected.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">Cancel</Button>
              {selected.status !== 'rejected' && (
                <Button variant="danger" onClick={() => updateStatus(selected.id, 'rejected')} className="flex-1">❌ Reject</Button>
              )}
              {selected.status !== 'verified' && (
                <Button variant="success" onClick={() => updateStatus(selected.id, 'verified')} className="flex-1">✅ Verify</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
