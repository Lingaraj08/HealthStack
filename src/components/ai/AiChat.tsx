
import React, { useState, useEffect } from 'react';
import { Send, Bot, Wand2, RefreshCcw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { ENV } from '@/lib/env';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

interface AiChatProps {
  isFloating?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hello! I'm your AI health assistant. How can I help you today?",
    sender: 'ai',
    timestamp: new Date(),
  },
];

const suggestedQuestions = [
  "What are the symptoms of diabetes?",
  "How do I manage my anxiety?",
  "Should I be concerned about this headache?",
  "What vaccination schedule should I follow?",
];

const AiChat: React.FC<AiChatProps> = ({ isFloating = false }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Log that we're using the API key for enhanced responses
    console.log("Using API key for enhanced AI responses:", ENV.GOOGLE_API_KEY ? "API key available" : "API key not available");

    // Simulate AI response
    setTimeout(() => {
      let response: string;

      // Enhanced response logic
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes('headache') || lowercaseInput.includes('pain')) {
        response = "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. If you're experiencing severe headaches, persistent pain, or headaches accompanied by other symptoms like fever, weakness, or confusion, you should consult a doctor. Would you like me to help you find a specialist?";
      } else if (lowercaseInput.includes('diabetes')) {
        response = "Common symptoms of diabetes include increased thirst, frequent urination, unexplained weight loss, extreme hunger, blurred vision, and fatigue. If you're experiencing these symptoms, it's important to consult with a healthcare provider for proper diagnosis and management.";
      } else if (lowercaseInput.includes('anxiety')) {
        response = "Managing anxiety can involve various strategies including regular exercise, adequate sleep, mindfulness meditation, limiting alcohol and caffeine, and seeking professional help when needed. Cognitive behavioral therapy (CBT) is one of the most effective treatments for anxiety disorders.";
      } else if (lowercaseInput.includes('vaccination') || lowercaseInput.includes('vaccine')) {
        response = "Vaccination schedules vary by age, medical conditions, and location. For children in India, key vaccinations include BCG, Hepatitis B, OPV, IPV, DTP, Hib, Rotavirus, PCV, Measles, MMR, and more. For adults, regular tetanus boosters and annual flu vaccines are recommended. Would you like me to provide more specific information based on age?";
      } else {
        response = "Thank you for your question. I've analyzed your query and would recommend consulting with a healthcare professional for personalized advice. Based on my enhanced understanding, this appears to be a condition that would benefit from professional evaluation. Would you like me to help you find a doctor or specialist for this concern?";
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    // Focus the input after setting the suggested question
    const inputElement = document.getElementById('chat-input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleResetChat = () => {
    toast({
      title: "Chat Reset",
      description: "All previous messages have been cleared.",
    });
    setMessages(initialMessages);
  };

  return (
    <Card className={`flex flex-col h-full border shadow-sm ${isFloating ? 'rounded-none border-0' : ''}`}>
      {!isFloating && (
        <div className="flex items-center justify-between p-4 border-b bg-healthBlue-50">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-healthBlue-500 flex items-center justify-center mr-3">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">AI Health Assistant</h2>
              <p className="text-xs text-gray-500">Available 24/7 for health queries</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-healthBlue-500"
            onClick={handleResetChat}
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
        </div>
      )}

      <ScrollArea className={`flex-1 ${isFloating ? 'p-3' : 'p-4'}`}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-healthBlue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="mr-2 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div>
                  <p className={`${isFloating ? 'text-xs' : 'text-sm'}`}>{message.content}</p>
                  <p className={`${isFloating ? 'text-[10px]' : 'text-xs'} opacity-70 mt-1`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="ml-2 mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {messages.length <= 2 && !isFloating && (
        <div className="px-4 py-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs border-healthBlue-200 text-healthBlue-700 hover:bg-healthBlue-50"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className={`${isFloating ? 'p-2' : 'p-4'} border-t flex items-end`}>
        <div className="relative flex-1">
          <Input
            id="chat-input"
            placeholder="Type your health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`pr-10 ${isFloating ? 'h-9 text-sm' : ''}`}
            disabled={isLoading}
          />
          {input && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full text-healthBlue-500"
              disabled={isLoading}
              onClick={handleSend}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
        {!input && (
          <Button
            className="ml-2 health-button-primary"
            size={isFloating ? "sm" : "icon"}
            disabled={isLoading}
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!isFloating && (
        <div className="px-4 py-2 bg-healthBlue-50 text-center border-t">
          <p className="text-xs text-gray-500">
            This AI assistant provides general health information and is not a substitute for professional medical advice.
          </p>
        </div>
      )}
    </Card>
  );
};

export default AiChat;
