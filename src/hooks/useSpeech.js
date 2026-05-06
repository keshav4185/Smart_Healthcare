import { useState, useCallback, useEffect } from 'react';

const useSpeech = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => 'speechSynthesis' in window);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback((text, lang = 'en-IN') => {
    if (!supported || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
};

export default useSpeech;
