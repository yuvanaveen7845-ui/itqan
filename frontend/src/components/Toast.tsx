'use client';

import { useNotificationStore, NotificationType } from '@/store/notification';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiZap, FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const icons: Record<NotificationType, any> = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    info: FiInfo,
    luxury: FiZap,
};

const colors: Record<NotificationType, string> = {
    success: 'border-emerald-500/30 text-emerald-400',
    error: 'border-rose-500/30 text-rose-400',
    info: 'border-premium-cream/30 text-blue-400',
    luxury: 'border-premium-gold/30 text-premium-gold',
};

export default function Toast() {
    const { notifications, hideNotification } = useNotificationStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed top-24 right-8 z-[2000] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
            {notifications.map((n) => {
                const Icon = icons[n.type];
                return (
                    <div
                        key={n.id}
                        className={`pointer-events-auto group relative bg-premium-black border ${colors[n.type]} p-5 shadow-2xl animate-in slide-in-from-right-full duration-500 flex items-start gap-4 overflow-hidden`}
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent opacity-10 rotate-12 -mr-10 -mt-10"></div>

                        <div className="mt-0.5">
                            <Icon size={18} className={n.type === 'luxury' ? 'animate-pulse' : ''} />
                        </div>

                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-40">
                                {n.type === 'luxury' ? 'Itqan Scent' : 'System Notification'}
                            </p>
                            <p className="text-xs text-white/90 font-medium leading-relaxed">
                                {n.message}
                            </p>
                        </div>

                        <button
                            onClick={() => hideNotification(n.id)}
                            className="mt-0.5 text-white/20 hover:text-white transition-colors"
                        >
                            <FiX size={14} />
                        </button>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-[1px] bg-current opacity-20 animate-[progress_5s_linear_forwards] w-full origin-left"></div>
                    </div>
                );
            })}
        </div>
    );
}
