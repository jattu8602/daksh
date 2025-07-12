import React from 'react';

export default function AIAgentModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative w-full h-full bg-white rounded-none flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-500 z-10"
          onClick={onClose}
          aria-label="Close AI Agent"
        >
          ×
        </button>
        {/* Modal content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
      {/* Overlay click closes modal */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-label="Close AI Agent Overlay"
      />
    </div>
  );
}