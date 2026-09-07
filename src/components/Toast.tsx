import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 max-w-[340px] w-[90%] pointer-events-auto"
        >
          <div className="bg-[#001f3f] text-white px-4 py-2.5 rounded-xl shadow-xl border border-white/10 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#FF8C00] flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
              )}
              <span className="font-medium">{message}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
