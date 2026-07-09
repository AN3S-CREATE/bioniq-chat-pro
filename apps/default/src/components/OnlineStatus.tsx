import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';

interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
  userName?: string;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({ 
  isOnline, 
  lastSeen, 
  isTyping = false,
  userName = 'Bioniq Support'
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatLastSeen = (date: Date) => {
    const now = currentTime;
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'last seen just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `last seen ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `last seen ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `last seen ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return `last seen ${date.toLocaleDateString()}`;
  };

  const getStatusText = () => {
    if (isTyping) return `${userName} is typing...`;
    if (isOnline) return 'online';
    if (lastSeen) return formatLastSeen(lastSeen);
    return 'offline';
  };

  const getStatusIcon = () => {
    if (isTyping) {
      return (
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      );
    }

    if (isOnline) {
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
          <Wifi className="w-3 h-3 text-green-300 ml-1" />
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <Clock className="w-3 h-3 text-gray-400 ml-1" />
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon()}
      <span className={`text-xs transition-colors duration-200 ${
        isTyping 
          ? 'text-green-200 animate-pulse' 
          : isOnline 
            ? 'text-green-100' 
            : 'text-gray-300'
      }`}>
        {getStatusText()}
      </span>
    </div>
  );
};