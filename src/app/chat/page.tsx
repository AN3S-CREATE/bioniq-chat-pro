'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Paperclip, Mic, Smile, ShieldAlert } from 'lucide-react';

type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  status?: MessageStatusType;
  quickReplies?: string[];
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 11" width="16" height="11" fill="none">
    <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.153.536.536 0 0 0-.33.114.45.45 0 0 0-.187.3.458.458 0 0 0 .097.354l2.735 2.745a.441.441 0 0 0 .321.153h.013a.48.48 0 0 0 .305-.114.443.443 0 0 0 .153-.235l6.508-8.055a.454.454 0 0 0 .036-.352.45.45 0 0 0-.235-.197Z" fill="currentColor"/>
  </svg>
);

const DoubleCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 16 11" width="16" height="11" fill="none">
    <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 0 0-.336-.153.536.536 0 0 0-.33.114.45.45 0 0 0-.187.3.458.458 0 0 0 .097.354l2.735 2.745a.441.441 0 0 0 .321.153h.013a.48.48 0 0 0 .305-.114.443.443 0 0 0 .153-.235l6.508-8.055a.454.454 0 0 0 .036-.352.45.45 0 0 0-.235-.197Z" fill="currentColor"/>
    <path d="M15.81.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-.519-.49L10.836 5.3l.53.5 4.406-5.345a.454.454 0 0 0 .036-.352.45.45 0 0 0-.235-.197Z" fill="currentColor" fillOpacity=".45"/>
  </svg>
);

const TypingDots: React.FC = () => (
  <div className="flex justify-start px-[9px] mb-[2px]">
    <div className="bg-white rounded-[7.5px] rounded-bl-[2px] shadow-[0_1px_0.5px_rgba(0,0,0,0.07)] px-[9px] py-[7px] relative">
      <svg className="absolute bottom-0 -left-[7px] w-[8px] h-[13px] text-white" viewBox="0 0 8 13" width="8" height="13">
        <path d="M2.812 0H0v13h8V4.497c0-.8-.336-1.53-.876-2.034L5 0H2.812Z" fill="currentColor"/>
      </svg>
      <div className="flex items-center gap-[3px] h-[11px]">
        <span className="w-[5px] h-[5px] bg-[#a0a7ab] rounded-full animate-[wa-dot_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
        <span className="w-[5px] h-[5px] bg-[#a0a7ab] rounded-full animate-[wa-dot_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
        <span className="w-[5px] h-[5px] bg-[#a0a7ab] rounded-full animate-[wa-dot_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  </div>
);

const TailSent: React.FC = () => (
  <span className="absolute bottom-0 right-0 translate-x-[7px] -z-10">
    <svg width="8" height="13" viewBox="0 0 8 13" className="w-[8px] h-[13px] block">
      <path d="M5.188 0H8v13H0V4.497c0-.8.336-1.53.876-2.034L3 0h2.188Z" fill="#d9fdd3"/>
    </svg>
  </span>
);

const TailReceived: React.FC = () => (
  <span className="absolute bottom-0 left-0 -translate-x-[7px] -z-10">
    <svg width="8" height="13" viewBox="0 0 8 13" className="w-[8px] h-[13px] block">
      <path d="M2.812 0H0v13h8V4.497c0-.8-.336-1.53-.876-2.034L5 0H2.812Z" fill="#fff"/>
    </svg>
  </span>
);

