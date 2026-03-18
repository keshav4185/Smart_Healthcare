import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmergencySOS from '../../components/common/EmergencySOS';
import { useLanguage } from '../../context/LanguageContext';

const getCategories = (t) => [
  { key: 'catHead', icon: '🧠', symptoms: ['headache','migraine','dizziness','memoryLoss','confusion','fainting'] },
  { key: 'catEyes', icon: '👁️', symptoms: ['blurredVision','eyePain','redEyes','wateryEyes','itchyEyes','doubleVision'] },
  { key: 'catENT', icon: '👂', symptoms: ['earPain','hearingLoss','runnyNose','blockedNose','soreThroat','sneezing'] },
  { key: 'catChest', icon: '❤️', symptoms: ['chestPain','palpitations','shortnessOfBreath','irregularHeartbeat','chestTightness'] },
  { key: 'catStomach', icon: '🫃', symptoms: ['stomachPain','nausea','vomiting','diarrhea','constipation','bloating','acidity'] },
  { key: 'catSkin', icon: '🩹', symptoms: ['rash','itching','drySkin','swelling','bruising','skinDiscoloration'] },
  { key: 'catBones', icon: '🦴', symptoms: ['backPain','jointPain','muscleWeakness','legPain','neckPain','kneePain'] },
  { key: 'catGeneral', icon: '🌡️', symptoms: ['fever','fatigue','weightLoss','weightGain','nightSweats','lossOfAppetite','chills'] },
  { key: 'catMental', icon: '🧘', symptoms: ['anxiety','depression','insomnia','stress','moodSwings','panicAttacks'] },
  { key: 'catUrinary', icon: '💧', symptoms: ['frequentUrination','burningUrination','bloodInUrine','lowerAbdomenPain'] },
];

