import React, { useState, useEffect } from 'react';
import { Bot, User } from 'lucide-react';

interface TypingIndicatorProps {
  isVisible: boolean;
  sender: 'user' | 'bot';
  userName?: string;
  duration?: number;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  isVisible, 
  sender, 
  userName = 'Bioniq Support',
  duration = 3000 
}) => {
  const [dots, setDots] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);

      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setIsAnimating(false);
      setDots('');
    }
  }, [isVisible, duration]);

  if (!isVisible || !isAnimating) return null;

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex items-end space-x-2 ${sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          sender === 'user' ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {sender === 'user' ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        <div className={`px-4 py-3 rounded-2xl max-w-xs ${
          sender === 'user' 
            ? 'bg-green-500 text-white rounded-br-sm' 
            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full animate-bounce ${
                sender === 'user' ? 'bg-green-200' : 'bg-gray-400'
              }`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${
                sender === 'user' ? 'bg-green-200' : 'bg-gray-400'
              }`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${
                sender === 'user' ? 'bg-green-200' : 'bg-gray-400'
              }`} style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className={`text-xs ${
              sender === 'user' ? 'text-green-100' : 'text-gray-500'
            }`}>
              {sender === 'user' ? 'typing' : `${userName} is typing`}{dots}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};