export default function ChatPortal() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastSendRef = useRef<number>(0);
  const rafScrollRef = useRef<number | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    if (rafScrollRef.current !== null) cancelAnimationFrame(rafScrollRef.current);
    rafScrollRef.current = requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
      }
      rafScrollRef.current = null;
    });
  }, []);

  // Restore session if active in sessionStorage
  useEffect(() => {
    try {
      const savedPhone = sessionStorage.getItem('bioniq_phone');
      const savedThreadId = sessionStorage.getItem('bioniq_thread_id');
      if (savedPhone && savedThreadId) {
        initSession(savedPhone);
      } else {
        setLoadingSession(false);
      }
    } catch {
      setLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      scrollToBottom(false);
    }
  }, [messages, isConnected, scrollToBottom]);

  const initSession = async (userPhone: string, userName?: string) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: userPhone, name: userName }),
      });
      if (!res.ok) throw new Error('Failed to load session');
      const data = await res.json();
      
      setCustomer(data.customer);
      setThreadId(data.threadId);
      
      // Parse dates from string to Date objects
      const parsedMsgs: Message[] = data.messages.map((m: any) => ({
        id: m.id,
        text: m.text,
        sender: m.sender as 'user' | 'bot' | 'agent',
        timestamp: new Date(m.timestamp),
        status: m.status as MessageStatusType,
      }));

      // Add default quick replies if no messages yet
      if (parsedMsgs.length === 0) {
        parsedMsgs.push({
          id: 'greeting',
          text: `👋 Hello! Welcome to Bioniq Support. I'm your AI assistant, ready to help you with:\n\n🔒 Account security & verification\n🛠️ Technical support & installation\n📦 Package tracking & orders\n💬 General inquiries\n\nHow can I assist you today?`,
          sender: 'bot',
          timestamp: new Date(),
          status: 'read',
          quickReplies: ['Check my internet speed', 'Track my order', 'Installation help', 'Speaks to human agent'],
        });
      }

      setMessages(parsedMsgs);
      setIsConnected(true);

      // Persist in session storage
      sessionStorage.setItem('bioniq_phone', userPhone);
      sessionStorage.setItem('bioniq_thread_id', data.threadId);
    } catch (err) {
      console.error(err);
      alert('Error connecting to Bioniq Support database. Please try again.');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoadingSession(true);
    initSession(phone.trim(), name.trim());
  };

  const handleDisconnect = () => {
    sessionStorage.removeItem('bioniq_phone');
    sessionStorage.removeItem('bioniq_thread_id');
    setIsConnected(false);
    setCustomer(null);
    setThreadId(null);
    setMessages([]);
  };

  const streamAgentResponse = async (userText: string) => {
    if (!threadId || !customer) return;

    setIsBotTyping(true);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const streamMsgId = `stream-${crypto.randomUUID()}`;

    setMessages(prev => [...prev, {
      id: streamMsgId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      status: 'read',
    }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          threadId,
          customerId: customer.id,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          
          // Check for Vercel AI SDK text-delta stream prefix: "0:"
          if (line.startsWith('0:')) {
            try {
              const raw = line.slice(2).trim();
              const chunk = JSON.parse(raw);
              accumulated += chunk;
              setMessages(prev => prev.map(m =>
                m.id === streamMsgId ? { ...m, text: accumulated } : m
              ));
            } catch {
              continue;
            }
          }
        }
      }

      const finalText = accumulated.trim() || "I'm here to help! Could you rephrase that?";
      setMessages(prev => prev.map(m =>
        m.id === streamMsgId
          ? { ...m, text: finalText, id: crypto.randomUUID(), status: 'read' as const }
          : m
      ));
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setMessages(prev => prev.filter(m => m.id !== streamMsgId));
        return;
      }
      console.error('Streaming error:', err);
      setMessages(prev => prev.map(m =>
        m.id === streamMsgId
          ? { ...m, text: '⚠️ I\'m having trouble connecting right now. Please check your connection and try again.', id: crypto.randomUUID(), status: 'read' as const }
          : m
      ));
    } finally {
      setIsBotTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = Date.now();
    if (now - lastSendRef.current < 400) return; // rate limit spam guard
    lastSendRef.current = now;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === userMessage.id ? { ...m, status: 'read' } : m));
    }, 1000);

    streamAgentResponse(text);
  };

  if (loadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#eae6df]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#075e54] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#54656f] font-medium">Connecting to Bioniq Secure Channel...</p>
        </div>
      </div>
    );
  }

  // 1. Render Login/Onboarding Form
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#075e54] flex items-center justify-center text-white text-2xl font-bold">
              B
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-[#111b21] mb-2">Bioniq Support Chat</h2>
          <p className="text-center text-sm text-[#54656f] mb-6">
            Connect with our AI Support Assistant via our secure messaging gateway.
          </p>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-[#54656f] mb-1">
                WhatsApp Phone Number
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 555 010 0123"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#075e54] text-[#111b21]"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[#54656f] mb-1">
                Your Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#075e54] text-[#111b21]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#075e54] hover:bg-[#054c43] text-white py-2.5 rounded-md font-semibold transition duration-150 shadow-md hover:shadow-lg active:scale-95"
            >
              Start Chat Session
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#f8f9fa] rounded-md border border-gray-100">
            <h4 className="text-xs font-bold text-[#54656f] flex items-center gap-1.5 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#f59e0b]" /> Quick Testing Tip
            </h4>
            <p className="text-[11px] text-[#54656f] leading-relaxed">
              Use a seeded phone number to reload an existing customer profile:
              <br />
              💡 <span className="font-semibold text-gray-700">+1 555 010 0123</span> (John Doe)
              <br />
              💡 <span className="font-semibold text-gray-700">+1 555 010 5678</span> (Chantelle Le Roux)
              <br />
              💡 <span className="font-semibold text-gray-700">+1 555 010 9876</span> (Sarah Ndlovu)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render WhatsApp Chat Client
  return (
    <div className="fixed inset-0 bg-[#f0f2f5] sm:bg-[#eae6df] flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[#eae6df] overflow-hidden shadow-2xl w-full h-full sm:max-w-[420px] sm:h-[90vh] sm:rounded-[5px] flex flex-col border-0">
        
        {/* Header */}
        <div className="bg-[#075e54] text-white flex items-center gap-2 px-[10px] py-[8px] flex-shrink-0" style={{ minHeight: 56 }}>
          <button onClick={handleDisconnect} className="p-[6px] hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-white">
            {customer?.name?.substring(0, 1) || 'B'}
          </div>

          <div className="flex-1 min-w-0 -mt-px">
            <h3 className="font-medium text-white text-[16px] leading-[21px] truncate">Bioniq Support</h3>
            <div className="flex items-center gap-[3px] text-[12px] leading-[16px] text-[#a9c5c1] mt-[-1px]">
              <span className="w-[8px] h-[8px] bg-[#25d366] rounded-full inline-block flex-shrink-0" />
              <span>online support agent</span>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <button className="p-[7px] hover:bg-white/10 rounded-full transition-colors">
              <Video className="w-[22px] h-[22px]" />
            </button>
            <button className="p-[7px] hover:bg-white/10 rounded-full transition-colors">
              <Phone className="w-[22px] h-[22px]" />
            </button>
            <button className="p-[7px] hover:bg-white/10 rounded-full transition-colors">
              <MoreVertical className="w-[22px] h-[22px]" />
            </button>
          </div>
        </div>

        {/* Message Window */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto wa-scroll px-[9px] py-[8px] space-y-[3px] wa-bg"
        >
          <div className="bg-[#fef3c7] text-[#5e541d] text-[12px] leading-[17px] text-center py-[6px] px-3 rounded-[6px] mb-[6px] border border-[#f4d75a] mx-auto max-w-[92%]">
            🔒 This session is logged in our database under customer: *{customer?.name}*. Messages are end-to-end secure.
          </div>

          {messages.map((message) => {
            const isUser = message.sender === 'user';
            const isStreaming = message.id.startsWith('stream-');
            const isAgent = message.sender === 'agent';

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} wa-msg-in`}
              >
                <div className="w-[15%] flex-shrink-0" />

                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  {/* Bubble */}
                  <div
                    className={`relative px-[8px] pt-[6px] pb-[8px] rounded-[7.5px] ${
                      isUser
                        ? 'bg-[#d9fdd3] rounded-br-[2px] shadow-[0_1px_0.5px_rgba(0,0,0,0.06)]'
                        : isAgent
                        ? 'bg-[#e7f2f8] rounded-bl-[2px] border border-[#d1e5f0] shadow-[0_1px_0.5px_rgba(0,0,0,0.06)]'
                        : 'bg-white rounded-bl-[2px] shadow-[0_1px_0.5px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {isUser ? <TailSent /> : <TailReceived />}

                    {isAgent && (
                      <div className="text-[10px] text-[#075e54] font-bold mb-0.5 select-none">
                        Support Representative
                      </div>
                    )}

                    <span className="whitespace-pre-line text-[14px] leading-[19px] break-words [word-break:break-word] text-[#111b21]">
                      {message.text}
                      {isStreaming && !message.text && (
                        <span className="inline-block w-[4px] h-[13px] bg-[#667781] ml-[2px] animate-pulse align-text-bottom rounded-[1px]" />
                      )}
                    </span>

                    {/* Timestamp */}
                    <div className={`flex items-end justify-end mt-[2px] ${isStreaming && !message.text ? 'hidden' : ''}`}>
                      <span className="inline-flex items-center gap-[3px] text-[10px] leading-[14px] whitespace-nowrap">
                        <span className={isUser ? 'text-[#8696a0]' : 'text-[#667781]'}>
                          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                        {isUser && (
                          <>
                            {message.status === 'sending' && (
                              <svg className="w-[12px] h-[12px] text-[#8696a0] animate-spin" viewBox="0 0 16 16" width="16" height="16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round"/>
                              </svg>
                            )}
                            {message.status === 'sent' && <CheckIcon className="w-[12px] h-[9px] text-[#8696a0]" />}
                            {message.status === 'delivered' && <DoubleCheckIcon className="w-[12px] h-[9px] text-[#8696a0]" />}
                            {message.status === 'read' && <DoubleCheckIcon className="w-[12px] h-[9px] text-[#53bdeb]" />}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Quick replies */}
                  {message.quickReplies && !isStreaming && (
                    <div className={`flex flex-wrap gap-[6px] mt-[3px] ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {message.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleSendMessage(reply)}
                          disabled={isBotTyping}
                          className="px-[12px] py-[6px] bg-[#f0f2f5] text-[#075e54] text-[13px] leading-[17px] rounded-full border border-[#e9edef] hover:bg-[#e1e7ea] active:bg-[#d4d9dc] transition-all duration-150 shadow-[0_1px_1px_rgba(0,0,0,0.03)]"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing dots */}
          {isBotTyping && !messages.some(m => m.id.startsWith('stream-')) && <TypingDots />}
        </div>

        {/* Input Composer */}
        <div className="bg-[#f0f2f5] px-[8px] py-[6px] flex-shrink-0">
          <div className="flex items-center gap-[4px] bg-white rounded-[24px] px-[5px] py-[4px] shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
            <button className="p-[8px] text-[#54656f] hover:text-[#075e54] transition-colors rounded-full flex-shrink-0">
              <Smile className="w-[22px] h-[22px]" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              placeholder="Message"
              className="flex-1 outline-none text-[15px] leading-[20px] bg-transparent min-w-0 placeholder-[#667781] py-[6px] text-black"
            />
            <button className="p-[8px] text-[#54656f] hover:text-[#075e54] transition-colors rounded-full flex-shrink-0">
              <Paperclip className="w-[22px] h-[22px] -rotate-[30deg]" />
            </button>
            {inputText.trim() ? (
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={isBotTyping}
                className="w-[36px] h-[36px] bg-[#00a884] text-white rounded-full flex items-center justify-center hover:bg-[#06cf9c] transition-colors disabled:opacity-40 flex-shrink-0 active:scale-95"
              >
                <Send className="w-[18px] h-[18px] -ml-[1px]" />
              </button>
            ) : (
              <button className="p-[8px] text-[#54656f] hover:text-[#075e54] transition-colors rounded-full flex-shrink-0">
                <Mic className="w-[22px] h-[22px]" />
              </button>
            )}
          </div>
        </div>

        {/* Branding Footer */}
        <div className="bg-[#f0f2f5] text-center text-[10px] text-[#667781] py-[4px] flex-shrink-0 select-none border-t border-[#e9edef]">
          Bioniq · Independent Enterprise Support Portal
        </div>
      </div>
    </div>
  );
}