const diagnoseSymptoms = (selected, severity) => {
  const s = selected.map(x => x.toLowerCase());
  const has = (...words) => words.some(w => s.some(sym => sym.includes(w.toLowerCase())));

  if (has('chest pain', 'छातीत दुखणे', 'palpitations', 'धडधड', 'irregular heartbeat', 'chest tightness'))
    return { condition: 'Possible Cardiac Issue / Angina', conditionMr: 'हृदयविकाराची शक्यता', specialist: 'Cardiologist', specialistMr: 'हृदयरोगतज्ञ', urgency: severity === 'critical' || severity === 'high' ? '🔴 Visit ER immediately' : '🟡 Consult doctor within 24 hours', urgencyMr: severity === 'critical' || severity === 'high' ? '🔴 तातडीने रुग्णालयात जा' : '🟡 २४ तासात डॉक्टरांना भेटा', recommendations: 'Avoid physical exertion. Take rest. Monitor blood pressure. Consult a Cardiologist immediately.', recommendationsMr: 'शारीरिक श्रम टाळा. विश्रांती घ्या. रक्तदाब तपासा. हृदयरोगतज्ञांना भेटा.', color: 'bg-red-50 border-red-200' };

  if (has('shortness of breath', 'श्वास घ्यायला त्रास', 'chest tightness'))
    return { condition: 'Respiratory Issue / Asthma', conditionMr: 'श्वसन समस्या / दमा', specialist: 'Pulmonologist', specialistMr: 'फुफ्फुसतज्ञ', urgency: '🔴 Seek immediate care', urgencyMr: '🔴 तातडीने उपचार घ्या', recommendations: 'Use inhaler if prescribed. Avoid dust/smoke. Stay in ventilated area.', recommendationsMr: 'इनहेलर वापरा. धूळ/धूर टाळा. हवेशीर जागी राहा.', color: 'bg-red-50 border-red-200' };

  if (has('headache', 'डोकेदुखी', 'migraine', 'मायग्रेन', 'dizziness', 'चक्कर', 'fainting', 'बेशुद्ध'))
    return { condition: 'Neurological Issue / Migraine', conditionMr: 'मज्जातंतू समस्या / मायग्रेन', specialist: 'Neurologist', specialistMr: 'मज्जातंत्रतज्ञ', urgency: '🟡 Consult within 48 hours', urgencyMr: '🟡 ४८ तासात डॉक्टरांना भेटा', recommendations: 'Rest in dark quiet room. Stay hydrated. Avoid screen time.', recommendationsMr: 'अंधाऱ्या शांत खोलीत विश्रांती घ्या. पाणी प्या. स्क्रीन टाळा.', color: 'bg-yellow-50 border-yellow-200' };

  if (has('fever', 'ताप', 'chills', 'थंडी', 'fatigue', 'थकवा'))
    return { condition: 'Viral Infection / Flu', conditionMr: 'विषाणू संसर्ग / फ्लू', specialist: 'General Physician', specialistMr: 'सामान्य डॉक्टर', urgency: '🟢 Consult within 2-3 days', urgencyMr: '🟢 २-३ दिवसात डॉक्टरांना भेटा', recommendations: 'Stay hydrated. Take rest. Use paracetamol for fever. Avoid cold food.', recommendationsMr: 'पाणी प्या. विश्रांती घ्या. तापासाठी पॅरासिटामॉल घ्या. थंड अन्न टाळा.', color: 'bg-green-50 border-green-200' };

  if (has('stomach pain', 'पोटदुखी', 'nausea', 'मळमळ', 'vomiting', 'उलटी', 'diarrhea', 'जुलाब', 'acidity', 'आम्लपित्त'))
    return { condition: 'Gastritis / Digestive Issue', conditionMr: 'जठराची सूज / पचन समस्या', specialist: 'Gastroenterologist', specialistMr: 'पचनतज्ञ', urgency: '🟢 Consult within 2-3 days', urgencyMr: '🟢 २-३ दिवसात डॉक्टरांना भेटा', recommendations: 'Drink ORS. Eat light food. Avoid spicy food. Rest well.', recommendationsMr: 'ORS प्या. हलके जेवण खा. तिखट टाळा. विश्रांती घ्या.', color: 'bg-green-50 border-green-200' };

  if (has('back pain', 'पाठदुखी', 'joint pain', 'सांधेदुखी', 'knee pain', 'गुडघेदुखी', 'neck pain', 'मानदुखी'))
    return { condition: 'Musculoskeletal Pain', conditionMr: 'स्नायू / हाडांचे दुखणे', specialist: 'Orthopedic', specialistMr: 'हाडांचे तज्ञ', urgency: '🟢 Consult within a week', urgencyMr: '🟢 एका आठवड्यात डॉक्टरांना भेटा', recommendations: 'Apply hot/cold compress. Avoid heavy lifting. Light stretching.', recommendationsMr: 'गरम/थंड शेक द्या. जड उचलणे टाळा. हलके व्यायाम करा.', color: 'bg-green-50 border-green-200' };

  if (has('rash', 'पुरळ', 'itching', 'खाज', 'dry skin', 'कोरडी त्वचा'))
    return { condition: 'Skin Allergy / Dermatitis', conditionMr: 'त्वचा ऍलर्जी', specialist: 'Dermatologist', specialistMr: 'त्वचारोगतज्ञ', urgency: '🟢 Consult within a week', urgencyMr: '🟢 एका आठवड्यात डॉक्टरांना भेटा', recommendations: 'Avoid allergens. Use mild soap. Apply calamine lotion.', recommendationsMr: 'ऍलर्जी कारणे टाळा. सौम्य साबण वापरा. कॅलामाइन लोशन लावा.', color: 'bg-green-50 border-green-200' };

  if (has('anxiety', 'चिंता', 'depression', 'नैराश्य', 'insomnia', 'झोप न येणे', 'panic', 'घाबरणे'))
    return { condition: 'Mental Health Issue', conditionMr: 'मानसिक आरोग्य समस्या', specialist: 'Psychiatrist', specialistMr: 'मनोचिकित्सक', urgency: '🟡 Consult within a week', urgencyMr: '🟡 एका आठवड्यात डॉक्टरांना भेटा', recommendations: 'Practice meditation. Talk to someone. Avoid stress. Seek professional help.', recommendationsMr: 'ध्यान करा. कोणाशी बोला. ताण टाळा. तज्ञांची मदत घ्या.', color: 'bg-yellow-50 border-yellow-200' };

  if (has('frequent urination', 'वारंवार लघवी', 'burning urination', 'लघवीत जळजळ'))
    return { condition: 'Urinary Tract Infection (UTI)', conditionMr: 'मूत्रमार्ग संसर्ग (UTI)', specialist: 'Urologist', specialistMr: 'मूत्रतज्ञ', urgency: '🟡 Consult within 48 hours', urgencyMr: '🟡 ४८ तासात डॉक्टरांना भेटा', recommendations: 'Drink plenty of water. Avoid holding urine. Consult Urologist.', recommendationsMr: 'भरपूर पाणी प्या. लघवी रोखू नका. मूत्रतज्ञांना भेटा.', color: 'bg-yellow-50 border-yellow-200' };

  if (has('sore throat', 'घसा दुखणे', 'runny nose', 'नाक वाहणे', 'ear pain', 'कानात दुखणे'))
    return { condition: 'ENT Infection / Common Cold', conditionMr: 'ENT संसर्ग / सर्दी', specialist: 'ENT Specialist', specialistMr: 'ENT तज्ञ', urgency: '🟢 Consult within 2-3 days', urgencyMr: '🟢 २-३ दिवसात डॉक्टरांना भेटा', recommendations: 'Gargle with warm salt water. Steam inhalation. Stay warm.', recommendationsMr: 'कोमट मिठाच्या पाण्याने गुळण्या करा. वाफ घ्या. उबदार राहा.', color: 'bg-green-50 border-green-200' };

  return { condition: 'General Health Issue', conditionMr: 'सामान्य आरोग्य समस्या', specialist: 'General Physician', specialistMr: 'सामान्य डॉक्टर', urgency: '🟢 Consult within a week', urgencyMr: '🟢 एका आठवड्यात डॉक्टरांना भेटा', recommendations: 'Take rest. Stay hydrated. Eat nutritious food. Consult a General Physician.', recommendationsMr: 'विश्रांती घ्या. पाणी प्या. पौष्टिक अन्न खा. डॉक्टरांना भेटा.', color: 'bg-green-50 border-green-200' };
};

