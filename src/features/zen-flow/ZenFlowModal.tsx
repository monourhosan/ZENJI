import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ZenFlowGame } from './ZenFlowGame';

interface ZenFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZenFlowModal: React.FC<ZenFlowModalProps> = ({ isOpen, onClose }) => {
  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Zen Flow Challenge"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#fafafa] dark:bg-[#0c0c0f] border border-neutral-200 dark:border-white/10 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl text-neutral-900 dark:text-neutral-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors z-20 cursor-pointer"
          aria-label="Close Zen Flow Challenge"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Game Feature Controller */}
        <ZenFlowGame onClose={onClose} />
      </div>
    </div>
  );
};
