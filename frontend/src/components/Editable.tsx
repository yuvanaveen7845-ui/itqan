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

const FONT_PRESETS = [
    { name: 'Imperial Serif', class: 'imperial-serif' },
    { name: 'Lux Sans', class: 'font-inter' },
    { name: 'Black Caps', class: 'font-black uppercase tracking-widest' },
];

const SIZE_PRESETS = [
    { name: 'Micro', class: 'text-[9px]' },
    { name: 'Base', class: 'text-sm' },
    { name: 'Royal', class: 'text-6xl' },
    { name: 'Imperial', class: 'text-9xl' },
];

const COLOR_PRESETS = [
    { name: 'Atelier White', class: 'text-white' },
    { name: 'Onyx', class: 'text-premium-black' },
    { name: 'Signature Gold', class: 'text-premium-gold' },
    { name: 'Luxury Gradient', class: 'gold-luxury-text' },
];

const DISPLAY_PRESETS = [
    { name: 'Block', class: 'block' },
    { name: 'Inline', class: 'inline-block' },
    { name: 'Flex Row', class: 'flex flex-row items-center gap-4' },
    { name: 'Flex Col', class: 'flex flex-col gap-4' },
    { name: 'Grid Cols-2', class: 'grid grid-cols-2 gap-6' },
];

const SPACING_PRESETS = [
    { name: 'P-None', class: 'p-0' },
    { name: 'P-Small', class: 'p-4' },
    { name: 'P-Large', class: 'p-12' },
    { name: 'M-Auto', class: 'mx-auto' },
    { name: 'M-Bottom', class: 'mb-12' },
];

const BORDER_PRESETS = [
    { name: 'No Border', class: 'border-0' },
    { name: 'Gold Border', class: 'border border-premium-gold/30' },
    { name: 'Soft Radius', class: 'rounded-2xl' },
    { name: 'Circle', class: 'rounded-full' },
];

const EFFECT_PRESETS = [
    { name: 'No Shadow', class: 'shadow-none' },
    { name: 'Soft Shadow', class: 'shadow-2xl' },
    { name: 'Gold Glow', class: 'shadow-[0_0_30px_rgba(197,160,89,0.3)]' },
    { name: 'Glass Panel', class: 'bg-white/5 backdrop-blur-md border border-white/10' },
    { name: 'Hover Scale', class: 'hover:scale-105 transition-transform duration-500' },
];

