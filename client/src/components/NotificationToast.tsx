import { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
}

export function NotificationToast({ message, type, show, onClose }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <div className={`fixed top-5 right-5 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg font-medium transform transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
