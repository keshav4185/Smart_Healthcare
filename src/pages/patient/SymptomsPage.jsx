import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiBrain, GiStomach, GiBrokenBone } from 'react-icons/gi';
import { FaEye, FaHeartbeat, FaTint, FaThermometerHalf, FaUserMd, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { FaEarListen } from 'react-icons/fa6';
import { MdSick, MdCircle } from 'react-icons/md';
import { RiMentalHealthLine } from 'react-icons/ri';
import { FiPlus, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import useSpeech from '../../hooks/useSpeech';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import { useLanguage } from '../../context/LanguageContext';
import axiosInstance from '../../services/api/axiosInstance';

const getCategories = () => [
  { key: 'catHead', icon: <GiBrain className="inline text-purple-500" />, symptoms: ['headache','migraine','dizziness','memoryLoss','confusion','fainting'] },
  { key: 'catEyes', icon: <FaEye className="inline text-blue-400" />, symptoms: ['blurredVision','eyePain','redEyes','wateryEyes','itchyEyes','doubleVision'] },
  { key: 'catENT', icon: <FaEarListen className="inline text-yellow-500" />, symptoms: ['earPain','hearingLoss','runnyNose','blockedNose','soreThroat','sneezing'] },
  { key: 'catChest', icon: <FaHeartbeat className="inline text-red-500" />, symptoms: ['chestPain','palpitations','shortnessOfBreath','irregularHeartbeat','chestTightness'] },
  { key: 'catStomach', icon: <GiStomach className="inline text-orange-400" />, symptoms: ['stomachPain','nausea','vomiting','diarrhea','constipation','bloating','acidity'] },
  { key: 'catSkin', icon: <MdSick className="inline text-pink-400" />, symptoms: ['rash','itching','drySkin','swelling','bruising','skinDiscoloration'] },
  { key: 'catBones', icon: <GiBrokenBone className="inline text-gray-500" />, symptoms: ['backPain','jointPain','muscleWeakness','legPain','neckPain','kneePain'] },
  { key: 'catGeneral', icon: <FaThermometerHalf className="inline text-red-400" />, symptoms: ['fever','fatigue','weightLoss','weightGain','nightSweats','lossOfAppetite','chills'] },
  { key: 'catMental', icon: <RiMentalHealthLine className="inline text-teal-500" />, symptoms: ['anxiety','depression','insomnia','stress','moodSwings','panicAttacks'] },
  { key: 'catUrinary', icon: <FaTint className="inline text-blue-500" />, symptoms: ['frequentUrination','burningUrination','bloodInUrine','lowerAbdomenPain'] },
];

const diagnoseSymptoms = (selected, severity) => {
  const s = selected.map(x => x.toLowerCase());
  const has = (...words) => words.some(w => s.some(sym => sym.includes(w.toLowerCase())));

  if (has('chest pain', 'छातीत दुखणे', 'palpitations', 'धडधड', 'irregular heartbeat', 'chest tightness'))
    return { condition: 'Possible Cardiac Issue / Angina', conditionMr: 'हृदयविकाराची शक्यता', specialist: 'Cardiologist', specialistMr: 'हृदयरोगतज्ञ', urgency: severity === 'critical' || severity === 'high' ? 'ER Visit ER immediately' : 'Consult doctor within 24 hours', urgencyMr: severity === 'critical' || severity === 'high' ? 'तातडीने रुग्णालयात जा' : '२४ तासात डॉक्टरांना भेटा', urgencyLevel: severity === 'critical' || severity === 'high' ? 'red' : 'yellow', recommendations: 'Avoid physical exertion. Take rest. Monitor blood pressure. Consult a Cardiologist immediately.', recommendationsMr: 'शारीरिक श्रम टाळा. विश्रांती घ्या. रक्तदाब तपासा. हृदयरोगतज्ञांना भेटा.', color: 'bg-red-50 border-red-200' };

  if (has('shortness of breath', 'श्वास घ्यायला त्रास', 'chest tightness'))
    return { condition: 'Respiratory Issue / Asthma', conditionMr: 'श्वसन समस्या / दमा', specialist: 'Pulmonologist', specialistMr: 'फुफ्फुसतज्ञ', urgency: 'Seek immediate care', urgencyMr: 'तातडीने उपचार घ्या', urgencyLevel: 'red', recommendations: 'Use inhaler if prescribed. Avoid dust/smoke. Stay in ventilated area.', recommendationsMr: 'इनहेलर वापरा. धूळ/धूर टाळा. हवेशीर जागी राहा.', color: 'bg-red-50 border-red-200' };

  if (has('headache', 'डोकेदुखी', 'migraine', 'मायग्रेन', 'dizziness', 'चक्कर', 'fainting', 'बेशुद्ध'))
    return { condition: 'Neurological Issue / Migraine', conditionMr: 'मज्जातंतू समस्या / मायग्रेन', specialist: 'Neurologist', specialistMr: 'मज्जातंत्रतज्ञ', urgency: 'Consult within 48 hours', urgencyMr: '४८ तासात डॉक्टरांना भेटा', urgencyLevel: 'yellow', recommendations: 'Rest in dark quiet room. Stay hydrated. Avoid screen time.', recommendationsMr: 'अंधाऱ्या शांत खोलीत विश्रांती घ्या. पाणी प्या. स्क्रीन टाळा.', color: 'bg-yellow-50 border-yellow-200' };

  if (has('fever', 'ताप', 'chills', 'थंडी', 'fatigue', 'थकवा'))
    return { condition: 'Viral Infection / Flu', conditionMr: 'विषाणू संसर्ग / फ्लू', specialist: 'General Physician', specialistMr: 'सामान्य डॉक्टर', urgency: 'Consult within 2-3 days', urgencyMr: '२-३ दिवसात डॉक्टरांना भेटा', urgencyLevel: 'green', recommendations: 'Stay hydrated. Take rest. Use paracetamol for fever. Avoid cold food.', recommendationsMr: 'पाणी प्या. विश्रांती घ्या. तापासाठी पॅरासिटामॉल घ्या. थंड अन्न टाळा.', color: 'bg-green-50 border-green-200' };

  if (has('stomach pain', 'पोटदुखी', 'nausea', 'मळमळ', 'vomiting', 'उलटी', 'diarrhea', 'जुलाब', 'acidity', 'आम्लपित्त'))
    return { condition: 'Gastritis / Digestive Issue', conditionMr: 'जठराची सूज / पचन समस्या', specialist: 'Gastroenterologist', specialistMr: 'पचनतज्ञ', urgency: 'Consult within 2-3 days', urgencyMr: '२-३ दिवसात डॉक्टरांना भेटा', urgencyLevel: 'green', recommendations: 'Drink ORS. Eat light food. Avoid spicy food. Rest well.', recommendationsMr: 'ORS प्या. हलके जेवण खा. तिखट टाळा. विश्रांती घ्या.', color: 'bg-green-50 border-green-200' };

  if (has('back pain', 'पाठदुखी', 'joint pain', 'सांधेदुखी', 'knee pain', 'गुडघेदुखी', 'neck pain', 'मानदुखी'))
    return { condition: 'Musculoskeletal Pain', conditionMr: 'स्नायू / हाडांचे दुखणे', specialist: 'Orthopedic', specialistMr: 'हाडांचे तज्ञ', urgency: 'Consult within a week', urgencyMr: 'एका आठवड्यात डॉक्टरांना भेटा', urgencyLevel: 'green', recommendations: 'Apply hot/cold compress. Avoid heavy lifting. Light stretching.', recommendationsMr: 'गरम/थंड शेक द्या. जड उचलणे टाळा. हलके व्यायाम करा.', color: 'bg-green-50 border-green-200' };

  if (has('rash', 'पुरळ', 'itching', 'खाज', 'dry skin', 'कोरडी त्वचा'))
    return { condition: 'Skin Allergy / Dermatitis', conditionMr: 'त्वचा ऍलर्जी', specialist: 'Dermatologist', specialistMr: 'त्वचारोगतज्ञ', urgency: 'Consult within a week', urgencyMr: 'एका आठवड्यात डॉक्टरांना भेटा', urgencyLevel: 'green', recommendations: 'Avoid allergens. Use mild soap. Apply calamine lotion.', recommendationsMr: 'ऍलर्जी कारणे टाळा. सौम्य साबण वापरा. कॅलामाइन लोशन लावा.', color: 'bg-green-50 border-green-200' };

  if (has('anxiety', 'चिंता', 'depression', 'नैराश्य', 'insomnia', 'झोप न येणे', 'panic', 'घाबरणे'))
    return { condition: 'Mental Health Issue', conditionMr: 'मानसिक आरोग्य समस्या', specialist: 'Psychiatrist', specialistMr: 'मनोचिकित्सक', urgency: 'Consult within a week', urgencyMr: 'एका आठवड्यात डॉक्टरांना भेटा', urgencyLevel: 'yellow', recommendations: 'Practice meditation. Talk to someone. Avoid stress. Seek professional help.', recommendationsMr: 'ध्यान करा. कोणाशी बोला. ताण टाळा. तज्ञांची मदत घ्या.', color: 'bg-yellow-50 border-yellow-200' };

  if (has('frequent urination', 'वारंवार लघवी', 'burning urination', 'लघवीत जळजळ'))
    return { condition: 'Urinary Tract Infection (UTI)', conditionMr: 'मूत्रमार्ग संसर्ग (UTI)', specialist: 'Urologist', specialistMr: 'मूत्रतज्ञ', urgency: 'Consult within 48 hours', urgencyMr: '४८ तासात डॉक्टरांना भेटा', urgencyLevel: 'yellow', recommendations: 'Drink plenty of water. Avoid holding urine. Consult Urologist.', recommendationsMr: 'भरपूर पाणी प्या. लघवी रोखू नका. मूत्रतज्ञांना भेटा.', color: 'bg-yellow-50 border-yellow-200' };

  if (has('sore throat', 'घसा दुखणे', 'runny nose', 'नाक वाहणे', 'ear pain', 'कानात दुखणे'))
    return { condition: 'ENT Infection / Common Cold', conditionMr: 'ENT संसर्ग / सर्दी', specialist: 'ENT Specialist', specialistMr: 'ENT तज्ञ', urgency: 'Consult within 2-3 days', urgencyMr: '२-३ दिवसात डॉक्टरांना भेटा', urgencyLevel: 'green', recommendations: 'Gargle with warm salt water. Steam inhalation. Stay warm.', recommendationsMr: 'कोमट मिठाच्या पाण्याने गुळण्या करा. वाफ घ्या. उबदार राहा.', color: 'bg-green-50 border-green-200' };

  return { condition: 'General Health Issue', conditionMr: 'सामान्य आरोग्य समस्या', specialist: 'General Physician', specialistMr: 'सामान्य डॉक्टर', urgency: 'Consult within a week', urgencyMr: 'एका आठवड्यात डॉक्टरांना भेटा', urgencyLevel: 'green', recommendations: 'Take rest. Stay hydrated. Eat nutritious food. Consult a General Physician.', recommendationsMr: 'विश्रांती घ्या. पाणी प्या. पौष्टिक अन्न खा. डॉक्टरांना भेटा.', color: 'bg-green-50 border-green-200' };
};

const SymptomsPage = () => {
  const { t, isMarathi } = useLanguage();
  const navigate = useNavigate();
  const { speak, stop, speaking, supported } = useSpeech();

  const buildSpeechText = (d) => isMarathi
    ? `संभाव्य आजार: ${d.conditionMr || d.condition}. तज्ञ: ${d.specialistMr || d.specialist}. तातडी: ${d.urgencyMr || d.urgency}. सल्ला: ${Array.isArray(d.recommendationsMr) ? d.recommendationsMr.join('. ') : d.recommendationsMr || ''}`
    : `Possible condition: ${d.condition}. See a ${d.specialist}. Urgency: ${d.urgency}. Recommendations: ${Array.isArray(d.recommendations) ? d.recommendations.join('. ') : d.recommendations || ''}`;
  const [selected, setSelected] = useState([]);
  const [typedSymptom, setTypedSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestedDoctors, setSuggestedDoctors] = useState([]);

  const categories = getCategories();

  const toggleSymptom = (key) => {
    const label = t(key);
    setSelected(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]);
  };

  const addTyped = () => {
    const trimmed = typedSymptom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed]);
      setTypedSymptom('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTyped(); }
  };

  const allSymptoms = selected.length > 0 ? selected : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (allSymptoms.length === 0) return;
    setLoading(true);
    setSuggestedDoctors([]);
    try {
      const { data } = await axiosInstance.post('/ai/diagnose', { symptoms: allSymptoms, severity, duration });
      const ai = data.data;
      const diagnosisResult = {
        condition: ai.condition,
        conditionMr: ai.condition,
        specialist: ai.specialist,
        specialistMr: ai.specialist,
        urgency: ai.urgency === 'emergency' ? 'Visit ER immediately' : ai.urgency === 'high' ? 'Consult within 24 hours' : ai.urgency === 'medium' ? 'Consult within 48 hours' : 'Consult within a week',
        urgencyMr: ai.urgency === 'emergency' ? 'तातडीने रुग्णालयात जा' : ai.urgency === 'high' ? '२४ तासात डॉक्टरांना भेटा' : ai.urgency === 'medium' ? '४८ तासात डॉक्टरांना भेटा' : 'एका आठवड्यात डॉक्टरांना भेटा',
        urgencyLevel: ai.urgency === 'emergency' || ai.urgency === 'high' ? 'red' : ai.urgency === 'medium' ? 'yellow' : 'green',
        recommendations: Array.isArray(ai.recommendations) ? ai.recommendations : [ai.recommendations],
        recommendationsMr: Array.isArray(ai.recommendations) ? ai.recommendations : [ai.recommendations],
        home_therapy: Array.isArray(ai.home_therapy) ? ai.home_therapy : [],
        home_therapy_mr: Array.isArray(ai.home_therapy_mr) ? ai.home_therapy_mr : [],
        color: ai.urgency === 'emergency' || ai.urgency === 'high' ? 'bg-red-50 border-red-200' : ai.urgency === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200',
      };
      setDiagnosis(diagnosisResult);
      // Fetch matching doctors based on specialist
      fetchSuggestedDoctors(ai.specialist || '');
    } catch {
      const result = diagnoseSymptoms(allSymptoms, severity);
      setDiagnosis(result);
      fetchSuggestedDoctors(result.specialist || '');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedDoctors = async (specialist) => {
    if (!specialist) return;
    try {
      const res = await axiosInstance.get('/patient/doctors');
      const allDoctors = res.data.data || [];
      const keyword = specialist.toLowerCase();
      const matched = allDoctors.filter(d => {
        if (!d.specialty) return false;
        const specialty = d.specialty.toLowerCase();
        return specialty.split(' ').some(word => word.length > 3 && keyword.includes(word))
          || keyword.split(' ').some(word => word.length > 3 && specialty.includes(word));
      });
      setSuggestedDoctors(matched.slice(0, 3));
    } catch {
      setSuggestedDoctors([]);
    }
  };

  const handleReset = () => {
    setSelected([]); setTypedSymptom(''); setDuration('');
    setSeverity('moderate'); setDiagnosis(null); setSearch(''); setSuggestedDoctors([]);
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    symptoms: cat.symptoms.filter(key =>
      search === '' || t(key).toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.symptoms.length > 0);

  return (
    <div>
      <EmergencySOS />
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">{t('symptomChecker')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('submitSymptoms')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left - Symptom Selection */}
        <div className="lg:col-span-2 space-y-4">

          {/* Type Symptoms */}
          <Card title={t('typeSymptoms')}>
            <div className="flex gap-2">
              <input
                type="text"
                value={typedSymptom}
                onChange={(e) => setTypedSymptom(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('symptomsPlaceholder')}
                className="input-field flex-1"
              />
              <Button variant="primary" onClick={addTyped} disabled={!typedSymptom.trim()}>
                <FiPlus className="inline mr-1" />{isMarathi ? 'जोडा' : 'Add'}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">{isMarathi ? 'Enter दाबा किंवा + बटण दाबा' : 'Press Enter or click + to add'}</p>
          </Card>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm font-medium">{t('orSelectBelow')}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder={t('searchSymptoms')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full"
          />

          {/* Selected symptoms chips */}
          {selected.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-700"><FiCheckCircle className="inline mr-1 text-green-500" />{t('selectedSymptoms')} ({selected.length})</p>
                <button onClick={() => setSelected([])} className="text-xs text-red-500 hover:underline">{t('clearAll')}</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.map(s => (
                  <span key={s} onClick={() => setSelected(prev => prev.filter(x => x !== s))}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors">
                    {s} ✕
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Symptom Categories */}
          {filteredCategories.map(cat => (
            <Card key={cat.key}>
              <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">{cat.icon} {t(cat.key)}</p>
              <div className="flex flex-wrap gap-2">
                {cat.symptoms.map(key => {
                  const label = t(key);
                  const isSelected = selected.includes(label);
                  return (
                    <button key={key} onClick={() => toggleSymptom(key)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        isSelected
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                      }`}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Right - Duration, Severity & Result */}
        <div className="space-y-4">
          <Card title={`${t('duration')} & ${t('severity')}`}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('duration')} <span className="text-red-500">*</span></label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field">
                  <option value="">{t('selectDuration')}</option>
                  <option value="today">{t('durationToday')}</option>
                  <option value="2-3days">{t('duration2days')}</option>
                  <option value="1week">{t('duration1week')}</option>
                  <option value="2weeks">{t('duration2weeks')}</option>
                  <option value="1month">{t('duration1month')}</option>
                  <option value="more">{t('durationMore')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('severity')} <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'low', key: 'mild', color: 'border-green-400 bg-green-50 text-green-700' },
                    { value: 'medium', key: 'moderate', color: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
                    { value: 'high', key: 'severe', color: 'border-orange-400 bg-orange-50 text-orange-700' },
                    { value: 'critical', key: 'critical', color: 'border-red-400 bg-red-50 text-red-700' },
                  ].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setSeverity(opt.value)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        severity === opt.value ? opt.color : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>
                      {t(opt.key)}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="primary" className="w-full"
                disabled={selected.length === 0 || !duration || loading}
                onClick={handleSubmit}>
                {loading ? t('analyzing') : `${t('getDiagnosis')} (${selected.length})`}
              </Button>

              {selected.length === 0 && (
                <p className="text-xs text-center text-gray-400">{t('selectSymptomFirst')}</p>
              )}
            </div>
          </Card>

          {/* Diagnosis Result */}
          {diagnosis && (
            <Card title={t('diagnosisResult')}>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-500 font-medium mb-1">{t('possibleCondition')}</p>
                  <p className="text-blue-900 font-bold">{diagnosis.condition}</p>
                  {diagnosis.conditionMr && diagnosis.conditionMr !== diagnosis.condition && (
                    <p className="text-blue-700 text-xs mt-0.5">{diagnosis.conditionMr}</p>
                  )}
                </div>

                <div className={`border rounded-lg p-3 ${diagnosis.color}`}>
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('urgency')}</p>
                  <p className="font-semibold text-sm flex items-center gap-2">
                    <MdCircle className={`text-xs ${diagnosis.urgencyLevel === 'red' ? 'text-red-500' : diagnosis.urgencyLevel === 'yellow' ? 'text-yellow-500' : 'text-green-500'}`} />
                    {diagnosis.urgency}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{diagnosis.urgencyMr}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium mb-1">{t('seeSpecialist')}</p>
                  <p className="text-green-800 font-bold"><FaUserMd className="inline mr-1" />{diagnosis.specialist}</p>
                  {diagnosis.specialistMr && diagnosis.specialistMr !== diagnosis.specialist && (
                    <p className="text-green-600 text-xs mt-0.5">{diagnosis.specialistMr}</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 font-medium mb-2">{t('recommendations')}</p>
                  <ul className="space-y-1">
                    {diagnosis.recommendations.map((rec, i) => (
                      <li key={i} className="text-yellow-800 text-xs flex gap-1"><span>•</span><span>{rec}</span></li>
                    ))}
                  </ul>
                </div>

                {diagnosis.home_therapy?.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="text-xs text-emerald-700 font-semibold mb-2">🏠 Home Remedies / घरगुती उपाय</p>
                    <div className="space-y-2">
                      {diagnosis.home_therapy.map((remedy, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-emerald-500 font-bold text-xs mt-0.5">{i + 1}.</span>
                          <div>
                            <p className="text-emerald-800 text-xs">{remedy}</p>
                            {diagnosis.home_therapy_mr?.[i] && (
                              <p className="text-emerald-600 text-xs mt-0.5">{diagnosis.home_therapy_mr[i]}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-2">{t('yourSymptoms')}</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.map(s => (
                      <span key={s} className="bg-white border text-xs px-2 py-0.5 rounded-full text-gray-600">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-600"><FiAlertTriangle className="inline mr-1" />{t('disclaimer')}</p>
                </div>

                {supported && (
                  <button
                    onClick={() => speaking ? stop() : speak(buildSpeechText(diagnosis), isMarathi ? 'mr' : 'en')}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      speaking ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' : 'bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100'
                    }`}>
                    {speaking ? <><FaVolumeMute />{isMarathi ? 'थांबवा' : 'Stop'}</> : <><FaVolumeUp />{isMarathi ? 'ऐका' : 'Listen'}</>}
                  </button>
                )}
                <Button variant="outline" className="w-full" onClick={() => { stop(); handleReset(); }}>{t('checkAgain')}</Button>

                {suggestedDoctors.length > 0 ? (
                  <div className="bg-white border border-primary-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-primary-700 mb-2 flex items-center gap-1">
                      <FaUserMd />Matched Doctors for {isMarathi ? diagnosis.specialistMr : diagnosis.specialist}
                    </p>
                    <div className="space-y-2">
                      {suggestedDoctors.map(doc => (
                        <div key={doc._id || doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div>
                            <p className="font-medium text-gray-800 text-xs">{doc.name}</p>
                            <p className="text-xs text-primary-600">{doc.specialty}</p>
                            <p className="text-xs text-gray-400">₹{doc.fee} • {doc.available !== false ? '🟢 Available' : '🔴 Unavailable'}</p>
                          </div>
                          <Button size="sm" variant={doc.available !== false ? 'primary' : 'secondary'}
                            disabled={doc.available === false}
                            onClick={() => navigate(`/patient/book-appointment/${doc._id || doc.id}`)}>
                            Book
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button variant="primary" className="w-full"
                    onClick={() => navigate(`/patient/doctors?specialty=${encodeURIComponent(diagnosis.specialist)}`)}>
                    <FaUserMd className="inline mr-1" />{isMarathi ? `${diagnosis.specialistMr} शोधा` : `Find ${diagnosis.specialist}`}
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomsPage;
