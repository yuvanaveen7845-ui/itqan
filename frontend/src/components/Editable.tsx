'use client';

import { useState, useRef, useEffect } from 'react';
import { useDevStore } from '@/store/dev';
import { useCMSStore } from '@/store/cms';
import { FiEdit3, FiCheck, FiX, FiImage, FiType } from 'react-icons/fi';

interface EditableProps {
    id: string;
    children: React.ReactNode;
    type?: 'text' | 'image' | 'richtext';
    className?: string;
    fallback?: string;
}

export default function Editable({ id, children, type = 'text', className = '', fallback = '' }: EditableProps) {
    const isDevMode = useDevStore((state) => state.isDevMode);
    const inlineContent = useCMSStore((state) => state.inlineContent);
    const updateInlineContent = useCMSStore((state) => state.updateInlineContent);

    const [isEditing, setIsEditing] = useState(false);
    const [editTab, setEditTab] = useState<'content' | 'style'>('content');
    const [tempValue, setTempValue] = useState('');
    const [tempStyle, setTempStyle] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const savedValue = inlineContent[id];
    const savedStyle = inlineContent[`${id}__styles`] || '';

    useEffect(() => {
        if (isEditing) {
            setTempValue(savedValue || fallback || (typeof children === 'string' ? children : ''));
            setTempStyle(savedStyle || className);
        }
    }, [isEditing, savedValue, savedStyle, children, fallback, className]);

    const handleSave = async () => {
        await updateInlineContent(id, tempValue);
        await updateInlineContent(`${id}__styles`, tempStyle);
        setIsEditing(false);
    };

    if (!isDevMode) {
        // Render content normally
        const combinedClass = `${className} ${savedStyle}`.trim();
        if (type === 'image' && savedValue) {
            return <img src={savedValue} alt="Editable" className={combinedClass} />;
        }
        return <div className={combinedClass}>{savedValue || children}</div>;
    }

    return (
        <div
            ref={containerRef}
            className={`relative group/editable outline-2 outline-dashed outline-transparent hover:outline-premium-gold/40 transition-all ${isEditing ? 'z-[500]' : ''} ${savedStyle}`}
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
            <div className="absolute -bottom-5 left-0 z-50 bg-premium-black text-premium-gold text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 opacity-0 group-hover/editable:opacity-100 pointer-events-none">
                {id}
            </div>

            {/* Content Display */}
            {type === 'image' ? (
                <img src={savedValue || (typeof children === 'string' ? children : '')} alt="Editable" className={`${className} ${isEditing ? 'opacity-50' : ''}`} />
            ) : (
                <div className={className}>{savedValue || children}</div>
            )}

            {/* Edit Modal / Overlay */}
            {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center min-w-[280px] min-h-[50px] z-[501]">
                    <div className="bg-premium-black p-4 shadow-2xl border border-premium-gold/50 flex flex-col gap-3 w-full">
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
                                    <FiCheck size={10} /> Styles
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSave} className="text-emerald-400 hover:scale-120 transition-transform"><FiCheck size={14} /></button>
                                <button onClick={() => setIsEditing(false)} className="text-rose-400 hover:scale-120 transition-transform"><FiX size={14} /></button>
                            </div>
                        </div>

                        {editTab === 'content' ? (
                            <textarea
                                autoFocus
                                className="bg-white/5 border border-premium-gold/10 p-2 text-white text-xs font-medium outline-none focus:border-premium-gold transition-colors w-full h-24"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                placeholder={type === 'image' ? 'Paste image URL here...' : 'Enter new text...'}
                            />
                        ) : (
                            <div className="space-y-2">
                                <label className="text-[7px] text-white/40 uppercase font-black tracking-widest">Tailwind Classes</label>
                                <input
                                    autoFocus
                                    className="bg-white/5 border border-premium-gold/10 p-2 text-white text-xs font-medium outline-none focus:border-premium-gold transition-colors w-full"
                                    value={tempStyle}
                                    onChange={(e) => setTempStyle(e.target.value)}
                                    placeholder="e.g. text-premium-gold font-bold..."
                                />
                                <p className="text-[6px] text-white/20 italic">Note: These classes are appended to the existing element styles.</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-[7px] font-black text-white/30 uppercase tracking-widest">
                            <span>ID: {id}</span>
                            <span>Super Admin Mode</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
