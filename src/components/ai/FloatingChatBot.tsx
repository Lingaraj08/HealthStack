
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AiChat from './AiChat';
import { ENV } from '@/lib/env';

const FloatingChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // If AI features are disabled via environment variable, don't render anything
  if (!ENV.ENABLE_AI_FEATURES) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 h-[500px] shadow-lg border-healthBlue-300 overflow-hidden flex flex-col animate-fade-in">
          <div className="flex items-center justify-between bg-healthBlue-500 text-white p-3">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <h3 className="text-sm font-medium">AI Health Assistant</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 rounded-full hover:bg-healthBlue-400 text-white"
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
          className="rounded-full h-14 w-14 bg-healthBlue-500 hover:bg-healthBlue-600 shadow-lg flex items-center justify-center"
          aria-label="Open AI Health Assistant"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default FloatingChatBot;
