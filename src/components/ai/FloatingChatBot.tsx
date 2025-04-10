
import React, { useState } from 'react';
import { Bot, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AiChat from './AiChat';
import MoodDetector, { Mood } from '../mood/MoodDetector';
import QuoteDisplay from '../mood/QuoteDisplay';
import { ENV, AI_CONFIG } from '@/lib/env';

const FloatingChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedMood, setDetectedMood] = useState<Mood>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [moodDetectorActive, setMoodDetectorActive] = useState(false);

  // AI features are enabled based on environment configuration
  const enableAiFeatures = ENV.ENABLE_AI_FEATURES;

  // If AI features are disabled, don't render anything
  if (!enableAiFeatures) {
    return null;
  }

  const handleMoodDetected = (mood: Mood) => {
    setDetectedMood(mood);
    setShowQuote(true);
  };

  const handleCloseQuote = () => {
    setShowQuote(false);
  };

  const toggleMoodDetector = () => {
    setMoodDetectorActive(!moodDetectorActive);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      {showQuote && (
        <QuoteDisplay mood={detectedMood} onClose={handleCloseQuote} />
      )}
      
      {/* Mood Detector Button */}
      <Button 
        onClick={toggleMoodDetector} 
        className={`rounded-full h-14 w-14 ${
          moodDetectorActive 
            ? 'bg-healthGreen-500 hover:bg-healthGreen-600 dark:bg-healthGreen-600 dark:hover:bg-healthGreen-700' 
            : 'bg-healthOrange-500 hover:bg-healthOrange-600 dark:bg-healthOrange-600 dark:hover:bg-healthOrange-700'
        } shadow-lg flex items-center justify-center`}
        aria-label={moodDetectorActive ? "Disable Mood Detection" : "Enable Mood Detection"}
      >
        {moodDetectorActive ? (
          <Bot className="h-6 w-6 text-white" />
        ) : (
          <Bot className="h-6 w-6 text-white" />
        )}
      </Button>
      
      {moodDetectorActive && (
        <div className="mr-16 mb-2">
          <MoodDetector onMoodDetected={handleMoodDetected} active={moodDetectorActive} />
        </div>
      )}
      
      {/* AI Chat Button & Dialog */}
      {isOpen ? (
        <Card className="w-80 md:w-96 h-[500px] shadow-card border border-healthBlue-300 dark:border-healthBlue-700 overflow-hidden flex flex-col animate-fade-in rounded-2xl">
          <div className="flex items-center justify-between bg-healthBlue-500 dark:bg-healthBlue-600 text-white p-3">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <h3 className="text-sm font-medium">Health Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 rounded-full hover:bg-healthBlue-400 dark:hover:bg-healthBlue-700 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-grow overflow-hidden">
            <AiChat isFloating={true} />
          </div>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full h-14 w-14 bg-healthBlue-500 hover:bg-healthBlue-600 dark:bg-healthBlue-600 dark:hover:bg-healthBlue-700 shadow-lg flex items-center justify-center"
          aria-label="Open Health Assistant"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default FloatingChatBot;
