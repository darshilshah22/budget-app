import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-900 text-left shadow-2xl transition-all animate-scale-in border border-gray-800">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors duration-200 hover-button z-10"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className="px-6 pt-6 pb-4">
              <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 