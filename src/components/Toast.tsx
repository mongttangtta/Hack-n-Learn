import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed bottom-10 right-10 bg-card-background border border-accent-primary1 text-primary-text px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
        >
          <CheckCircle className="text-accent-primary1 w-6 h-6" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{message}</p>
          </div>
          <button onClick={onClose} className="text-secondary-text hover:text-primary-text">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
