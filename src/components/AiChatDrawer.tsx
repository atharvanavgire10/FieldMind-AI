import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  X,
  BookOpen,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { FieldMindMark } from './BrandMark';
import { ChatMessage } from '../types';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId?: string;
  errorCode?: string;
  currentStepIndex?: number;
  initialPrompt?: string;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  equipmentId = 'eq-hvac-a',
  errorCode = 'E04',
  currentStepIndex = 0,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello Alex! I am **FieldMind Assistant**, grounded in the OEM technical documentation and OSHA safety protocols for **HVAC Unit A (TitanAir RTU-10X)** and active alarm **${errorCode}**.\n\nHow can I guide your inspection or procedure right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['TitanAir RTU-10X O&M Manual Section 8.4', 'OSHA 1910.147 LOTO Guidelines'],
      suggestedActions: [
        'What should I check first?',
        'Why did this error occur?',
        'Show me the maintenance procedure.',
        'Summarize this job.',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Trigger initial prompt if provided
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          equipmentId,
          errorCode,
          currentStepIndex,
        }),
      });

      if (!res.ok) throw new Error('Chat API error');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        suggestedActions: data.suggestedFollowUps || [
          'What should I check first?',
          'Why did this error occur?',
          'Show me the maintenance procedure.',
          'Summarize this job.',
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Operating in offline knowledge mode. For **${errorCode}** on this equipment, always ensure the 460V disconnect is locked out before inspecting return filters or condenser coils.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: ['Local Knowledge Base Cache'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-panel border border-deck-300 bg-deck-50 shadow-2xl transition-all duration-300 overflow-hidden no-print ${
        isMinimized
          ? 'h-14 w-80'
          : 'h-[580px] w-[95vw] max-w-[420px] sm:w-[420px]'
      }`}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-chassis-700 bg-chassis-900 px-4 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-plate bg-chassis-800 text-deck-50 ring-1 ring-chassis-600">
            <FieldMindMark size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">FieldMind Assistant</span>
              <span className="h-1.5 w-1.5 rounded-full bg-verified-500" />
            </div>
            <span className="text-[10px] text-deck-50/50 font-mono uppercase tracking-wider">
              Grounded &middot; {errorCode} context
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expand assistant' : 'Minimize assistant'}
            className="flex h-7 w-7 items-center justify-center rounded-plate text-deck-50/55 hover:bg-chassis-800 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={onClose}
            aria-label="Close assistant"
            className="flex h-7 w-7 items-center justify-center rounded-plate text-deck-50/55 hover:bg-chassis-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-deck-100">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-panel p-3.5 leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-chassis-900 text-white rounded-br-xs'
                        : 'bg-deck-50 border border-deck-300 text-ink-800 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Sources Citation Pill */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 border-t border-deck-200 pt-2 text-[10px] text-signal-700 font-medium flex items-start gap-1">
                        <BookOpen className="h-3 w-3 shrink-0 mt-0.5" />
                        <span className="italic">Grounded: {msg.sources.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[9px] text-ink-400">{msg.timestamp}</span>

                  {/* Suggested Follow-up Chips */}
                  {msg.suggestedActions && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="rounded-full border border-deck-300 bg-deck-50 px-2.5 py-1 text-[10px] font-semibold text-signal-700 hover:border-signal-600/40 hover:bg-signal-100 transition shadow-xs"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-signal-700 font-medium">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-signal-500 border-t-transparent" />
                <span>Checking the manual for this alarm&hellip;</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Bar */}
          <div className="border-t border-deck-300 bg-deck-100 p-2 overflow-x-auto flex gap-1.5 scrollbar-none">
            <button
              onClick={() => handleSendMessage('What should I check first?')}
              className="shrink-0 rounded-plate bg-deck-50 border border-deck-300 px-2 py-1 text-[10px] font-medium text-ink-700 hover:text-signal-700 hover:border-signal-600/30 shadow-xs"
            >
              What should I check first?
            </button>
            <button
              onClick={() => handleSendMessage('Why did this error occur?')}
              className="shrink-0 rounded-plate bg-deck-50 border border-deck-300 px-2 py-1 text-[10px] font-medium text-ink-700 hover:text-signal-700 hover:border-signal-600/30 shadow-xs"
            >
              Why did this error occur?
            </button>
            <button
              onClick={() => handleSendMessage('Show me the maintenance procedure.')}
              className="shrink-0 rounded-plate bg-deck-50 border border-deck-300 px-2 py-1 text-[10px] font-medium text-ink-700 hover:text-signal-700 hover:border-signal-600/30 shadow-xs"
            >
              Show procedure
            </button>
            <button
              onClick={() => handleSendMessage('Summarize this job.')}
              className="shrink-0 rounded-plate bg-deck-50 border border-deck-300 px-2 py-1 text-[10px] font-medium text-ink-700 hover:text-signal-700 hover:border-signal-600/30 shadow-xs"
            >
              Summarize job
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-deck-300 p-3 bg-deck-50"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask FieldMind about this job..."
              className="flex-1 rounded-panel border border-deck-300 bg-deck-50 px-3.5 py-2 text-xs text-ink-900 placeholder-ink-400 focus:border-signal-500 focus:ring-1 focus:ring-signal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              aria-label="Send question"
              className="flex h-8 w-8 items-center justify-center rounded-panel bg-signal-500 text-chassis-950 transition hover:bg-signal-400 disabled:opacity-45 shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
