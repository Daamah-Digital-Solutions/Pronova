import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

/**
 * Pronova AI assistant — floating chat widget wired to the n8n webhook.
 *
 * Contract:
 *   POST https://ai.capimaxgroup.com/webhook/pronova/chat
 *   body { action: 'sendMessage', sessionId, chatInput }
 *   resp { output: '<assistant reply>' }
 * CORS is pre-enabled server-side for the pronova domains.
 *
 * sessionId is stable per browser (persisted in localStorage) so the assistant's
 * rolling memory (last ~12 messages) survives client-side route changes.
 */
const CHAT_ENDPOINT = 'https://ai.capimaxgroup.com/webhook/pronova/chat';
const SESSION_KEY = 'pronova_chat_session';

const WELCOME =
  "Hi! I'm the Pronova assistant 👋 Ask me anything about PRN, the pre-sale, the ecosystem, or how to use the token.";

function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        (window.crypto && window.crypto.randomUUID && window.crypto.randomUUID()) ||
        'sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch (e) {
    return 'sess-' + Date.now().toString(36);
  }
}

const ChatbotWidget = () => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sessionIdRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  if (!sessionIdRef.current) sessionIdRef.current = getSessionId();

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, isOpen]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: sessionIdRef.current,
          chatInput: text,
        }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      // n8n may return an object or a single-element array; also tolerate plain text.
      const raw = await res.text();
      let reply = '';
      try {
        const data = JSON.parse(raw);
        const payload = Array.isArray(data) ? data[0] : data;
        reply =
          (payload && (payload.output ?? payload.reply ?? payload.text)) ??
          (typeof data === 'string' ? data : '');
      } catch (_) {
        reply = raw;
      }
      reply = (reply || '').toString().trim() || "I didn't catch a response — please try again.";
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: "Sorry — I couldn't reach the assistant right now. Please try again in a moment.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Launcher button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-2xl hover:shadow-neon flex items-center justify-center border border-primary-400/30"
        aria-label={isOpen ? 'Close chat' : 'Open chat with the Pronova assistant'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <FaTimes size={22} /> : <FaCommentDots size={24} />}
          </motion.span>
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary-500/40 blur-md -z-10 animate-pulse" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed z-[9999] flex flex-col overflow-hidden shadow-2xl border
              bottom-0 right-0 w-full h-[85vh] rounded-t-2xl
              sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[560px] sm:max-h-[75vh] sm:rounded-2xl
              ${darkMode ? 'bg-dark-900 border-primary-600/30' : 'bg-white border-gray-200'}`}
            role="dialog"
            aria-label="Pronova assistant chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <FaRobot size={18} />
                </div>
                <div className="leading-tight">
                  <div className="font-heading font-semibold">Pronova Assistant</div>
                  <div className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/15 transition-colors"
                aria-label="Close chat"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-br-md'
                        : m.error
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 rounded-bl-md'
                        : darkMode
                        ? 'bg-dark-800 text-gray-200 border border-primary-600/15 rounded-bl-md'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className={`px-4 py-3 rounded-2xl rounded-bl-md ${
                      darkMode ? 'bg-dark-800 border border-primary-600/15' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <span className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="w-2 h-2 rounded-full bg-primary-500/70 animate-bounce"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className={`flex-shrink-0 p-3 border-t ${
                darkMode ? 'border-primary-600/20 bg-dark-900' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Type your message…"
                  className={`flex-1 resize-none max-h-28 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors ${
                    darkMode
                      ? 'bg-dark-800 text-white border border-primary-600/25 focus:border-primary-500 placeholder-gray-500'
                      : 'bg-gray-50 text-gray-900 border border-gray-300 focus:border-primary-500 placeholder-gray-400'
                  }`}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-neon transition-all"
                  aria-label="Send message"
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
              <p className={`mt-2 text-[11px] text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                AI assistant — replies may not always be accurate.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
