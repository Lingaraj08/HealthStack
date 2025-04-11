
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Smile, Frown, Meh, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Mood } from './MoodDetector';

interface Quote {
  text: string;
  author: string;
}

// Quotes database organized by mood
const quotesByMood: Record<string, Quote[]> = {
  happy: [
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "The most wasted of all days is one without laughter.", author: "E. E. Cummings" },
    { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
  ],
  sad: [
    { text: "You're braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The darkest hour has only sixty minutes.", author: "Morris Mandel" },
  ],
  neutral: [
    { text: "Every day may not be good, but there's something good in every day.", author: "Anonymous" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  ],
};

interface QuoteDisplayProps {
  mood: Mood;
  onClose: () => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ mood, onClose }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  
  useEffect(() => {
    if (!mood) {
      setQuote(null);
      return;
    }
    
    const quotes = quotesByMood[mood] || quotesByMood.neutral;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    // Auto-hide quote after 15 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [mood, onClose]);
  
  if (!mood || !quote) return null;
  
  const moodIcon = {
    happy: <Smile className="h-5 w-5 text-healthGreen-500" />,
    sad: <Frown className="h-5 w-5 text-healthOrange-500" />,
    neutral: <Meh className="h-5 w-5 text-healthBlue-500" />,
  }[mood];
  
  const gradientColors = {
    happy: "from-healthGreen-100 to-white dark:from-healthGreen-900/30 dark:to-transparent",
    sad: "from-healthOrange-100 to-white dark:from-healthOrange-900/30 dark:to-transparent",
    neutral: "from-healthBlue-100 to-white dark:from-healthBlue-900/30 dark:to-transparent",
  }[mood];
  
  return (
    <Card className={`fixed bottom-24 right-6 z-40 w-72 p-4 shadow-lg border-l-4 animate-fade-in bg-gradient-to-r ${gradientColors}`}
      style={{ 
        borderLeftColor: mood === 'happy' ? '#2ecc71' : mood === 'sad' ? '#FF9F1C' : '#1976d2'
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 mb-2">
          {moodIcon}
          <h3 className="font-medium text-sm capitalize">{mood} Moment</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full -mt-1 -mr-2" 
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <p className="text-sm mb-2 italic">{quote.text}</p>
      <p className="text-xs text-right text-muted-foreground">— {quote.author}</p>
    </Card>
  );
};

export default QuoteDisplay;