const SymptomsPage = () => {
  const { t, isMarathi } = useLanguage();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [typedSymptom, setTypedSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const categories = getCategories(t);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allSymptoms.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      setDiagnosis(diagnoseSymptoms(allSymptoms, severity));
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setSelected([]); setTypedSymptom(''); setDuration('');
    setSeverity('moderate'); setDiagnosis(null); setSearch('');
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
                + {isMarathi ? 'जोडा' : 'Add'}
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
                <p className="font-semibold text-gray-700">✅ {t('selectedSymptoms')} ({selected.length})</p>
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
              <p className="font-semibold text-gray-700 mb-3">{cat.icon} {t(cat.key)}</p>
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
                  <p className="text-blue-900 font-bold">{isMarathi ? diagnosis.conditionMr : diagnosis.condition}</p>
                </div>

                <div className={`border rounded-lg p-3 ${diagnosis.color}`}>
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('urgency')}</p>
                  <p className="font-semibold text-sm">{isMarathi ? diagnosis.urgencyMr : diagnosis.urgency}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium mb-1">{t('seeSpecialist')}</p>
                  <p className="text-green-800 font-bold">👨⚕️ {isMarathi ? diagnosis.specialistMr : diagnosis.specialist}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 font-medium mb-1">{t('recommendations')}</p>
                  <p className="text-yellow-800 text-xs">{isMarathi ? diagnosis.recommendationsMr : diagnosis.recommendations}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-2">{t('yourSymptoms')}</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.map(s => (
                      <span key={s} className="bg-white border text-xs px-2 py-0.5 rounded-full text-gray-600">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-600">⚠️ {t('disclaimer')}</p>
                </div>

                <Button variant="outline" className="w-full" onClick={handleReset}>{t('checkAgain')}</Button>

                <Button variant="primary" className="w-full"
                  onClick={() => navigate(`/patient/doctors?specialty=${encodeURIComponent(diagnosis.specialist)}`)}>
                  {isMarathi ? `${diagnosis.specialistMr} शोधा 👨⚕️` : `Find ${diagnosis.specialist} 👨⚕️`}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomsPage;
