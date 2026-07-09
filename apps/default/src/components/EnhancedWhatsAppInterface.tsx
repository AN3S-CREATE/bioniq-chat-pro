import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Paperclip, Mic, Camera, Smile, File, Image, Play, Pause, Download } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import { MessageStatus, MessageStatusType } from './MessageStatus';
import { OnlineStatus } from './OnlineStatus';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: MessageStatusType;
  type?: 'text' | 'image' | 'audio' | 'document' | 'voice';
  quickReplies?: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  readBy?: string[];
  deliveredAt?: Date;
  readAt?: Date;
}

interface EnhancedWhatsAppInterfaceProps {
  onFeedbackRequest?: () => void;
}

export const EnhancedWhatsAppInterface: React.FC<EnhancedWhatsAppInterfaceProps> = ({ onFeedbackRequest }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hello! Welcome to Bioniq Support. I\'m your AI assistant, ready to help you with:\n\n🔒 Account security & verification\n🛠️ Technical support & installation\n📦 Package tracking & orders\n💬 General inquiries\n\nHow can I assist you today?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      status: 'read',
      readBy: ['You'],
      readAt: new Date(Date.now() - 59000),
      quickReplies: ['Check my internet speed', 'Track my order', 'Installation help', 'Account security', 'Speak to human agent']
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSeen, setLastSeen] = useState<Date>(new Date());
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const botTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onlineIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping, scrollToBottom]);

  // Simulate realistic connection status changes with cleanup
  useEffect(() => {
    connectionIntervalRef.current = setInterval(() => {
      const random = Math.random();
      
      if (random < 0.05) {
        setIsOnline(false);
        setLastSeen(new Date());
        setConnectionQuality('poor');
        
        setTimeout(() => {
          setIsOnline(true);
          setConnectionQuality(Math.random() > 0.3 ? 'excellent' : 'good');
        }, Math.random() * 7000 + 3000);
      } else if (random < 0.1) {
        const qualities: Array<'excellent' | 'good' | 'poor'> = ['excellent', 'good', 'poor'];
        setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }
    }, 15000);

    return () => {
      if (connectionIntervalRef.current) {
        clearInterval(connectionIntervalRef.current);
      }
    };
  }, []);

  // Handle user typing indicator with cleanup
  useEffect(() => {
    if (inputText.length > 0) {
      setIsUserTyping(true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsUserTyping(false);
      }, 1000);
    } else {
      setIsUserTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputText]);

  // Recording timer with cleanup
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  // Cleanup all timeouts and intervals on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (botTypingTimeoutRef.current) clearTimeout(botTypingTimeoutRef.current);
      if (connectionIntervalRef.current) clearInterval(connectionIntervalRef.current);
      if (onlineIntervalRef.current) clearInterval(onlineIntervalRef.current);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  const simulateMessageStatusProgression = useCallback((messageId: string) => {
    const delays = {
      sent: 200 + Math.random() * 300,
      delivered: 500 + Math.random() * 1000,
      read: 1000 + Math.random() * 2000
    };

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'sent' as MessageStatusType } : msg
      ));
    }, delays.sent);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { 
          ...msg, 
          status: 'delivered' as MessageStatusType,
          deliveredAt: new Date()
        } : msg
      ));
    }, delays.delivered);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { 
          ...msg, 
          status: 'read' as MessageStatusType,
          readBy: ['Bioniq Support'],
          readAt: new Date()
        } : msg
      ));
    }, delays.read);
  }, []);

  const simulateBotResponse = useCallback((userMessage: string, messageType: string = 'text') => {
    const typingDelay = Math.max(1500, Math.min(4000, userMessage.length * 80));
    
    setIsBotTyping(true);
    
    if (botTypingTimeoutRef.current) {
      clearTimeout(botTypingTimeoutRef.current);
    }

    botTypingTimeoutRef.current = setTimeout(() => {
      let botResponse = '';
      let quickReplies: string[] = [];
      let responseType: Message['type'] = 'text';

      const lowerMessage = userMessage.toLowerCase();

      if (messageType === 'voice') {
        botResponse = '🎤 I heard your voice message! Our voice recognition system processed your request. How can I help you further?';
        quickReplies = ['Send text instead', 'Technical support', 'Account help', 'Order tracking'];
      } else if (messageType === 'image') {
        botResponse = '📸 Thanks for sharing the image! I can see the photo you sent. Our technical team can analyze images for:\n\n• Equipment setup issues\n• Connection problems\n• Installation guidance\n• Damage assessment\n\nWhat would you like me to help you with regarding this image?';
        quickReplies = ['Analyze equipment', 'Installation help', 'Report damage', 'Technical support'];
      } else if (lowerMessage.includes('speed') || lowerMessage.includes('internet')) {
        botResponse = '🚀 Let me check your connection status...\n\n✅ Your current plan: Unrestricted Uncapped 100Mbps\n📊 Current speed: 98.5 Mbps down / 45.2 Mbps up\n📍 Location: Steve Tshwete, Mpumalanga\n\n🎯 Performance is excellent! Is there anything specific you\'d like me to help you with?';
        quickReplies = ['Upgrade my plan', 'Report slow speeds', 'Check data usage', 'Technical support'];
      } else if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
        botResponse = '📦 I can help you track your order! Please provide your order number, or I can look it up using your registered phone number.\n\n🔍 Recent orders found:\n• Order #BQ-2024-1205: Fiber Installation Kit (Delivered)\n• Order #BQ-2024-1201: WiFi Router Upgrade (In Transit)\n\nWhich order would you like to track?';
        quickReplies = ['Track BQ-2024-1201', 'All my orders', 'Return/Exchange', 'Contact courier'];
      } else if (lowerMessage.includes('installation') || lowerMessage.includes('install')) {
        botResponse = '🔧 I\'ll guide you through the installation process!\n\n📋 Pre-installation checklist:\n✅ Power drill and bits\n✅ Ethernet cables\n✅ Clear line of sight to tower\n✅ Power outlet nearby\n\n🎥 Would you like step-by-step video guides or prefer text instructions?';
        quickReplies = ['Video guides', 'Text instructions', 'Schedule technician', 'Troubleshoot issue'];
      } else if (lowerMessage.includes('security') || lowerMessage.includes('account')) {
        botResponse = '🔐 Account security is our priority! I can help you with:\n\n🛡️ Two-factor authentication setup\n🔑 Password reset\n📱 Device management\n👤 Profile verification\n\n⚠️ For security, I\'ll need to verify your identity first. Please choose your preferred verification method:';
        quickReplies = ['SMS verification', 'Email verification', 'Security questions', 'Call me back'];
      } else if (lowerMessage.includes('human') || lowerMessage.includes('agent')) {
        botResponse = '👨‍💼 I\'ll connect you with one of our human agents right away!\n\n📞 Transferring your conversation to our support team...\n⏱️ Average wait time: 2-3 minutes\n\n📝 I\'ve shared our entire conversation history with the agent so you won\'t need to repeat yourself.\n\n🔔 You\'ll receive a notification when an agent joins the chat.';
        quickReplies = ['Cancel transfer', 'Priority support', 'Schedule callback', 'Leave message'];
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        botResponse = '👋 Hello! Great to hear from you! I\'m here to help with all your Bioniq internet needs.\n\n🌟 Quick fact: You\'re enjoying truly unrestricted, uncapped internet - no fair usage policies or hidden limits!\n\nWhat can I help you with today?';
        quickReplies = ['Check my account', 'Technical support', 'Billing inquiry', 'New services'];
      } else {
        botResponse = `🤔 I understand you're asking about: "${userMessage}"\n\nLet me help you with that! Based on your query, here are some options:\n\n💡 I can assist with account management, technical support, order tracking, and installation guidance.\n\nWhat specific area would you like help with?`;
        quickReplies = ['Technical support', 'Account management', 'Order tracking', 'Installation help', 'Speak to human'];
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
        type: responseType,
        readBy: ['You'],
        readAt: new Date(),
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined
      };

      setMessages(prev => [...prev, newMessage]);
      setIsBotTyping(false);
    }, typingDelay);
  }, []);

  const handleSendMessage = useCallback((text: string, type: Message['type'] = 'text', fileData?: any) => {
    if (!text.trim() && type === 'text') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text || (type === 'voice' ? 'Voice message' : type === 'image' ? 'Image' : type === 'document' ? 'Document' : text),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      type: type,
      ...fileData
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowAttachmentMenu(false);
    setIsUserTyping(false);
    
    simulateMessageStatusProgression(userMessage.id);
    
    setTimeout(() => {
      simulateBotResponse(text, type);
    }, 1500);
  }, [simulateMessageStatusProgression, simulateBotResponse]);

  const handleQuickReply = useCallback((reply: string) => {
    handleSendMessage(reply);
  }, [handleSendMessage]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image') => {
    const file = event.target.files?.[0];
    if (file) {
      const fileData = {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        fileUrl: URL.createObjectURL(file)
      };
      
      handleSendMessage('', type, fileData);
    }
  }, [handleSendMessage]);

  const handleVoiceRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      const duration = `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`;
      handleSendMessage('Voice message', 'voice', { duration });
    } else {
      setIsRecording(true);
    }
  }, [isRecording, recordingTime, handleSendMessage]);

  const toggleAudioPlayback = useCallback((messageId: string) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(messageId);
      setTimeout(() => setPlayingAudio(null), 3000);
    }
  }, [playingAudio]);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, []);

  const formatRecordingTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getConnectionQualityColor = useCallback(() => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }, [connectionQuality]);

  const renderMessage = useCallback((message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-lg lg:max-w-xl ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {isUser ? (
                <span className="text-white text-xs font-bold">U</span>
              ) : (
                <span className="text-white text-xs font-bold">B</span>
              )}
            </div>
            <div className={`px-4 py-3 rounded-2xl ${
              isUser 
                ? 'bg-green-500 text-white rounded-br-sm' 
                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
            }`}>
              {message.type === 'voice' ? (
                <div className="flex items-center space-x-3 min-w-[200px]">
                  <button
                    onClick={() => toggleAudioPlayback(message.id)}
                    className={`p-2 rounded-full ${isUser ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  >
                    {playingAudio === message.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className={`h-8 bg-gradient-to-r ${isUser ? 'from-green-400 to-green-600' : 'from-gray-300 to-gray-500'} rounded-full flex items-center px-2`}>
                      <div className="w-full h-1 bg-white/30 rounded-full">
                        <div className={`h-full ${playingAudio === message.id ? 'w-1/2' : 'w-0'} bg-white rounded-full transition-all duration-3000`}></div>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs ${isUser ? 'text-green-100' : 'text-gray-600'}`}>
                    {message.duration || '0:15'}
                  </span>
                </div>
              ) : message.type === 'image' ? (
                <div className="space-y-2">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  {message.text && message.text !== 'Image' && (
                    <p className="text-sm">{message.text}</p>
                  )}
                </div>
              ) : message.type === 'document' ? (
                <div className="flex items-center space-x-3 min-w-[200px]">
                  <div className={`p-2 rounded-lg ${isUser ? 'bg-green-600' : 'bg-gray-200'}`}>
                    <File className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{message.fileName || 'Document'}</p>
                    <p className={`text-xs ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
                      {message.fileSize || '1.2 MB'}
                    </p>
                  </div>
                  <button className={`p-1 rounded ${isUser ? 'hover:bg-green-600' : 'hover:bg-gray-200'} transition-colors`}>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
              )}
              
              <div className={`flex items-center justify-between mt-2 ${
                isUser ? 'flex-row-reverse' : ''
              }`}>
                <span className={`text-xs ${
                  isUser ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </span>
                {isUser && (
                  <div className="ml-2">
                    <MessageStatus 
                      status={message.status || 'sent'} 
                      timestamp={message.timestamp}
                      showTimestamp={false}
                      readBy={message.readBy}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Replies */}
          {message.quickReplies && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }, [formatTime, playingAudio, toggleAudioPlayback, handleQuickReply]);

  return (
    <div className="flex flex-col h-[900px] md:h-[1000px] bg-gray-100 w-full border border-gray-300 rounded-lg overflow-hidden shadow-2xl">
      {/* Enhanced WhatsApp Header */}
      <div className="bg-green-600 text-white p-4 flex items-center space-x-3">
        <button className="p-1 hover:bg-green-700 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
          <img 
            src="https://iili.io/K7aquNS.png" 
            alt="Bioniq Logo" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hidden">
            <span className="text-white text-xs font-bold">B</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white">Bioniq Support</h3>
          <OnlineStatus 
            isOnline={isOnline}
            lastSeen={lastSeen}
            isTyping={isBotTyping}
            userName="Bioniq Support"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className={`text-xs ${getConnectionQualityColor()}`}>
            {connectionQuality}
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-green-700 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#e5ddd5'
        }}
      >
        {messages.map(renderMessage)}
        
        {/* Enhanced Typing Indicator */}
        <TypingIndicator 
          isVisible={isBotTyping}
          sender="bot"
          userName="Bioniq Support"
        />
        
        <div ref={messagesEndRef} />
      </div>

      {/* User Typing Indicator in Header */}
      {isUserTyping && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
          <TypingIndicator 
            isVisible={isUserTyping}
            sender="user"
            duration={1000}
          />
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-4 max-w-xs">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-xs text-gray-600">Camera</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <File className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">Document</span>
            </button>
            
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Gallery</span>
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {isRecording ? (
          <div className="flex items-center space-x-3 bg-red-50 rounded-full px-4 py-3 border border-red-200">
            <div className="flex items-center space-x-2 flex-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-medium">Recording...</span>
              <span className="text-red-500 text-sm">{formatRecordingTime(recordingTime)}</span>
            </div>
            <button
              onClick={handleVoiceRecording}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-3 border border-gray-300">
            <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Type a message"
              className="flex-1 outline-none text-sm"
            />
            <button 
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            {inputText.trim() ? (
              <button
                onClick={() => handleSendMessage(inputText)}
                className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleVoiceRecording}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => handleFileUpload(e, 'document')}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
        className="hidden"
      />

      {/* Feedback Button */}
      {onFeedbackRequest && (
        <div className="bg-blue-50 border-t border-blue-200 p-3">
          <button
            onClick={onFeedbackRequest}
            className="w-full text-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
          >
            💬 How was your experience? Share feedback
          </button>
        </div>
      )}
    </div>
  );
};