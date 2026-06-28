import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const PHONE = import.meta.env.VITE_CALLMEBOT_PHONE as string;

const ChatWidget: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <motion.a
        href={`https://wa.me/${PHONE}`}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="relative w-14 h-14 rounded-full bg-green-500 text-white shadow-2xl flex items-center justify-center focus:outline-none"
        aria-label="Open WhatsApp chat"
      >
        <MessageCircle className="w-7 h-7" />
        {/* Ripple ring */}
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping pointer-events-none" />
      </motion.a>
    </div>
  );
};

export default ChatWidget;
