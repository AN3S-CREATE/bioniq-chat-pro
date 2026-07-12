import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Paperclip, Mic, Smile } from 'lucide-react';

// Configure via VITE_AGENT_ID env variable in .env.local for local dev;
// for production builds, set it in your CI/CD secrets and pass via esbuild define.
const AGENT_ID = (typeof __AGENT_ID__ !== 'undefined' ? __AGENT_ID__ : '01K8BSAKNHPDZHBSZ3RV4DK9E9') as string;
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
  onClose: () => void;
  onFeedbackRequest?: () => void;
}

// Lazy initialiser: timestamp is set when the component first mounts (via
// useState initialiser below), not at module-load time — avoids stale clock.
const makeInitialGreeting = (): Message => ({
  id: '1',
  text: '👋 Hello! Welcome to Bioniq Support. I\'m your AI assistant, ready to help you with:\n\n🔒 Account security & verification\n🛠️ Technical support & installation\n📦 Package tracking & orders\n💬 General inquiries\n\nHow can I assist you today?',
  sender: 'bot',
  timestamp: new Date(),
  status: 'read',
  quickReplies: ['Check my internet speed', 'Track my order', 'Installation help', 'Account security', 'Speak to human agent'],
});

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

export const FullScreenWhatsApp: React.FC<FullScreenWhatsAppProps> = ({ onClose, onFeedbackRequest }) => {
  // Lazy initialiser: creates the greeting (with current timestamp) only on mount
  const [messages, setMessages] = useState<Message[]>(() => [makeInitialGreeting()]);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  // Persist convoId in sessionStorage so a hard reload reuses the same session
  // instead of creating an orphaned conversation on the Taskade backend.
  const [convoId, setConvoId] = useState<string | null>(() => {
    try { return sessionStorage.getItem('bioniq_convo_id'); } catch { return null; }
  });
  const [convoReady, setConvoReady] = useState<boolean>(() => {
    try { return !!sessionStorage.getItem('bioniq_convo_id'); } catch { return false; }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const convoStartedRef = useRef(!!convoId); // Skip init if already restored from storage
  // Rate-limit guard: prevents spam by enforcing a 300ms cooldown between sends.
  const lastSendRef = useRef<number>(0);
  const lastSentRef = useRef<number>(0); // Rate-limit guard

  const rafScrollRef = useRef<number | null>(null);
  const scrollToBottom = useCallback((smooth = true) => {
    // Debounce via requestAnimationFrame — prevents main-thread blocking when
    // scrollToBottom fires on every SSE streaming chunk (dozens of times/sec).
    if (rafScrollRef.current !== null) cancelAnimationFrame(rafScrollRef.current);
    rafScrollRef.current = requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
      }
      rafScrollRef.current = null;
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping, scrollToBottom]);

  useEffect(() => {
    if (convoStartedRef.current) return;
    convoStartedRef.current = true;
    let cancelled = false;

    async function createConversation(attempt = 1): Promise<void> {
      try {
        const res = await fetch(`${API_BASE}/agents/${AGENT_ID}/public-conversations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const id: string = data.conversationId;
          // Persist so a page reload can resume the same session
          try { sessionStorage.setItem('bioniq_convo_id', id); } catch { /* storage unavailable */ }
          setConvoId(id);
          setConvoReady(true);
        }
      } catch (err) {
        if (cancelled) return;
        if (attempt < 3) {
          // Exponential backoff: 2s, 4s
          await new Promise(r => setTimeout(r, attempt * 2000));
          if (!cancelled) return createConversation(attempt + 1);
        } else {
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

  // Memoize so the filter+map does not re-run on every render triggered by
  // streaming chunks. Only recomputes when the messages array changes.
  // Returns the array value directly (not a factory function).
  const apiHistory = useMemo<ApiMessage[]>(
    () =>
      messages
        .filter(m => !m.id.startsWith('stream-'))
        .map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.text,
        })),
    [messages],
  );

  const streamAgentResponse = async (userText: string) => {
    if (!convoId) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
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

    // Cap history to last 20 entries (10 exchanges) to control token costs
    const history = apiHistory.slice(-20);
    const streamMsgId = `stream-${crypto.randomUUID()}`;

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
          ? { ...m, text: finalText, id: crypto.randomUUID(), status: 'read' as const }
          : m
      ));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages(prev => prev.filter(m => m.id !== streamMsgId));
        return;
      }
      setMessages(prev => prev.map(m =>
        m.id === streamMsgId
          ? { ...m, text: '⚠️ I\'m having trouble connecting right now. Please try again in a moment.', id: crypto.randomUUID(), status: 'read' as const }
          : m
      ));
    } finally {
      setIsBotTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    // Rate-limit: block if called within 300ms of the last dispatch to
    // prevent rapid-fire spam against the Taskade API.
    const now = Date.now();
    if (now - lastSendRef.current < 300) return;
    lastSendRef.current = now;
    // Rate limit: ignore messages sent within 500 ms of the previous one
    const nowMs = Date.now();
    if (nowMs - lastSentRef.current < 500) return;
    lastSentRef.current = nowMs;
    const msgTime = new Date();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: msgTime,
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
{/* Keyframes moved to index.css */}

      <div className="bg-[#eae6df] overflow-hidden shadow-2xl w-full h-full sm:max-w-[420px] sm:h-[90vh] sm:rounded-[5px] flex flex-col border-0">
        {/* ── Header ── */}
        <div className="bg-[#075e54] text-white flex items-center gap-2 px-[10px] py-[8px] flex-shrink-0" style={{ minHeight: 56 }}>
          <button onClick={onClose} className="p-[6px] hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-[22px] h-[22px]" />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0 overflow-hidden">
            {/* Logo: local asset preferred; falls back to CDN if not yet bundled */}
            <img
              src="/assets/bioniq-logo.png"
              alt="Bioniq Logo"
              width={40}
              height={40}
              loading="lazy"
              className="w-full h-full object-contain p-[3px]"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.src.includes('iili.io')) {
                  img.src = 'https://iili.io/K7aquNS.png';
                } else {
                  img.style.display = 'none';
                }
              }}
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
          className="flex-1 overflow-y-auto wa-scroll px-[9px] py-[8px] space-y-[3px] wa-bg"
        >
          {/* E2E notice — first render only */}
          {messages.length === 1 && messages[0].id === '1' && (
            <div className="bg-[#fef3c7] text-[#5e541d] text-[12.5px] leading-[18px] text-center py-[6px] px-3 rounded-[6px] mb-[6px] border border-[#f4d75a] mx-auto max-w-[92%]">
              🔒 Messages are end-to-end encrypted. No one outside of this chat can read or listen to them.
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.sender === 'user';
            const isStreaming = message.id.startsWith('stream-');
            const bubbleText = message.text;

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} wa-msg-in`}
              >
                {/* Spacer on the opposite side so bubbles don't stretch full width */}
                <div className="w-[15%] flex-shrink-0" />

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

                    <span className="whitespace-pre-line text-[14.2px] leading-[19px] break-words [word-break:break-word] text-[#111b21]">
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
                      {message.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="px-[12px] py-[7px] bg-[#f0f2f5] text-[#075e54] text-[13.5px] leading-[18px] rounded-full border border-[#e9edef] hover:bg-[#e1e7ea] active:bg-[#d4d9dc] active:scale-[0.97] transition-all duration-150 shadow-[0_1px_1px_rgba(0,0,0,0.03)]"
                          disabled={isBotTyping}
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
              // Do NOT fully disable the input while streaming — user should be
              // able to compose their next message (NEW-005 UX fix).
              // The send button remains disabled until streaming is complete.
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
