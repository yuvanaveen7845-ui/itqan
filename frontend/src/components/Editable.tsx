'use client';

import { useState, useRef, useEffect } from 'react';
import { useDevStore } from '@/store/dev';
import { useCMSStore } from '@/store/cms';
import { FiEdit3, FiCheck, FiX, FiImage, FiType, FiLink, FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

interface EditableProps {
    id: string;
    children: React.ReactNode;
    type?: 'text' | 'image' | 'richtext' | 'link';
    className?: string;
    fallback?: string;
    href?: string;
}

const STYLE_PRESETS = [
    { name: 'None', class: '' },
    { name: 'Gold Text', class: 'gold-luxury-text' },
    { name: 'Serif Title', class: 'imperial-serif' },
    { name: 'Luxury Body', class: 'imperial-body' },
    { name: 'Vogue Vertical', class: 'vogue-text' },
];

export default function Editable({ id, children, type = 'text', className = '', fallback = '', href = '' }: EditableProps) {
    const isDevMode = useDevStore((state) => state.isDevMode);
    const inlineContent = useCMSStore((state) => state.inlineContent);
    const updateInlineContent = useCMSStore((state) => state.updateInlineContent);

    const [isEditing, setIsEditing] = useState(false);
    const [editTab, setEditTab] = useState<'content' | 'style' | 'settings'>('content');
    const [tempValue, setTempValue] = useState('');
    const [tempStyle, setTempStyle] = useState('');
    const [tempHref, setTempHref] = useState('');
    const [tempVisible, setTempVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    const savedValue = inlineContent[id];
    const savedStyle = inlineContent[`${id}__styles`] || '';
    const savedHref = inlineContent[`${id}__href`] || href;
    const savedVisible = inlineContent[`${id}__visible`] !== 'false';

    useEffect(() => {
        if (isEditing) {
            setTempValue(savedValue || fallback || (typeof children === 'string' ? children : ''));
            setTempStyle(savedStyle || className);
            setTempHref(savedHref);
            setTempVisible(savedVisible);
        }
    }, [isEditing, savedValue, savedStyle, savedHref, savedVisible, children, fallback, className, href]);

    const handleSave = async () => {
        await updateInlineContent(id, tempValue);
        await updateInlineContent(`${id}__styles`, tempStyle);
        if (type === 'link' || href) {
            await updateInlineContent(`${id}__href`, tempHref);
        }
        await updateInlineContent(`${id}__visible`, tempVisible ? 'true' : 'false');
        setIsEditing(false);
    };

    if (!isDevMode) {
        if (!savedVisible) return null;

        const combinedClass = `${className} ${savedStyle}`.trim();

        if (type === 'image' && savedValue) {
            return <img src={savedValue} alt="Editable" className={combinedClass} />;
        }

        if (type === 'link' || href) {
            return (
                <Link href={savedHref || '#'} className={combinedClass}>
                    {savedValue || children}
                </Link>
            );
        }

        return <div className={combinedClass}>{savedValue || children}</div>;
    }

    return (
        <div
            ref={containerRef}
            className={`relative group/editable outline-2 outline-dashed transition-all ${!savedVisible ? 'opacity-30 outline-red-500/50' : 'outline-transparent hover:outline-premium-gold/40'
                } ${isEditing ? 'z-[500]' : ''} ${savedStyle}`}
        >
            {/* Dev Overlay Trigger */}
            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -top-3 -right-3 z-50 p-2 bg-premium-gold text-premium-black rounded-full shadow-lg opacity-0 group-hover/editable:opacity-100 transition-opacity hover:scale-110"
                    title={`Edit ${id}`}
                >
                    <FiEdit3 size={12} />
                </button>
            )}

            {/* Inspector Label */}
            <div className="absolute -bottom-5 left-0 z-50 bg-premium-black text-premium-gold text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 opacity-0 group-hover/editable:opacity-100 pointer-events-none flex items-center gap-1">
                {id} {!savedVisible && <FiEyeOff size={8} />}
            </div>

            {/* Content Display */}
            {type === 'image' ? (
                <img src={savedValue || (typeof children === 'string' ? children : '')} alt="Editable" className={`${className} ${isEditing ? 'opacity-50' : ''}`} />
            ) : (
                <div className={className}>{savedValue || children}</div>
            )}

            {/* Edit Modal / Overlay */}
            {isEditing && (
                <div className="absolute top-full left-0 mt-2 flex items-center justify-center min-w-[320px] z-[501]">
                    <div className="bg-premium-black p-4 shadow-2xl border border-premium-gold/50 flex flex-col gap-3 w-full animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b border-premium-gold/20 pb-2">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setEditTab('content')}
                                    className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${editTab === 'content' ? 'text-premium-gold' : 'text-white/40'}`}
                                >
                                    {type === 'image' ? <FiImage /> : <FiType />} Content
                                </button>
                                <button
                                    onClick={() => setEditTab('style')}
                                    className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${editTab === 'style' ? 'text-premium-gold' : 'text-white/40'}`}
                                >
                                    <FiEdit3 size={10} /> Styles
                                </button>
                                <button
                                    onClick={() => setEditTab('settings')}
                                    className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${editTab === 'settings' ? 'text-premium-gold' : 'text-white/40'}`}
                                >
                                    <FiEye size={10} /> Logic
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSave} className="text-emerald-400 hover:scale-120 transition-transform" title="Save Changes"><FiCheck size={14} /></button>
                                <button onClick={() => setIsEditing(false)} className="text-rose-400 hover:scale-120 transition-transform" title="Discard"><FiX size={14} /></button>
                            </div>
                        </div>

                        {editTab === 'content' && (
                            <div className="space-y-3">
                                <textarea
                                    autoFocus
                                    className="bg-white/5 border border-premium-gold/10 p-2 text-white text-xs font-medium outline-none focus:border-premium-gold transition-colors w-full h-24"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    placeholder={type === 'image' ? 'Paste image URL here...' : 'Enter new text...'}
                                />
                                {(type === 'link' || href) && (
                                    <div className="space-y-1">
                                        <label className="text-[7px] text-white/40 uppercase font-black tracking-widest flex items-center gap-1">
                                            <FiLink size={8} /> Target URL (Href)
                                        </label>
                                        <input
                                            className="bg-white/5 border border-premium-gold/10 p-2 text-white text-[10px] font-medium outline-none focus:border-premium-gold transition-colors w-full"
                                            value={tempHref}
                                            onChange={(e) => setTempHref(e.target.value)}
                                            placeholder="/products, https://..."
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {editTab === 'style' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[7px] text-white/40 uppercase font-black tracking-widest">Presets</label>
                                    <div className="flex flex-wrap gap-2">
                                        {STYLE_PRESETS.map((preset) => (
                                            <button
                                                key={preset.name}
                                                onClick={() => setTempStyle(preset.class)}
                                                className={`px-2 py-1 text-[7px] font-black uppercase border transition-all ${tempStyle === preset.class
                                                        ? 'bg-premium-gold text-premium-black border-premium-gold'
                                                        : 'border-white/10 text-white/40 hover:border-premium-gold/30'
                                                    }`}
                                            >
                                                {preset.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[7px] text-white/40 uppercase font-black tracking-widest">Custom Tailwind Classes</label>
                                    <input
                                        className="bg-white/5 border border-premium-gold/10 p-2 text-white text-xs font-medium outline-none focus:border-premium-gold transition-colors w-full"
                                        value={tempStyle}
                                        onChange={(e) => setTempStyle(e.target.value)}
                                        placeholder="e.g. text-premium-gold font-bold..."
                                    />
                                </div>
                            </div>
                        )}

                        {editTab === 'settings' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/5">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                            {tempVisible ? <FiEye /> : <FiEyeOff />} Visibility
                                        </span>
                                        <p className="text-[7px] text-white/40 uppercase">Is this element visible to customers?</p>
                                    </div>
                                    <button
                                        onClick={() => setTempVisible(!tempVisible)}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${tempVisible ? 'bg-emerald-500' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${tempVisible ? 'right-1' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-[7px] font-black text-white/30 uppercase tracking-widest mt-2 border-t border-white/5 pt-2">
                            <span>ID: {id}</span>
                            <span className="text-premium-gold">Super Admin Enhanced</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
