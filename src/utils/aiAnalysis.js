// AI Analysis for medical scans
export const analyzeScanWithSymptoms = (scanType, symptoms) => {
  // Mock AI analysis based on scan type and symptoms
  const analyses = {
    'X-Ray': {
      'Chest pain, Difficulty breathing': {
        finding: 'Possible lung infection or pneumonia detected',
        severity: 'Medium',
        recommendation: 'Consult pulmonologist immediately. Start prescribed antibiotics.',
        precautions: ['Rest', 'Avoid cold', 'Stay hydrated', 'Monitor temperature'],
      },
      'Chest pain, Fever': {
        finding: 'Signs of respiratory infection',
        severity: 'Medium',
        recommendation: 'Immediate medical consultation required.',
        precautions: ['Complete bed rest', 'Take prescribed medicines', 'Isolate if needed'],
      },
    },
    'CT Scan': {
      'Headache, Dizziness': {
        finding: 'No major abnormalities detected. Possible stress-related symptoms.',
        severity: 'Low',
        recommendation: 'Consult neurologist for detailed examination. Manage stress levels.',
        precautions: ['Adequate sleep', 'Reduce screen time', 'Stay hydrated', 'Avoid stress'],
      },
      'Chest pain, Breathing difficulty': {
        finding: 'Possible cardiac or pulmonary issue detected',
        severity: 'High',
        recommendation: 'URGENT: Consult cardiologist immediately. Do not delay.',
        precautions: ['Avoid physical exertion', 'Take rest', 'Emergency contact ready'],
      },
    },
    'MRI Scan': {
      'Back pain, Numbness': {
        finding: 'Possible nerve compression or disc issue',
        severity: 'Medium',
        recommendation: 'Consult orthopedic specialist. Physiotherapy may be required.',
        precautions: ['Avoid heavy lifting', 'Maintain posture', 'Gentle exercises'],
      },
    },
  };

  // Get analysis or return generic
  const scanAnalyses = analyses[scanType] || {};
  const symptomsKey = Object.keys(scanAnalyses).find(key => 
    symptoms.toLowerCase().includes(key.toLowerCase().split(',')[0])
  );

  if (symptomsKey) {
    return scanAnalyses[symptomsKey];
  }

  // Generic analysis
  return {
    finding: `${scanType} uploaded successfully. Preliminary analysis shows symptoms require medical attention.`,
    severity: 'Medium',
    recommendation: 'Please consult with a qualified doctor for detailed analysis and treatment plan.',
    precautions: ['Monitor symptoms', 'Keep scan report handy', 'Book appointment soon'],
  };
};

export const getSeverityColor = (severity) => {
  const colors = {
    'Low': 'bg-green-100 text-green-800 border-green-300',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'High': 'bg-red-100 text-red-800 border-red-300',
    'Critical': 'bg-red-200 text-red-900 border-red-400',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-300';
};
