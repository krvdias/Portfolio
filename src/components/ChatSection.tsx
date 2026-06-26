import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, CheckCheck, AlertCircle, X, ChevronDown, ExternalLink } from 'lucide-react';

interface Message {
  id: number;
  sender: 'visitor' | 'auto-reply';
  text: string;
  time: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const PHONE = import.meta.env.VITE_CALLMEBOT_PHONE as string;
const APIKEY = import.meta.env.VITE_CALLMEBOT_APIKEY as string;

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: 'auto-reply',
      text: "👋 Hey! I'm Vishan. Drop me a message and I'll get back to you on WhatsApp!",
      time: getTime(),
    },
  ]);
  const [status, setStatus] = useState<Status>('idle');
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear unread badge when opened
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendToWhatsApp = async (msgText: string, senderName: string, senderWa: string) => {
    const body =
      `📩 *New message from your Portfolio*%0A` +
      `👤 *Name:* ${encodeURIComponent(senderName)}%0A` +
      (senderWa ? `📱 *WhatsApp:* ${encodeURIComponent(senderWa)}%0A` : '') +
      `💬 *Message:* ${encodeURIComponent(msgText)}` +
      (senderWa
        ? `%0A%0A➡️ Reply: https://wa.me/${senderWa.replace(/\D/g, '')}`
        : '');

    const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${body}&apikey=${APIKEY}`;
    await fetch(url, { mode: 'no-cors' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || status === 'sending') return;

    setStatus('sending');
    const msgText = text.trim();

    const visitorMsg: Message = {
      id: Date.now(),
      sender: 'visitor',
      text: msgText,
      time: getTime(),
    };

    setMessages(prev => [...prev, visitorMsg]);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await sendToWhatsApp(msgText, name.trim(), waNumber.trim());
      setStatus('sent');
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'auto-reply',
            text: `Got it, ${name.split(' ')[0]}! ✅ I'll reply to you on WhatsApp soon.`,
            time: getTime(),
          },
        ]);
      }, 800);
    } catch {
      setStatus('error');
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'auto-reply',
            text: '⚠️ Hmm, something went wrong. You can reach me directly on WhatsApp.',
            time: getTime(),
          },
        ]);
      }, 800);
    }

    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Popup chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-popup"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-[340px] sm:w-[380px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col"
            style={{ maxHeight: '75vh' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg select-none">
                  V
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm leading-tight">Vishan Dias</p>
                <p className="text-white/70 text-xs">Typically replies within a few hours</p>
              </div>
              {/* Direct WhatsApp button */}
              <a
                href={`https://wa.me/${PHONE}`}
                target="_blank"
                rel="noreferrer"
                title="Message directly on WhatsApp"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white"
                aria-label="Open WhatsApp"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white"
                aria-label="Close chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50 dark:bg-gray-950 min-h-0">
              {/* Direct WhatsApp CTA strip */}
              <a
                href={`https://wa.me/${PHONE}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Message me directly on WhatsApp
              </a>
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'auto-reply' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-auto">
                        V
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                        msg.sender === 'visitor'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-1 flex items-center gap-1 ${
                        msg.sender === 'visitor' ? 'text-white/60 justify-end' : 'text-gray-400'
                      }`}>
                        {msg.time}
                        {msg.sender === 'visitor' && (
                          <CheckCheck className="w-3 h-3" />
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Details fields */}
            <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <AnimatePresence>
                {detailsVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 px-4 pt-3">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="WhatsApp No. (optional)"
                        value={waNumber}
                        onChange={e => setWaNumber(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message input row */}
              <form onSubmit={handleSend} className="flex items-end gap-2 p-3">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Type a message…"
                  value={text}
                  onFocus={() => setDetailsVisible(true)}
                  onChange={e => {
                    setText(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e as unknown as React.FormEvent);
                    }
                  }}
                  className="flex-1 resize-none px-3 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'sending' || !text.trim() || !name.trim()}
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                    status === 'sent'
                      ? 'bg-green-500 text-white scale-110'
                      : status === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100'
                  }`}
                >
                  {status === 'sending' ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : status === 'sent' ? (
                    <CheckCheck className="w-4 h-4" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>

              <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 pb-2">
                Powered by{' '}
                <a href="https://www.callmebot.com" target="_blank" rel="noreferrer" className="hover:underline">
                  CallMeBot
                </a>{' '}
                · messages go to Vishan's WhatsApp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB toggle button ── */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl flex items-center justify-center focus:outline-none"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Ripple ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping pointer-events-none" />
        )}
      </motion.button>

    </div>
  );
};

export default ChatWidget;
