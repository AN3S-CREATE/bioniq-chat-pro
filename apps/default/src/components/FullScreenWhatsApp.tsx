import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Paperclip, Mic, Smile } from 'lucide-react';

const AGENT_ID = '01K8BSAKNHPDZHBSZ3RV4DK9E9';
const API_BASE = '/api/taskade';

type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: MessageStatusType;
  quickReplies?: string[];
}

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface FullScreenWhatsAppProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackRequest?: () => void;
}

const INITIAL_GREETING: Message = {
  id: '1',
  text: '👋 Hello! Welcome to Bioniq Support. I\'m your AI assistant, ready to help you with:\n\n🔒 Account security & verification\n🛠️ Technical support & installation\n📦 Package tracking & orders\n💬 General inquiries\n\nHow can I assist you today?',
  sender: 'bot',
  timestamp: new Date(),
  status: 'read',
  quickReplies: ['Check my internet speed', 'Track my order', 'Installation help', 'Account security', 'Speak to human agent'],
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Bubble tail SVGs — matched to WhatsApp's exact shape              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export const FullScreenWhatsApp: React.FC<FullScreenWhatsAppProps> = ({ isOpen, onClose, onFeedbackRequest }) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [convoId, setConvoId] = useState<string | null>(null);
  const [convoReady, setConvoReady] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const convoStartedRef = useRef(false);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping, scrollToBottom]);

  useEffect(() => {
    if (convoStartedRef.current) return;
    convoStartedRef.current = true;
    let cancelled = false;
    async function createConversation() {
      try {
        const res = await fetch(`${API_BASE}/agents/${AGENT_ID}/public-conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setConvoId(data.conversationId);
          setConvoReady(true);
        }
      } catch {
        if (!cancelled) {
          setConvoReady(false);
        }
      }
    }
    createConversation();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  if (!isOpen) return null;

  const buildApiHistory = (): ApiMessage[] => {
    return messages
      .filter(m => !m.id.startsWith('stream-'))
      .map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }));
  };

  const streamAgentResponse = async (userText: string) => {
    if (!convoId) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: '⚠️ I\'m having trouble connecting right now. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
      }]);
      return;
    }

    setIsBotTyping(true);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const history = buildApiHistory();
    const streamMsgId = `stream-${Date.now()}`;

    setMessages(prev => [...prev, {
      id: streamMsgId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      status: 'read',
    }]);

    try {
      const res = await fetch(
        `${API_BASE}/agents/${AGENT_ID}/public-conversations/${convoId}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: userText }],
            history,
          }),
          signal: controller.signal,
        }
      );

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
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          try {
            const event = JSON.parse(raw);
            if (event.type === 'text-delta') {
              accumulated += event.delta || '';
              setMessages(prev => prev.map(m =>
                m.id === streamMsgId ? { ...m, text: accumulated } : m
              ));
            } else if (event.type === 'finish') {
              break;
            } else if (event.type === 'error') {
              throw new Error(event.errorText || 'Agent error');
            }
          } catch {
            continue;
          }
        }
      }

      const finalText = accumulated.trim() || 'I\'m here to help! Could you rephrase that?';

      setMessages(prev => prev.map(m =>
        m.id === streamMsgId
          ? { ...m, text: finalText, id: Date.now().toString(), status: 'read' as const }
          : m
      ));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages(prev => prev.filter(m => m.id !== streamMsgId));
        return;
      }
      setMessages(prev => prev.map(m =>
        m.id === streamMsgId
          ? { ...m, text: '⚠️ I\'m having trouble connecting right now. Please try again in a moment.', id: Date.now().toString(), status: 'read' as const }
          : m
      ));
    } finally {
      setIsBotTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: now,
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    inputRef.current?.focus();

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 350);

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 800);

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 1600);

    streamAgentResponse(text);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-0 sm:p-4">
      <style>{`
        @keyframes wa-dot { 0%,60%,100% { opacity:0.3; transform:scale(1); } 30% { opacity:1; transform:scale(1.3); } }
        @keyframes wa-msg-in { from { opacity:0; transform:translateY(6px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .wa-msg-in { animation: wa-msg-in 0.18s ease-out; }
        .wa-scroll { scroll-behavior:smooth; -webkit-overflow-scrolling:touch; }
      `}</style>

      <div className="bg-[#eae6df] overflow-hidden shadow-2xl w-full h-full sm:max-w-[420px] sm:h-[90vh] sm:rounded-[5px] flex flex-col border-0">
        {/* ── Header ── */}
        <div className="bg-[#075e54] text-white flex items-center gap-2 px-[10px] py-[8px] flex-shrink-0" style={{ minHeight: 56 }}>
          <button onClick={onClose} className="p-[6px] hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0 overflow-hidden">
            <img
              src="https://iili.io/K7aquNS.png"
              alt="Bioniq Logo"
              className="w-full h-full object-contain p-[3px]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <div className="flex-1 min-w-0 -mt-px">
            <h3 className="font-medium text-white text-[16px] leading-[21px] truncate">Bioniq Support</h3>
            <div className="flex items-center gap-[3px] text-[12px] leading-[16px] text-[#a9c5c1] mt-[-1px]">
              <span className="w-[8px] h-[8px] bg-[#25d366] rounded-full inline-block flex-shrink-0" />
              <span>online</span>
              <span className="text-[#667781] mx-[2px]">·</span>
              <span>Good</span>
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

        {/* ── Messages ── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto wa-scroll px-[9px] py-[8px] space-y-[3px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d0c9bf' fill-opacity='0.35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#eae6df',
          }}
        >
          {/* E2E notice — first render only */}
          {messages.length === 1 && messages[0].id === '1' && (
            <div className="bg-[#fef3c7] text-[#5e541d] text-[12.5px] leading-[18px] text-center py-[6px] px-3 rounded-[6px] mb-[6px] border border-[#f4d75a] mx-auto max-w-[92%]">
              🔒 Messages are end-to-end encrypted. No one outside of this chat can read or listen to them.
            </div>
          )}

          {messages.map((message, idx) => {
            const isUser = message.sender === 'user';
            const isStreaming = message.id.startsWith('stream-');
            const bubbleText = message.text;

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} wa-msg-in`}
              >
                {/* Spacer on the opposite side so bubbles don't stretch full width */}
                <div className={isUser ? 'w-[15%] flex-shrink-0' : 'w-[15%] flex-shrink-0'} />

                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  {/* Bubble */}
                  <div
                    className={`relative px-[8px] pt-[6px] pb-[8px] rounded-[7.5px] ${
                      isUser
                        ? 'bg-[#d9fdd3] rounded-br-[2px] shadow-[0_1px_0.5px_rgba(0,0,0,0.06)]'
                        : 'bg-white rounded-bl-[2px] shadow-[0_1px_0.5px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {isUser ? <TailSent /> : <TailReceived />}

                    <span className={`whitespace-pre-line text-[14.2px] leading-[19px] break-words [word-break:break-word] ${
                      isUser ? 'text-[#111b21]' : 'text-[#111b21]'
                    }`}>
                      {bubbleText}
                      {isStreaming && !bubbleText && (
                        <span className="inline-block w-[4px] h-[13px] bg-[#667781] ml-[2px] animate-pulse align-text-bottom rounded-[1px]" />
                      )}
                    </span>

                    {/* Timestamp row */}
                    <div className={`flex items-end justify-end mt-[2px] ${isStreaming && !bubbleText ? 'hidden' : ''}`}>
                      <span className="inline-flex items-center gap-[3px] text-[11px] leading-[15px] whitespace-nowrap">
                        <span className={isUser ? 'text-[#8696a0]' : 'text-[#667781]'}>
                          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                        {isUser && (
                          <>
                            {message.status === 'sending' && (
                              <svg className="w-[14px] h-[14px] text-[#8696a0] animate-spin" viewBox="0 0 16 16" width="16" height="16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round"/>
                              </svg>
                            )}
                            {message.status === 'sent' && <CheckIcon className="w-[14px] h-[10px] text-[#8696a0]" />}
                            {message.status === 'delivered' && <DoubleCheckIcon className="w-[14px] h-[10px] text-[#8696a0]" />}
                            {message.status === 'read' && <DoubleCheckIcon className="w-[14px] h-[10px] text-[#53bdeb]" />}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Quick replies */}
                  {message.quickReplies && !isStreaming && (
                    <div className={`flex flex-wrap gap-[6px] mt-[3px] ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="px-[12px] py-[7px] bg-[#f0f2f5] text-[#075e54] text-[13.5px] leading-[18px] rounded-full border border-[#e9edef] hover:bg-[#e1e7ea] active:bg-[#d4d9dc] active:scale-[0.97] transition-all duration-150 shadow-[0_1px_1px_rgba(0,0,0,0.03)]"
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

          {/* Typing indicator */}
          {isBotTyping && !messages.some(m => m.id.startsWith('stream-')) && <TypingDots />}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Composer ── */}
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
              className="flex-1 outline-none text-[15px] leading-[20px] bg-transparent min-w-0 placeholder-[#667781] py-[6px]"
              disabled={isBotTyping}
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

        {/* ── Feedback bar ── */}
        {onFeedbackRequest && (
          <div className="bg-[#e7f2f8] border-t border-[#d1e5f0] px-4 py-[9px]">
            <button
              onClick={onFeedbackRequest}
              className="w-full text-center text-[#075e54] text-[13px] font-medium hover:text-[#025c4c] transition-colors"
            >
              💬 How was your experience? Share feedback
            </button>
          </div>
        )}

        {/* ── Branding ── */}
        <div className="bg-[#f0f2f5] text-center text-[11px] text-[#667781] py-[4px] flex-shrink-0 select-none">
          Bioniq · WhatsApp Business
        </div>
      </div>
    </div>
  );
};
