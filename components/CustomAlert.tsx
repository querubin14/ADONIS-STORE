import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface CustomAlertProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: 'error' | 'success' | 'info' | 'warning';
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    isOpen,
    onClose,
    title = "ADONIS STORE",
    message
}) => {
    // Optional: Auto-close after a few seconds if you want it to behave like a toast
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-300 w-[90%] max-w-[400px]">
            <div
                className="bg-[#0a0a0a]/95 backdrop-blur-md border border-primary/40 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] overflow-hidden flex items-start"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Accent Line */}
                <div className="w-1 self-stretch bg-primary"></div>

                <div className="flex-1 p-3 flex gap-3 items-center">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-primary">
                        <AlertCircle size={20} className="drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">
                            {title}
                        </h3>
                        <p className="text-gray-300 text-xs font-medium leading-snug">
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-gray-500 hover:text-white transition-colors p-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
