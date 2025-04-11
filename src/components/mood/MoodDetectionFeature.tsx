
import React, { useState, useEffect } from 'react';
import MoodDetector, { Mood } from '@/components/mood/MoodDetector';
import QuoteDisplay from '@/components/mood/QuoteDisplay';
import { useAuth } from '@/components/auth/AuthContext';

const MoodDetectionFeature: React.FC = () => {
  const { user } = useAuth();
  const [detectedMood, setDetectedMood] = useState<Mood>(null);
  const [showQuote, setShowQuote] = useState<boolean>(false);

  const handleMoodDetected = (mood: Mood) => {
    console.log('Mood detected:', mood);
    setDetectedMood(mood);
    setShowQuote(true);
  };
  
  const handleCloseQuote = () => {
    setShowQuote(false);
  };

  // Reset mood detection after quote is closed
  useEffect(() => {
    if (!showQuote) {
      const timer = setTimeout(() => {
        setDetectedMood(null);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [showQuote]);

  if (!user) return null;

  return (
    <>
      <MoodDetector onMoodDetected={handleMoodDetected} active={!!user} />
      {showQuote && <QuoteDisplay mood={detectedMood} onClose={handleCloseQuote} />}
    </>
  );
};

export default MoodDetectionFeature;
