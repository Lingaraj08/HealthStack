
import React, { useState } from 'react';
import { Bot, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AiChat from './AiChat';
import MoodDetector, { Mood } from '../mood/MoodDetector';
import QuoteDisplay from '../mood/QuoteDisplay';

const FloatingChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedMood, setDetectedMood] = useState<Mood>(null);
  const [showQuote, setShowQuote] = useState(false);

  // AI features are always enabled by default
  const enableAiFeatures = true;

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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showQuote && (
        <QuoteDisplay mood={detectedMood} onClose={handleCloseQuote} />
      )}
      
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
          <div className="p-2 border-t">
            <MoodDetector onMoodDetected={handleMoodDetected} active={isOpen} />
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
