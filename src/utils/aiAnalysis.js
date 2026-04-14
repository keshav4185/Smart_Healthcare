export const getSeverityColor = (severity) => {
  const colors = {
    'low': 'bg-green-100 text-green-800 border-green-300',
    'normal': 'bg-green-100 text-green-800 border-green-300',
    'mild': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'moderate': 'bg-orange-100 text-orange-800 border-orange-300',
    'high': 'bg-red-100 text-red-800 border-red-300',
    'severe': 'bg-red-100 text-red-800 border-red-300',
    'critical': 'bg-red-200 text-red-900 border-red-400',
    'unknown': 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
};
