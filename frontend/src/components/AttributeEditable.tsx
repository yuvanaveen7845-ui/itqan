'use client';

import { useState, useRef, useEffect } from 'react';
import { useDevStore } from '@/store/dev';
import { useNotificationStore } from '@/store/notification';
import { productAPI } from '@/lib/api';
import { FiEdit3, FiCheck, FiX, FiDatabase, FiTarget } from 'react-icons/fi';

interface AttributeEditableProps {
    productId: string;
    field: string;
    value: string | number;
    onUpdate: (newValue: any) => void;
    children: React.ReactNode;
    className?: string;
    type?: 'text' | 'number' | 'textarea' | 'image';
}

export default function AttributeEditable({
    productId,
    field,
    value,
    onUpdate,
    children,
    className = '',
    type = 'text'
}: AttributeEditableProps) {
    const isDevMode = useDevStore((state) => state.isDevMode);
    const { showNotification } = useNotificationStore();
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleSave = async (e?: React.FormEvent | string) => {
        if (e && typeof e !== 'string') e.preventDefault();
        const finalValue = typeof e === 'string' ? e : tempValue;

        if (finalValue === value) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            const updatePayload = { [field]: type === 'number' ? Number(finalValue) : finalValue };
            await productAPI.update(productId, updatePayload);
            onUpdate(finalValue);
            showNotification(`Successfully updated ${field}`, 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Update failed:', error);
            showNotification(`Failed to sync ${field} to database`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { adminAPI } = await import('@/lib/api');
            const res = await adminAPI.uploadImage(formData);
            if (res.data?.success) {
                const newUrl = res.data.data.url;
                setTempValue(newUrl);
                await handleSave(newUrl);
            }
        } catch (err) {
            showNotification('Image upload failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isDevMode) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            ref={containerRef}
            className={`relative group/attr outline-1 outline-dashed transition-all ${isEditing ? 'outline-premium-gold z-[600]' : 'outline-transparent hover:outline-blue-400/40'
                } ${className}`}
        >
            {/* Dev Overlay Trigger */}
            {!isEditing && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 p-1.5 bg-premium-gold text-white rounded-full shadow-lg opacity-0 group-hover/attr:opacity-100 transition-opacity hover:scale-110 flex items-center gap-1"
                    title={`Edit Product ${field}`}
                >
                    <FiDatabase size={10} />
                    <span className="text-[7px] font-black uppercase tracking-tighter pr-1">Live Sync</span>
                </button>
            )}

            {/* Content Display */}
            <div className={`${isEditing ? 'opacity-30 blur-[2px]' : ''}`}>
                {children}
            </div>

            {/* Inline Editor */}
            {isEditing && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full min-w-[240px] z-[601]">
                    <div
                        className="bg-premium-black p-4 shadow-2xl border-2 border-premium-gold flex flex-col gap-3 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[8px] font-black text-premium-gold uppercase tracking-[0.3em] flex items-center gap-2">
                                <FiTarget className="animate-pulse" /> Attribute Sync: {field}
                            </span>
                            <div className="flex gap-2">
                                {type !== 'image' && (
                                    <button
                                        onClick={() => handleSave()}
                                        disabled={loading}
                                        className="text-emerald-400 hover:scale-120 transition-transform disabled:opacity-50"
                                    >
                                        {loading ? <div className="w-3 h-3 border border-current border-t-transparent animate-spin rounded-full"></div> : <FiCheck size={14} />}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="text-rose-400 hover:scale-120 transition-transform"
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        </div>

                        {type === 'image' ? (
                            <div className="space-y-4">
                                <div className="aspect-video bg-white/5 border border-white/10 overflow-hidden relative group">
                                    <img src={String(tempValue)} alt="" className="w-full h-full object-cover" />
                                    {loading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-premium-gold border-t-transparent animate-spin rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        className="bg-white/5 border border-premium-gold/10 p-2 text-white text-[10px] outline-none focus:border-premium-gold w-full"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        placeholder="Image URL"
                                    />
                                    <label className="w-full bg-premium-gold text-premium-black py-2 text-[9px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-white transition-colors">
                                        Upload New Image
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                    {tempValue !== value && !loading && (
                                        <button 
                                            onClick={() => handleSave()}
                                            className="w-full bg-emerald-500 text-white py-2 text-[9px] font-black uppercase tracking-widest"
                                        >
                                            Save Changes
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : type === 'textarea' ? (
                            <textarea
                                autoFocus
                                className="bg-white/5 border border-premium-gold/10 p-2 text-white text-xs font-medium outline-none focus:border-premium-gold w-full h-24"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                            />
                        ) : (
                            <input
                                autoFocus
                                type={type}
                                className="bg-white/5 border border-premium-gold/10 p-2 text-white text-sm font-black outline-none focus:border-premium-gold w-full text-center"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                            />
                        )}

                        <p className="text-[7px] text-white/30 uppercase mt-1">Changes are applied immediately to all customers.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
