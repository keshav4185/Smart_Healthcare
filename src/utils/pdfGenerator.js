// PDF Generation utility for medical reports
export const generateMedicalReportPDF = (reportData) => {
  const { patientName, age, gender, symptoms, scanType, date, findings } = reportData;

  // Create PDF content as HTML
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Medical Report - ${patientName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #0ea5e9; }
    .section { margin: 20px 0; }
    .section-title { font-size: 18px; font-weight: bold; color: #0ea5e9; margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
    .info-row { display: flex; margin: 8px 0; }
    .label { font-weight: bold; width: 150px; }
    .value { flex: 1; }
    .symptoms-list { list-style: none; padding: 0; }
    .symptoms-list li { padding: 8px; background: #f1f5f9; margin: 5px 0; border-radius: 5px; }
    .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(0,0,0,0.05); z-index: -1; }
  </style>
</head>
<body>
  <div class="watermark">HEALTHCARE+</div>
  
  <div class="header">
    <div class="logo">🏥 HealthCare+ Medical Report</div>
    <p style="margin: 5px 0; color: #64748b;">Smart Healthcare Diagnosis System</p>
  </div>

  <div class="section">
    <div class="section-title">Patient Information</div>
    <div class="info-row">
      <div class="label">Patient Name:</div>
      <div class="value">${patientName}</div>
    </div>
    <div class="info-row">
      <div class="label">Age:</div>
      <div class="value">${age} years</div>
    </div>
    <div class="info-row">
      <div class="label">Gender:</div>
      <div class="value">${gender}</div>
    </div>
    <div class="info-row">
      <div class="label">Report Date:</div>
      <div class="value">${new Date(date).toLocaleDateString('en-IN')}</div>
    </div>
    <div class="info-row">
      <div class="label">Scan Type:</div>
      <div class="value">${scanType}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Reported Symptoms</div>
    <ul class="symptoms-list">
      ${symptoms.map(symptom => `<li>• ${symptom}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Preliminary Findings</div>
    <div style="padding: 15px; background: #f8fafc; border-left: 4px solid #0ea5e9; border-radius: 5px;">
      ${findings || 'Awaiting doctor\'s review and analysis.'}
    </div>
  </div>

  <div class="section">
    <div class="section-title">⚠️ Important Notice</div>
    <div style="padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
      <p style="margin: 0;"><strong>Disclaimer:</strong> This is a preliminary report based on uploaded medical scans and reported symptoms. This report should be reviewed by a qualified medical professional for accurate diagnosis and treatment recommendations.</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Recommendations</div>
    <ul style="line-height: 1.8;">
      <li>Consult with a qualified doctor for detailed analysis</li>
      <li>Share this report during your appointment</li>
      <li>Follow prescribed treatment plan</li>
      <li>Schedule follow-up as recommended</li>
    </ul>
  </div>

  <div class="footer">
    <p><strong>HealthCare+ Smart Healthcare System</strong></p>
    <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
    <p>Report ID: #RPT${Date.now()}</p>
    <p style="margin-top: 10px; font-size: 10px;">This is a computer-generated report. For medical emergencies, please call 108 or visit nearest hospital.</p>
  </div>
</body>
</html>
  `;

  // Create blob and download
  const blob = new Blob([pdfContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Medical_Report_${patientName.replace(/\s+/g, '_')}_${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return `Medical_Report_${patientName.replace(/\s+/g, '_')}.html`;
};

// Generate symptoms summary
export const generateSymptomsSummary = (symptoms) => {
  return symptoms.map((s, i) => `${i + 1}. ${s}`).join('\n');
};
