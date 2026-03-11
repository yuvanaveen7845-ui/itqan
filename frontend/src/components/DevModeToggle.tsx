'use client';

import { useState, useEffect } from 'react';
import { useDevStore } from '@/store/dev';
import { useAuthStore } from '@/store/auth';
import { FiCode, FiZap, FiEdit3 } from 'react-icons/fi';

export default function DevModeToggle() {
    const { isDevMode, toggleDevMode } = useDevStore();
    const { user } = useAuthStore();
    const isSuperAdmin = user?.role === 'super_admin';

    if (!isSuperAdmin) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end gap-4 pointer-events-none">
            {isDevMode && (
                <div className="bg-premium-black border border-premium-gold/30 p-4 shadow-2xl animate-fade-in pointer-events-auto">
                    <p className="text-[9px] font-black text-premium-gold uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                        <FiZap className="animate-pulse" /> Developer Mode Active
                    </p>
                    <p className="text-[10px] text-white/60 font-medium max-w-[180px]">
                        Hover over site elements to trigger inline editing overlays.
                    </p>
                </div>
            )}

            <button
                onClick={toggleDevMode}
                className={`pointer-events-auto group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isDevMode
                    ? 'bg-premium-gold text-premium-black rotate-180 scale-110'
                    : 'bg-premium-black text-premium-gold hover:scale-110'
                    }`}
                title={isDevMode ? 'Exit Developer Mode' : 'Enter Developer Mode'}
            >
                <div className="absolute inset-0 rounded-full border border-premium-gold/30 animate-ping opacity-20"></div>
                {isDevMode ? <FiZap size={24} /> : <FiCode size={24} />}

                {/* Tooltip */}
                <div className="absolute right-20 bg-premium-black text-premium-gold text-[9px] font-black uppercase tracking-widest px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-premium-gold/20 shadow-2xl">
                    <p className="mb-1">{isDevMode ? 'Deactivate Superpowers' : 'Unlock Ultimate Power'}</p>
                    <p className="text-white/40 text-[7px] lowercase tracking-normal font-medium">Edit text, images, links & visibility</p>
                </div>
            </button>
        </div>
    );
}
