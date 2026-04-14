/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    // Symptoms Page
    symptomChecker: 'AI Symptom Checker',
    describeSymptoms: 'Describe Your Symptoms',
    orSelectBelow: 'Or select from categories below',
    typeSymptoms: 'Type your symptoms',
    symptomsPlaceholder: 'e.g. Chest pain, Fever, Headache...',
    searchSymptoms: '🔍 Search symptoms...',
    selectedSymptoms: 'Selected Symptoms',
    clearAll: 'Clear all',
    duration: 'Duration',
    severity: 'Severity',
    mild: '😊 Mild',
    moderate: '😐 Moderate',
    severe: '😟 Severe',
    critical: '😰 Critical',
    getDiagnosis: 'Get AI Diagnosis',
    analyzing: '🔍 Analyzing...',
    selectSymptomFirst: 'Select or type at least 1 symptom',
    diagnosisResult: '🩺 AI Diagnosis',
    possibleCondition: 'POSSIBLE CONDITION',
    urgency: 'URGENCY',
    seeSpecialist: 'SEE SPECIALIST',
    recommendations: 'RECOMMENDATIONS',
    yourSymptoms: 'YOUR SYMPTOMS',
    disclaimer: 'This is AI-generated. Please consult a doctor for accurate diagnosis.',
    submitSymptoms: 'Select symptoms or type to get AI diagnosis',
    checkAgain: 'Check Again',
    durationToday: 'Today',
    duration2days: '2-3 days',
    duration1week: '1 week',
    duration2weeks: '2 weeks',
    duration1month: '1 month',
    durationMore: 'More than 1 month',
    selectDuration: 'Select duration',

    // Categories
    catHead: 'Head & Brain',
    catEyes: 'Eyes',
    catENT: 'Ear, Nose & Throat',
    catChest: 'Chest & Heart',
    catStomach: 'Stomach & Digestion',
    catSkin: 'Skin',
    catBones: 'Muscles & Bones',
    catGeneral: 'General',
    catMental: 'Mental Health',
    catUrinary: 'Urinary',

    // Symptoms
    headache: 'Headache', migraine: 'Migraine', dizziness: 'Dizziness',
    memoryLoss: 'Memory loss', confusion: 'Confusion', fainting: 'Fainting',
    blurredVision: 'Blurred vision', eyePain: 'Eye pain', redEyes: 'Red eyes',
    wateryEyes: 'Watery eyes', itchyEyes: 'Itchy eyes', doubleVision: 'Double vision',
    earPain: 'Ear pain', hearingLoss: 'Hearing loss', runnyNose: 'Runny nose',
    blockedNose: 'Blocked nose', soreThroat: 'Sore throat', sneezing: 'Sneezing',
    chestPain: 'Chest pain', palpitations: 'Palpitations', shortnessOfBreath: 'Shortness of breath',
    irregularHeartbeat: 'Irregular heartbeat', chestTightness: 'Chest tightness',
    stomachPain: 'Stomach pain', nausea: 'Nausea', vomiting: 'Vomiting',
    diarrhea: 'Diarrhea', constipation: 'Constipation', bloating: 'Bloating', acidity: 'Acidity',
    rash: 'Rash', itching: 'Itching', drySkin: 'Dry skin', swelling: 'Swelling',
    bruising: 'Bruising', skinDiscoloration: 'Skin discoloration',
    backPain: 'Back pain', jointPain: 'Joint pain', muscleWeakness: 'Muscle weakness',
    legPain: 'Leg pain', neckPain: 'Neck pain', kneePain: 'Knee pain',
    fever: 'Fever', fatigue: 'Fatigue', weightLoss: 'Weight loss',
    weightGain: 'Weight gain', nightSweats: 'Night sweats', lossOfAppetite: 'Loss of appetite', chills: 'Chills',
    anxiety: 'Anxiety', depression: 'Depression', insomnia: 'Insomnia',
    stress: 'Stress', moodSwings: 'Mood swings', panicAttacks: 'Panic attacks',
    frequentUrination: 'Frequent urination', burningUrination: 'Burning urination',
    bloodInUrine: 'Blood in urine', lowerAbdomenPain: 'Lower abdomen pain',

    // Common
    dashboard: 'Dashboard', findDoctors: 'Find Doctors', appointments: 'Appointments',
    medicalRecords: 'Medical Records', logout: 'Logout', bookAppointment: 'Book Appointment',
    viewProfile: 'View Profile', cancel: 'Cancel', confirm: 'Confirm',
    save: 'Save', upload: 'Upload', download: 'Download',
  },

  mr: {
    // Symptoms Page
    symptomChecker: 'AI लक्षण तपासणी',
    describeSymptoms: 'तुमची लक्षणे सांगा',
    orSelectBelow: 'किंवा खालून निवडा',
    typeSymptoms: 'लक्षणे टाइप करा',
    symptomsPlaceholder: 'उदा. छातीत दुखणे, ताप, डोकेदुखी...',
    searchSymptoms: '🔍 लक्षणे शोधा...',
    selectedSymptoms: 'निवडलेली लक्षणे',
    clearAll: 'सर्व काढा',
    duration: 'कालावधी',
    severity: 'तीव्रता',
    mild: '😊 सौम्य',
    moderate: '😐 मध्यम',
    severe: '😟 तीव्र',
    critical: '😰 गंभीर',
    getDiagnosis: 'AI निदान मिळवा',
    analyzing: '🔍 विश्लेषण करत आहे...',
    selectSymptomFirst: 'किमान १ लक्षण निवडा किंवा टाइप करा',
    diagnosisResult: '🩺 AI निदान',
    possibleCondition: 'संभाव्य आजार',
    urgency: 'तातडी',
    seeSpecialist: 'तज्ञ डॉक्टर',
    recommendations: 'सल्ला',
    yourSymptoms: 'तुमची लक्षणे',
    disclaimer: 'हे AI-निर्मित निदान आहे. अचूक निदानासाठी डॉक्टरांचा सल्ला घ्या.',
    submitSymptoms: 'AI निदानासाठी लक्षणे निवडा किंवा टाइप करा',
    checkAgain: 'पुन्हा तपासा',
    durationToday: 'आज',
    duration2days: '२-३ दिवस',
    duration1week: '१ आठवडा',
    duration2weeks: '२ आठवडे',
    duration1month: '१ महिना',
    durationMore: '१ महिन्यापेक्षा जास्त',
    selectDuration: 'कालावधी निवडा',

    // Categories
    catHead: 'डोके आणि मेंदू',
    catEyes: 'डोळे',
    catENT: 'कान, नाक आणि घसा',
    catChest: 'छाती आणि हृदय',
    catStomach: 'पोट आणि पचन',
    catSkin: 'त्वचा',
    catBones: 'स्नायू आणि हाडे',
    catGeneral: 'सामान्य',
    catMental: 'मानसिक आरोग्य',
    catUrinary: 'मूत्रमार्ग',

    // Symptoms
    headache: 'डोकेदुखी', migraine: 'मायग्रेन', dizziness: 'चक्कर येणे',
    memoryLoss: 'स्मरणशक्ती कमी', confusion: 'गोंधळ', fainting: 'बेशुद्ध होणे',
    blurredVision: 'धुसर दिसणे', eyePain: 'डोळ्यात दुखणे', redEyes: 'डोळे लाल होणे',
    wateryEyes: 'डोळ्यातून पाणी', itchyEyes: 'डोळे खाजणे', doubleVision: 'दुहेरी दिसणे',
    earPain: 'कानात दुखणे', hearingLoss: 'ऐकू न येणे', runnyNose: 'नाक वाहणे',
    blockedNose: 'नाक बंद होणे', soreThroat: 'घसा दुखणे', sneezing: 'शिंका येणे',
    chestPain: 'छातीत दुखणे', palpitations: 'धडधड होणे', shortnessOfBreath: 'श्वास घ्यायला त्रास',
    irregularHeartbeat: 'अनियमित हृदयठोके', chestTightness: 'छाती जड वाटणे',
    stomachPain: 'पोटदुखी', nausea: 'मळमळ', vomiting: 'उलटी',
    diarrhea: 'जुलाब', constipation: 'बद्धकोष्ठता', bloating: 'पोट फुगणे', acidity: 'आम्लपित्त',
    rash: 'पुरळ', itching: 'खाज सुटणे', drySkin: 'कोरडी त्वचा', swelling: 'सूज',
    bruising: 'जखम', skinDiscoloration: 'त्वचेचा रंग बदलणे',
    backPain: 'पाठदुखी', jointPain: 'सांधेदुखी', muscleWeakness: 'स्नायू कमजोर',
    legPain: 'पायदुखी', neckPain: 'मानदुखी', kneePain: 'गुडघेदुखी',
    fever: 'ताप', fatigue: 'थकवा', weightLoss: 'वजन कमी होणे',
    weightGain: 'वजन वाढणे', nightSweats: 'रात्री घाम येणे', lossOfAppetite: 'भूक न लागणे', chills: 'थंडी वाजणे',
    anxiety: 'चिंता', depression: 'नैराश्य', insomnia: 'झोप न येणे',
    stress: 'ताण', moodSwings: 'मूड बदलणे', panicAttacks: 'घाबरणे',
    frequentUrination: 'वारंवार लघवी', burningUrination: 'लघवीत जळजळ',
    bloodInUrine: 'लघवीत रक्त', lowerAbdomenPain: 'खालच्या पोटात दुखणे',

    // Common
    dashboard: 'डॅशबोर्ड', findDoctors: 'डॉक्टर शोधा', appointments: 'भेटी',
    medicalRecords: 'वैद्यकीय नोंदी', logout: 'बाहेर पडा', bookAppointment: 'भेट बुक करा',
    viewProfile: 'प्रोफाइल पहा', cancel: 'रद्द करा', confirm: 'पुष्टी करा',
    save: 'जतन करा', upload: 'अपलोड करा', download: 'डाउनलोड करा',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'mr' : 'en');

  const t = (key) => translations[language][key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isMarathi: language === 'mr' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
