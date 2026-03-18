import { useState } from 'react';
import { Phone, X, AlertTriangle, Ambulance, MapPin } from 'lucide-react';
import Button from './Button';

const EmergencySOS = () => {
  const [showModal, setShowModal] = useState(false);
  const [calling, setCalling] = useState(false);

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: Ambulance, color: 'bg-red-500' },
    { name: 'Emergency', number: '112', icon: AlertTriangle, color: 'bg-orange-500' },
    { name: 'Hospital', number: '+91 22 2754 2754', icon: Phone, color: 'bg-blue-500' },
  ];

  const handleEmergencyCall = (number) => {
    setCalling(true);
    setTimeout(() => {
      window.location.href = `tel:${number}`;
      setCalling(false);
      setShowModal(false);
    }, 500);
  };

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-2xl animate-pulse hover:animate-none transition-all duration-300 hover:scale-110"
        aria-label="Emergency SOS"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency SOS</h2>
              <p className="text-gray-600">Select emergency service to call</p>
            </div>

            <div className="space-y-3 mb-6">
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.number}
                  onClick={() => handleEmergencyCall(contact.number)}
                  disabled={calling}
                  className={`w-full ${contact.color} hover:opacity-90 text-white rounded-lg p-4 flex items-center justify-between transition-all duration-200 hover:scale-105 disabled:opacity-50`}
                >
                  <div className="flex items-center gap-3">
                    <contact.icon className="w-6 h-6" />
                    <div className="text-left">
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm opacity-90">{contact.number}</p>
                    </div>
                  </div>
                  <Phone className="w-5 h-5" />
                </button>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex gap-2">
                <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Your Location</p>
                  <p>Location will be shared with emergency services</p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencySOS;
