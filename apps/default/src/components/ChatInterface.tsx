import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Phone, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'media' | 'location';
  quickReplies?: string[];
  status?: 'sent' | 'delivered' | 'read';
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hello! Welcome to Bioniq Support. I\'m your AI assistant, ready to help you with:\n\n🔒 Account security & verification\n🛠️ Technical support & installation\n📦 Package tracking & orders\n💬 General inquiries\n\nHow can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: ['Check my internet speed', 'Track my order', 'Installation help', 'Account security', 'Speak to human agent']
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let botResponse = '';
      let quickReplies: string[] = [];

      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('speed') || lowerMessage.includes('internet')) {
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
        botResponse = '🤔 I understand you\'re asking about: "' + userMessage + '"\n\nLet me help you with that! Based on your query, here are some options:\n\n💡 I can assist with account management, technical support, order tracking, and installation guidance.\n\nWhat specific area would you like help with?';
        quickReplies = ['Technical support', 'Account management', 'Order tracking', 'Installation help', 'Speak to human'];
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Update message status to delivered after a short delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);

    // Update to read status
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 1000);

    simulateBotResponse(text);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle2 className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center space-x-3">
        <div className="bg-white p-2 rounded-full">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Bioniq Support Bot</h3>
          <p className="text-sm text-blue-100">Online • Typically replies instantly</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-end space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-line text-sm">{message.text}</p>
                  <div className={`flex items-center justify-between mt-1 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <span className={`text-xs ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'user' && (
                      <div className="ml-2">
                        {getStatusIcon(message.status)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Replies */}
              {message.quickReplies && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          This is a prototype simulation. Real WhatsApp integration would handle actual messaging.
        </p>
      </div>
    </div>
  );
};