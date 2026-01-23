
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SectionVisibilityToggleProps {
    label?: string;
    isEnabled: boolean;
    onToggle: (enabled: boolean) => void;
}

const SectionVisibilityToggle: React.FC<SectionVisibilityToggleProps> = ({ isEnabled, onToggle, label = "VISIBILIDAD EN WEB:" }) => {
    return (
        <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/10 p-3 rounded-lg mb-6">
            <span className="text-zinc-400 font-medium text-sm tracking-wider">{label}</span>

            <button
                onClick={() => onToggle(!isEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black ${isEnabled ? 'bg-primary' : 'bg-zinc-700'
                    }`}
            >
                <span
                    className={`${isEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </button>

            <span className={`text-sm font-bold tracking-wider ${isEnabled ? 'text-primary' : 'text-zinc-500'}`}>
                {isEnabled ? 'HABILITADO' : 'DESHABILITADO'}
            </span>
        </div>
    );
};

export default SectionVisibilityToggle;