export default function Editable({ id, children, type = 'text', className = '', fallback = '', href = '' }: EditableProps) {
    const isDevMode = useDevStore((state) => state.isDevMode);
    const inlineContent = useCMSStore((state) => state.inlineContent);
    const updateInlineContent = useCMSStore((state) => state.updateInlineContent);

    const [isEditing, setIsEditing] = useState(false);
    const [editTab, setEditTab] = useState<'content' | 'appearance' | 'layout' | 'logic'>('content');
    const [tempValue, setTempValue] = useState('');
    const [tempStyle, setTempStyle] = useState('');
    const [tempHref, setTempHref] = useState('');
    const [tempVisible, setTempVisible] = useState(true);
    
    // Undo Support
    const [history, setHistory] = useState<{ value: string; style: string }[]>([]);

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
            setHistory([{ value: savedValue || '', style: savedStyle || '' }]);
        }
    }, [isEditing]);

    const handleUndo = () => {
        if (history.length > 1) {
            const prevState = history[history.length - 2];
            setTempValue(prevState.value);
            setTempStyle(prevState.style);
            setHistory(history.slice(0, -1));
        }
    };

    const addToHistory = () => {
        setHistory([...history, { value: tempValue, style: tempStyle }]);
    };

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
            className={`relative group/editable transition-all ${!savedVisible ? 'opacity-30' : ''} ${isEditing ? 'z-[500]' : ''}`}
        >
            {/* Inspector Overlay */}
            <div className={`absolute -inset-2 border border-dashed transition-colors pointer-events-none z-10 ${isEditing ? 'border-premium-gold bg-premium-gold/5' : 'border-transparent group-hover/editable:border-premium-gold/30'}`}></div>

            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -top-3 -right-3 z-50 w-6 h-6 bg-premium-gold text-premium-black rounded-full shadow-2xl opacity-0 group-hover/editable:opacity-100 transition-all hover:scale-125 flex items-center justify-center border border-black/10"
                >
                    <FiEdit3 size={10} />
                </button>
            )}

            {/* Display Component */}
            <div className={`${className} ${savedStyle} ${!savedVisible ? 'line-through' : ''}`}>
                {type === 'image' ? (
                    <img src={savedValue || fallback || (typeof children === 'string' ? children : '')} alt="Preview" />
                ) : (
                    savedValue || children
                )}
            </div>

            {/* Premium Property Editor */}
            {isEditing && (
                <div className="absolute top-full left-0 mt-4 min-w-[380px] z-[501] animate-reveal">
                    <div className="bg-[#1A1A1A] text-white p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-white/10 skew-x-[-1deg]">
                        <div className="skew-x-[1deg] space-y-8">
                            {/* Editor Header */}
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <div className="flex gap-6">
                                    {['content', 'appearance', 'layout', 'logic'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setEditTab(tab as any)}
                                            className={`text-[8px] font-black uppercase tracking-[0.3em] transition-colors ${editTab === tab ? 'text-premium-gold' : 'text-white/30 hover:text-white'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleUndo} disabled={history.length <= 1} className="text-white/30 hover:text-white disabled:opacity-0 transition-all"><FiX size={14} /></button>
                                    <button onClick={handleSave} className="text-premium-gold hover:scale-110 transition-transform"><FiCheck size={16} /></button>
                                    <button onClick={() => setIsEditing(false)} className="text-rose-500 hover:scale-110 transition-transform"><FiX size={16} /></button>
                                </div>
                            </div>

                            {/* Tab Panels */}
                            <div className="min-h-[220px]">
                                {editTab === 'content' && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[7px] font-black uppercase text-white/40 tracking-widest flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    {type === 'image' ? <FiImage size={8}/> : <FiType size={8}/>} 
                                                    Master {type === 'image' ? 'Image URL' : 'Value'}
                                                </div>
                                            </label>
                                            {type === 'image' ? (
                                                <div className="space-y-4">
                                                    <textarea
                                                        className="w-full bg-white/5 border border-white/10 p-4 text-[10px] focus:border-premium-gold/50 outline-none transition-all h-20"
                                                        value={tempValue}
                                                        onChange={(e) => { setTempValue(e.target.value); addToHistory(); }}
                                                        placeholder="Enter image URL..."
                                                    />
                                                    
                                                    {/* Media Sanctuary Quick Pick */}
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center bg-white/10 p-4 border border-premium-gold/30">
                                                             <span className="text-[9px] font-black text-premium-gold uppercase tracking-[0.2em] animate-pulse">Select from Sanctuary</span>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar border border-white/5 p-2 bg-black/20">
                                                            {(() => {
                                                                try {
                                                                    const mediaJson = useCMSStore.getState().inlineContent['__sanctuary_media'];
                                                                    if (!mediaJson) return null;
                                                                    const media = JSON.parse(mediaJson);
                                                                    if (!Array.isArray(media)) return null;
                                                                    return media.map((img: any) => (
                                                                        <button 
                                                                            key={img.url}
                                                                            onClick={() => { setTempValue(img.url); addToHistory(); }}
                                                                            className={`aspect-square border transition-all overflow-hidden group/thumb ${tempValue === img.url ? 'border-premium-gold scale-95' : 'border-white/5 hover:border-white/20'}`}
                                                                        >
                                                                            <img src={img.url} alt="" className="w-full h-full object-cover group-hover/thumb:scale-125 transition-transform" />
                                                                        </button>
                                                                    ));
                                                                } catch (e) {
                                                                    console.error('Sanctuary Parse Error:', e);
                                                                    return null;
                                                                }
                                                            })() || (
                                                                <div className="col-span-full py-6 text-center text-[8px] text-white/20 font-black uppercase">
                                                                    The sanctuary is empty. Use the upload vector protocol.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center bg-white/5 p-3 border border-white/10 group">
                                                        <span className="text-[8px] font-black text-white/50 uppercase tracking-widest group-hover:text-premium-gold transition-colors">Ingest New Vector</span>
                                                        <label className="px-4 py-2 bg-premium-gold text-premium-black text-[8px] font-black uppercase tracking-widest cursor-pointer hover:bg-white transition-colors shadow-xl">
                                                            Upload Asset
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (!file) return;
                                                                    try {
                                                                        const formData = new FormData();
                                                                        formData.append('image', file);
                                                                        const { adminAPI } = await import('@/lib/api');
                                                                        const res = await adminAPI.uploadImage(formData);
                                                                        if (res.data?.success) {
                                                                            setTempValue(res.data.data.url);
                                                                            addToHistory();
                                                                            // Update sanctuary local cache
                                                                            const oldMedia = JSON.parse(useCMSStore.getState().inlineContent['__sanctuary_media'] || '[]');
                                                                            updateInlineContent('__sanctuary_media', JSON.stringify([res.data.data, ...oldMedia]));
                                                                        }
                                                                    } catch (err) {
                                                                        alert('Vector Ingestion Failure');
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <textarea
                                                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-medium focus:border-premium-gold/50 outline-none transition-all h-28"
                                                    value={tempValue}
                                                    onChange={(e) => { setTempValue(e.target.value); addToHistory(); }}
                                                    placeholder="Enter content..."
                                                />
                                            )}
                                        </div>
                                        {(type === 'link' || href) && (
                                            <div className="space-y-2">
                                                <label className="text-[7px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2"><FiLink size={8} /> Gateway Href</label>
                                                <input
                                                    className="w-full bg-white/5 border border-white/10 p-3 text-xs focus:border-premium-gold/50 outline-none"
                                                    value={tempHref}
                                                    onChange={(e) => setTempHref(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {editTab === 'appearance' && (
                                    <div className="space-y-6">
                                        {/* Font Toggle */}
                                        <div className="space-y-3">
                                            <span className="text-[7px] font-black uppercase text-white/40 tracking-widest block">Typography Type</span>
                                            <div className="flex flex-wrap gap-2">
                                                {FONT_PRESETS.map(f => (
                                                    <button key={f.name} onClick={() => { setTempStyle(`${tempStyle} ${f.class}`); addToHistory(); }} className="px-3 py-1.5 border border-white/10 text-[7px] font-black uppercase tracking-widest hover:border-premium-gold transition-all">{f.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Size Toggle */}
                                        <div className="space-y-3">
                                            <span className="text-[7px] font-black uppercase text-white/40 tracking-widest block">Magnitude</span>
                                            <div className="flex flex-wrap gap-2">
                                                {SIZE_PRESETS.map(s => (
                                                    <button key={s.name} onClick={() => { setTempStyle(`${tempStyle} ${s.class}`); addToHistory(); }} className="px-3 py-1.5 border border-white/10 text-[7px] font-black uppercase tracking-widest hover:border-premium-gold transition-all">{s.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Color Toggle */}
                                        <div className="space-y-3">
                                            <span className="text-[7px] font-black uppercase text-white/40 tracking-widest block">Palette Tint</span>
                                            <div className="flex flex-wrap gap-2">
                                                {COLOR_PRESETS.map(c => (
                                                    <button key={c.name} onClick={() => { setTempStyle(`${tempStyle} ${c.class}`); addToHistory(); }} className="px-3 py-1.5 border border-white/10 text-[7px] font-black uppercase tracking-widest hover:border-premium-gold transition-all">{c.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Custom Classes */}
                                        <div className="space-y-2 pt-4 border-t border-white/5">
                                            <label className="text-[7px] font-black uppercase text-white/40 tracking-widest flex justify-between">
                                                <span>Expert Stylings (Tailwind CSS)</span>
                                                <button onClick={() => setTempStyle('')} className="text-rose-500 hover:text-rose-400">Clear All</button>
                                            </label>
                                            <textarea
                                                className="w-full bg-white/5 border border-white/10 p-3 text-[10px] focus:border-premium-gold/50 outline-none font-mono text-premium-gold h-20"
                                                value={tempStyle}
                                                onChange={(e) => { setTempStyle(e.target.value); addToHistory(); }}
                                                placeholder="e.g., mt-4 bg-red-500 hover:opacity-80"
                                            />
                                        </div>
                                    </div>
                                )}

                                {editTab === 'layout' && (
                                    <div className="space-y-6">
                                        {/* Display Toggle */}
                                        <div className="space-y-3">
                                            <span className="text-[7px] font-black uppercase text-white/40 tracking-widest block">Structural Display</span>
                                            <div className="flex flex-wrap gap-2">
                                                {DISPLAY_PRESETS.map(d => (
                                                    <button key={d.name} onClick={() => { setTempStyle(`${tempStyle} ${d.class}`.trim()); addToHistory(); }} className="px-3 py-1.5 border border-white/10 text-[7px] font-black uppercase tracking-widest hover:border-premium-gold transition-all">{d.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Spacing Toggle */}
                                        <div className="space-y-3">
                                            <span className="text-[7px] font-black uppercase text-white/40 tracking-widest block">Padding & Margins</span>
                                            <div className="flex flex-wrap gap-2">
                                                {SPACING_PRESETS.map(s => (
                                                    <button key={s.name} onClick={() => { setTempStyle(`${tempStyle} ${s.class}`.trim()); addToHistory(); }} className="px-3 py-1.5 border border-white/10 text-[7px] font-black uppercase tracking-widest hover:border-premium-gold transition-all">{s.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Borders Toggle */}
                                        <div className="space-y-3">
                                            <span className="text-[7px] font-black uppercase text-white/40 tracking-widest block">Borders & Radius</span>
                                            <div className="flex flex-wrap gap-2">
                                                {BORDER_PRESETS.map(b => (
                                                    <button key={b.name} onClick={() => { setTempStyle(`${tempStyle} ${b.class}`.trim()); addToHistory(); }} className="px-3 py-1.5 border border-white/10 text-[7px] font-black uppercase tracking-widest hover:border-premium-gold transition-all">{b.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Effects Toggle */}
                                        <div className="space-y-3">
                                            <span className="text-[7px] font-black uppercase text-white/40 tracking-widest block">Visual Effects & Shadows</span>
                                            <div className="flex flex-wrap gap-2">
                                                {EFFECT_PRESETS.map(e => (
                                                    <button key={e.name} onClick={() => { setTempStyle(`${tempStyle} ${e.class}`.trim()); addToHistory(); }} className="px-3 py-1.5 border border-white/10 text-[7px] font-black uppercase tracking-widest hover:border-premium-gold transition-all bg-white/5">{e.name}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editTab === 'logic' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">{tempVisible ? <FiEye /> : <FiEyeOff />} Sanctum Display</span>
                                                <p className="text-[7px] text-white/30 uppercase">Visibility to the uninitiated.</p>
                                            </div>
                                            <button onClick={() => setTempVisible(!tempVisible)} className={`w-10 h-5 rounded-full relative transition-colors ${tempVisible ? 'bg-emerald-500' : 'bg-red-500/20'}`}>
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${tempVisible ? 'right-1' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-[6px] font-black uppercase text-white/20 tracking-[0.4em] flex justify-between">
                                <span>Master Key: {id}</span>
                                <span className="text-premium-gold">Atelier Editor v2</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
