import React, { useState, useEffect } from 'react';
import { Clock, Check, CheckCheck, Eye } from 'lucide-react';

export type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface MessageStatusProps {
  status: MessageStatusType;
  timestamp: Date;
  showTimestamp?: boolean;
  animated?: boolean;
  readBy?: string[];
}

export const MessageStatus: React.FC<MessageStatusProps> = ({ 
  status, 
  timestamp, 
  showTimestamp = true,
  animated = true,
  readBy = []
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animated && (status === 'delivered' || status === 'read')) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [status, animated]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return (
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400 animate-pulse" />
            {showTimestamp && (
              <span className="text-xs text-gray-400">Sending...</span>
            )}
          </div>
        );
      case 'sent':
        return (
          <div className="flex items-center space-x-1">
            <Check className={`w-3 h-3 text-gray-400 ${isAnimating ? 'animate-pulse' : ''}`} />
            {showTimestamp && (
              <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>
            )}
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center space-x-1">
            <CheckCheck className={`w-3 h-3 text-gray-400 ${isAnimating ? 'animate-bounce' : ''}`} />
            {showTimestamp && (
              <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>
            )}
          </div>
        );
      case 'read':
        return (
          <div className="flex items-center space-x-1">
            <CheckCheck className={`w-3 h-3 text-blue-500 ${isAnimating ? 'animate-pulse' : ''}`} />
            {readBy.length > 0 && (
              <Eye className="w-3 h-3 text-blue-500" />
            )}
            {showTimestamp && (
              <span className="text-xs text-blue-500">{formatTime(timestamp)}</span>
            )}
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            {showTimestamp && (
              <span className="text-xs text-red-500">Failed</span>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Sending message...';
      case 'sent':
        return 'Message sent';
      case 'delivered':
        return 'Message delivered';
      case 'read':
        return readBy.length > 0 
          ? `Read by ${readBy.join(', ')}` 
          : 'Message read';
      case 'failed':
        return 'Message failed to send';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center space-x-1" title={getStatusText()}>
      {getStatusIcon()}
      {readBy.length > 1 && (
        <span className="text-xs text-blue-500">+{readBy.length - 1}</span>
      )}
    </div>
  );
};