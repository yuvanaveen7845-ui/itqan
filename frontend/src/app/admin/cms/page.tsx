'use client';

import { useEffect, useState } from 'react';
import { cmsAPI, adminAPI } from '@/lib/api';
import { useCMSStore } from '@/store/cms';
import { FiLayout, FiImage, FiEdit3, FiGlobe, FiInstagram, FiFacebook, FiTwitter, FiPlus, FiTrash2, FiSave, FiCheckCircle, FiBell, FiSettings, FiCopy, FiUploadCloud, FiSearch, FiMonitor, FiSmartphone, FiEye, FiSettings as FiCog } from 'react-icons/fi';

export default function CMSPage() {
    const [activeTab, setActiveTab] = useState<'branding' | 'banners' | 'pages' | 'media' | 'editorial'>('branding');
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [banners, setBanners] = useState<any[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const inlineContent = useCMSStore(state => state.inlineContent);
    const updateInlineContent = useCMSStore(state => state.updateInlineContent);
    const editorialKeys = Object.keys(inlineContent).filter(k => !k.includes('__'));

    useEffect(() => {
        fetchCMSData();
    }, []);

    const fetchCMSData = async () => {
        try {
            setLoading(true);
            const [settingsRes, bannersRes, pagesRes, mediaRes] = await Promise.all([
                cmsAPI.getSettings(),
                cmsAPI.getBanners(),
                cmsAPI.getPages(),
                adminAPI.getUploadedImages().catch(e => ({ data: { data: [] } }))
            ]);
            setSettings(settingsRes.data);
            setBanners(bannersRes.data);
            setPages(pagesRes.data);
            if (mediaRes?.data?.success) {
                setMediaItems(mediaRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch CMS data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBranding = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveStatus('Saving changes...');
            await Promise.all([
                cmsAPI.updateSetting('branding', settings.branding),
                cmsAPI.updateSetting('social_links', settings.social_links),
                cmsAPI.updateSetting('announcement', settings.announcement),
                cmsAPI.updateSetting('footer', settings.footer)
            ]);

            useCMSStore.getState().fetchCMS();

            setSaveStatus('Identity Reconfigured Successfully');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            setSaveStatus('Failed to Persist Configuration');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setSaveStatus('Uploading into Sanctuary...');
            const formData = new FormData();
            formData.append('image', file);
            
            await adminAPI.uploadImage(formData);
            
            const mediaRes = await adminAPI.getUploadedImages();
            if (mediaRes?.data?.success) {
                setMediaItems(mediaRes.data.data);
            }
            setSaveStatus('Asset Synchronized Successfully');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Upload Error:', error);
            setSaveStatus('Asset Synthesis Failed');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const handleDeleteMedia = async (filename: string) => {
        if (!confirm('Eradicate this asset from the sanctuary? Links across the storefront will be severed.')) {
            return;
        }
        try {
            setSaveStatus('Eradicating Asset...');
            await adminAPI.deleteUploadedImage(filename);
            
            const mediaRes = await adminAPI.getUploadedImages();
            if (mediaRes?.data?.success) {
                setMediaItems(mediaRes.data.data);
            }
            setSaveStatus('Asset Purged Successfully');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Delete Error:', error);
            setSaveStatus('Purge Operation Failed');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setSaveStatus('Vector URL Copied');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[70vh] space-y-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-premium-gold shadow-[0_0_30px_rgba(234,179,8,0.3)]"></div>
            <p className="text-premium-gold font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">Initializing The Atelier Console</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-premium-gold/20 pb-12 gap-8">
                <div>
                    <h1 className="text-6xl font-playfair font-black text-premium-cream tracking-tighter">The Atelier</h1>
                    <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.6em] mt-4 flex items-center gap-4">
                        <FiGlobe className="animate-spin-slow" /> Global Aesthetic & Content Sovereignty
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    {saveStatus && (
                        <div className="flex items-center gap-3 px-8 py-4 bg-premium-black border border-premium-gold/30 text-premium-gold font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(234,179,8,0.1)] animate-in fade-in slide-in-from-right-4 duration-500">
                            <FiCheckCircle size={16} className="text-green-400" /> {saveStatus}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-[#1A1A1A] border border-white/5 shadow-2xl w-fit">
                {[
                    { id: 'branding', label: 'Core Identity', icon: FiGlobe },
                    { id: 'banners', label: 'The Theatre', icon: FiImage },
                    { id: 'pages', label: 'Manuscripts', icon: FiEdit3 },
                    { id: 'media', label: 'The Sanctuary', icon: FiUploadCloud },
                    { id: 'editorial', label: 'Editorial Room', icon: FiCog },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all duration-500 border-none ${activeTab === tab.id 
                            ? 'bg-premium-black text-premium-gold shadow-[inset_0_0_20px_rgba(234,179,8,0.1)] relative overflow-hidden' 
                            : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                        }`}
                    >
                        {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-premium-gold"></div>}
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-[#1A1A1A] p-10 md:p-16 border border-white/5 shadow-2xl relative min-h-[700px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none opacity-50"></div>
                
                {activeTab === 'branding' && (
                    <form onSubmit={handleUpdateBranding} className="space-y-24 animate-in fade-in duration-700 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                            {/* Branding Configuration */}
                            <div className="space-y-12">
                                <h3 className="text-[11px] font-black text-premium-cream border-b border-premium-gold/20 pb-6 uppercase tracking-[0.4em] flex items-center gap-4">
                                    <FiSettings className="text-premium-gold" /> Brand Architecture
                                </h3>
                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4 group-focus-within:text-premium-gold transition-colors">Maison Denomination</label>
                                        <input
                                            type="text"
                                            className="w-full px-8 py-6 bg-premium-black border border-white/5 focus:border-premium-gold/50 outline-none font-playfair italic text-3xl text-premium-cream transition-all shadow-inner placeholder:text-white/10"
                                            value={settings.branding?.name || ''}
                                            onChange={e => setSettings({ ...settings, branding: { ...settings.branding, name: e.target.value } })}
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">Signature Aesthetic Token</label>
                                        <div className="flex gap-10 items-center bg-black/40 p-8 border border-white/5 group">
                                            <input
                                                type="color"
                                                className="w-24 h-24 cursor-pointer border-8 border-premium-black shadow-2xl p-0 bg-transparent rounded-none"
                                                value={settings.branding?.primary_color || '#C5A059'}
                                                onChange={e => setSettings({ ...settings, branding: { ...settings.branding, primary_color: e.target.value } })}
                                            />
                                            <div className="space-y-2">
                                                <p className="text-xl font-mono font-black text-premium-cream uppercase tracking-widest">{settings.branding?.primary_color || '#C5A059'}</p>
                                                <p className="text-[9px] text-premium-gold uppercase tracking-[0.3em] font-bold">Primary Visual Accent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Announcement Matrix */}
                            <div className="space-y-12">
                                <h3 className="text-[11px] font-black text-premium-cream border-b border-premium-gold/20 pb-6 uppercase tracking-[0.4em] flex items-center gap-4">
                                    <FiBell className="text-premium-gold" /> Awareness Protocol
                                </h3>
                                <div className="space-y-8 bg-black/40 p-10 border border-white/5">
                                    <div className="flex items-center justify-between py-2">
                                        <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Active Visibility</label>
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, announcement: { ...settings.announcement, is_active: !settings.announcement?.is_active } })}
                                            className={`w-14 h-7 rounded-none transition-all relative border ${settings.announcement?.is_active ? 'bg-premium-gold border-premium-gold/50' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 transition-all ${settings.announcement?.is_active ? 'left-8 bg-black shadow-lg' : 'left-1 bg-white/20'}`}></div>
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Transmission Content</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-5 bg-premium-black border border-white/5 focus:border-premium-gold/30 outline-none font-bold text-xs text-premium-cream transition-all uppercase tracking-widest"
                                            value={settings.announcement?.text || ''}
                                            onChange={e => setSettings({ ...settings, announcement: { ...settings.announcement, text: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Redirection Vector (Link)</label>
                                        <input
                                            type="text"
                                            placeholder="/products/signature-collection"
                                            className="w-full px-6 py-5 bg-premium-black border border-white/5 focus:border-premium-gold/30 outline-none font-mono text-[10px] text-white/50 transition-all uppercase tracking-widest"
                                            value={settings.announcement?.link || ''}
                                            onChange={e => setSettings({ ...settings, announcement: { ...settings.announcement, link: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social & Contact */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                            <div className="space-y-12">
                                <h3 className="text-[11px] font-black text-premium-cream border-b border-premium-gold/20 pb-6 uppercase tracking-[0.4em] flex items-center gap-4">
                                    <FiLayout className="text-premium-gold" /> Footer Narrative
                                </h3>
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Philosophy Excerpt</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-8 py-6 bg-premium-black border border-white/5 focus:border-premium-gold/30 outline-none font-medium text-xs text-white/80 transition-all leading-relaxed"
                                            value={settings.footer?.about_text || ''}
                                            onChange={e => setSettings({ ...settings, footer: { ...settings.footer, about_text: e.target.value } })}
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Concierge Email</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-5 bg-premium-black border border-white/5 text-xs text-premium-cream font-mono font-bold tracking-tight outline-none focus:border-premium-gold/20"
                                                value={settings.footer?.contact_email || ''}
                                                onChange={e => setSettings({ ...settings, footer: { ...settings.footer, contact_email: e.target.value } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Private Line</label>
                                            <input
                                                type="text"
                                                className="w-full px-6 py-5 bg-premium-black border border-white/5 text-xs text-premium-cream font-mono font-bold tracking-tight outline-none focus:border-premium-gold/20"
                                                value={settings.footer?.contact_phone || ''}
                                                onChange={e => setSettings({ ...settings, footer: { ...settings.footer, contact_phone: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <h3 className="text-[11px] font-black text-premium-cream border-b border-premium-gold/20 pb-6 uppercase tracking-[0.4em] flex items-center gap-4">
                                    <FiInstagram className="text-premium-gold" /> Social Coordinates
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {[
                                        { key: 'instagram', icon: FiInstagram, color: 'text-pink-500' },
                                        { key: 'facebook', icon: FiFacebook, color: 'text-blue-500' },
                                        { key: 'twitter', icon: FiTwitter, color: 'text-sky-400' },
                                    ].map(social => (
                                        <div key={social.key} className="flex items-center gap-8 bg-black/40 p-6 border border-white/5 group transition-all hover:border-premium-gold/20">
                                            <div className="p-5 bg-premium-black border border-white/10 group-hover:border-premium-gold/40 group-hover:bg-premium-gold/5 transition-all shadow-xl">
                                                <social.icon size={20} className={social.color} />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">{social.key} Signature URL</label>
                                                <input
                                                    type="text"
                                                    placeholder={`Protocol://${social.key}.com/archives`}
                                                    className="w-full bg-transparent border-none outline-none font-mono text-[11px] font-bold text-premium-cream/70 focus:text-premium-gold transition-colors"
                                                    value={settings.social_links?.[social.key] || ''}
                                                    onChange={e => setSettings({ ...settings, social_links: { ...settings.social_links, [social.key]: e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                className="bg-premium-black text-premium-gold px-24 py-7 font-black flex items-center gap-5 hover:bg-premium-gold hover:text-white transition-all shadow-[0_0_30px_rgba(234,179,8,0.15)] uppercase text-[11px] tracking-[0.5em] border border-premium-gold/30 hover:scale-105 active:scale-95"
                            >
                                <FiSave size={20} /> Commit Brand Sequence
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'banners' && (
                    <div className="space-y-16 animate-in fade-in duration-700 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 p-10 border-l-8 border-premium-gold border-y border-white/5">
                            <div>
                                <h3 className="text-3xl font-playfair font-black text-premium-cream tracking-tight">The Visual Theatre</h3>
                                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mt-3">Curate the primary narrative visual experience.</p>
                            </div>
                            <button className="bg-premium-black text-premium-gold px-12 py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 border border-premium-gold/30 hover:bg-premium-gold hover:text-white transition-all shadow-xl">
                                <FiPlus size={16} /> Provision New Act
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {banners.map((banner, idx) => (
                                <div key={banner.id} className="group bg-premium-black border border-white/5 overflow-hidden hover:border-premium-gold/50 transition-all duration-700 relative shadow-2xl">
                                    <div className="h-80 bg-black relative overflow-hidden">
                                        <img src={banner.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[6s] ease-out opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center gap-6 backdrop-blur-[2px]">
                                            <div className="flex gap-6">
                                                <button className="px-8 py-4 bg-premium-gold text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl">Edit Experience</button>
                                                <button className="p-4 bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition-all"><FiTrash2 size={18} /></button>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-10 left-10 text-left">
                                            <p className="text-[9px] font-black text-premium-gold uppercase tracking-[0.5em] mb-3">{banner.subtitle || `EXPERIENCE 0${idx + 1}`}</p>
                                            <p className="text-3xl font-playfair font-black text-premium-cream tracking-tight max-w-[300px] leading-none">{banner.title || 'Exquisite Narrative'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && (
                                <div className="col-span-2 py-48 text-center bg-black/40 border-2 border-dashed border-white/5 text-white/20 font-playfair italic text-2xl tracking-wide">
                                    No visual acts have been provisioned for the main stage.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'pages' && (
                    <div className="space-y-16 animate-in fade-in duration-700 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 p-10 border-l-8 border-premium-gold border-y border-white/5">
                            <div>
                                <h3 className="text-3xl font-playfair font-black text-premium-cream tracking-tight">The Library of Manuscripts</h3>
                                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mt-3">Static Chapters, Core Ethos, and Legal Mandates.</p>
                            </div>
                            <button className="bg-premium-black text-premium-gold px-12 py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 border border-premium-gold/30 hover:bg-premium-gold hover:text-white transition-all shadow-xl">
                                <FiPlus size={16} /> Instantiate Manuscript
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {pages.map(page => (
                                <div key={page.id} className="flex flex-col md:flex-row items-center justify-between p-10 bg-[#1A1A1A] border border-white/5 hover:border-premium-gold/40 hover:bg-premium-black transition-all duration-500 group relative">
                                    <div className="absolute inset-y-0 left-0 w-1 bg-premium-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-12 w-full md:w-auto">
                                        <div className="w-20 h-20 bg-black border border-white/5 flex items-center justify-center text-premium-gold font-playfair italic text-4xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-700">
                                            {page.title.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-playfair font-black text-premium-cream text-3xl tracking-tight group-hover:text-premium-gold transition-colors">{page.title}</p>
                                            <div className="flex items-center gap-6 mt-4">
                                                <p className="text-[9px] text-white/30 font-mono tracking-widest uppercase italic">PATH: /{page.slug}</p>
                                                <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                                                <p className="text-[9px] text-white/30 font-mono tracking-widest uppercase">MODIFIED: {new Date(page.updated_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10 mt-8 md:mt-0">
                                        <span className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${page.is_published ? 'bg-transparent text-green-400 border-green-500/20' : 'bg-white/5 text-white/20 border-white/10'}`}>
                                            {page.is_published ? 'RELEASED' : 'QUARANTINED'}
                                        </span>
                                        <button className="text-white/20 group-hover:text-premium-gold transition-colors p-4 hover:bg-white/5 border border-transparent hover:border-white/10">
                                            <FiEdit3 size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-16 animate-in fade-in duration-700 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 p-10 border-l-8 border-premium-gold border-y border-white/5">
                            <div>
                                <h3 className="text-3xl font-playfair font-black text-premium-cream tracking-tight">The Asset Sanctuary</h3>
                                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mt-3">Encrypted Cloud Storage for Global Visual Nodes.</p>
                            </div>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    id="media-upload-pro"
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileUpload} 
                                />
                                <label 
                                    htmlFor="media-upload-pro"
                                    className="bg-premium-black text-premium-gold px-12 py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-premium-gold hover:text-white transition-all cursor-pointer border border-premium-gold/30 shadow-2xl hover:scale-105 active:scale-95"
                                >
                                    <FiUploadCloud size={18} /> Ingest New Vector
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-8">
                            {mediaItems.map(item => (
                                <div key={item.filename} className="group bg-black/40 border border-white/5 hover:border-premium-gold/50 transition-all duration-500 shadow-2xl relative">
                                    <div className="aspect-square relative overflow-hidden flex items-center justify-center p-6">
                                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                                        <img 
                                            src={item.url} 
                                            alt={item.filename} 
                                            className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-premium-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 flex flex-col justify-center items-center gap-4 backdrop-blur-[2px]">
                                            <button 
                                                onClick={() => copyToClipboard(item.url)}
                                                className="px-8 py-3 bg-premium-gold text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl w-2/3"
                                            >
                                                Copy Path
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteMedia(item.filename)}
                                                className="px-8 py-3 bg-white/10 text-white/50 font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all w-2/3 border border-white/10"
                                            >
                                                Eradicate
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col gap-2">
                                        <span className="truncate text-[10px] font-mono font-bold text-white/50 tracking-tight uppercase" title={item.filename}>{item.filename}</span>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-premium-gold/50 uppercase tracking-widest">WEIGHT: {(item.size / 1024).toFixed(0)} KB</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {mediaItems.length === 0 && (
                            <div className="py-64 text-center bg-black/40 border-2 border-dashed border-white/5 relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-24 h-24 bg-white/5 border border-white/10 shadow-2xl mx-auto flex items-center justify-center text-premium-gold/20 mb-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 group-hover:text-premium-gold">
                                    <FiImage size={40} />
                                </div>
                                <h4 className="text-3xl font-playfair font-black text-premium-cream tracking-tight">The Sanctuary Observes Persistence</h4>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mt-6">Ingest global assets to facilitate site-wide distribution.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'editorial' && (
                    <div className="space-y-16 animate-in fade-in duration-700 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 p-10 border-l-8 border-premium-gold border-y border-white/5">
                            <div className="flex-1">
                                <h3 className="text-3xl font-playfair font-black text-premium-cream tracking-tight">Modular Control Terminal</h3>
                                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] mt-3">Direct Manipulation of Inline Dynamic Variables.</p>
                            </div>
                            <div className="w-full md:w-1/3 group relative">
                                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-premium-gold transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Filter Intelligence Map..."
                                    className="w-full bg-premium-black border border-white/10 pl-16 pr-8 py-5 font-black text-[10px] tracking-widest uppercase outline-none focus:border-premium-gold/50 transition-all text-premium-cream shadow-2xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-black/20 border border-white/5 overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-black/60 text-premium-gold/40 text-[9px] font-black uppercase tracking-[0.4em] border-b border-white/5">
                                            <th className="px-10 py-8">Variable Node</th>
                                            <th className="px-10 py-8">Absolute Data Payload</th>
                                            <th className="px-10 py-8">Styling Array</th>
                                            <th className="px-10 py-8 text-right">Visibility State</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-mono text-[10px]">
                                        {editorialKeys
                                            .filter(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map(key => {
                                                const stylesKey = `${key}__styles`;
                                                const visibleKey = `${key}__visible`;
                                                const value = inlineContent[key] || '';
                                                const styles = inlineContent[stylesKey] || '';
                                                const isVisible = inlineContent[visibleKey] !== 'false';

                                                return (
                                                    <tr key={key} className="hover:bg-premium-gold/5 transition-colors group">
                                                        <td className="px-10 py-8 w-1/4">
                                                            <div className="flex flex-col gap-2">
                                                                <span className="text-premium-cream font-black tracking-widest group-hover:text-premium-gold transition-colors">{key}</span>
                                                                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">NODE_IDENTIFIER</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8 w-1/3">
                                                            <textarea
                                                                className="w-full bg-black/40 border border-white/5 hover:border-white/10 focus:border-premium-gold/50 focus:bg-black p-5 text-white/70 font-medium outline-none transition-all resize-none shadow-xl h-24 text-xs leading-relaxed"
                                                                value={value}
                                                                onChange={(e) => updateInlineContent(key, e.target.value)}
                                                                placeholder="[NULL_PAYLOAD]"
                                                            />
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <div className="relative">
                                                                <input
                                                                    className="w-full bg-black/40 border border-white/5 hover:border-white/10 focus:border-premium-gold/50 focus:bg-black px-6 py-4 text-[10px] font-mono text-premium-gold/70 outline-none transition-all shadow-xl"
                                                                    value={styles}
                                                                    onChange={(e) => updateInlineContent(stylesKey, e.target.value)}
                                                                    placeholder="No custom tokens"
                                                                />
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                                    <FiCog size={12} className="text-premium-gold animate-spin-slow" />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8 text-right">
                                                            <button
                                                                onClick={() => updateInlineContent(visibleKey, isVisible ? 'false' : 'true')}
                                                                className={`px-6 py-3 text-[8px] font-black uppercase tracking-widest border transition-all ${isVisible 
                                                                    ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-rose-600/20 hover:text-rose-400 hover:border-rose-500/30' 
                                                                    : 'bg-white/5 text-white/20 border-white/10 hover:bg-green-600/20 hover:text-green-400 hover:border-green-500/30'}`}
                                                            >
                                                                {isVisible ? 'TRANSMITTING' : 'ENCRYPTED'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        {editorialKeys.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-48 text-center text-white/10 font-playfair italic text-2xl tracking-[0.2em]">
                                                    Zero intelligence nodes detected within filter parameters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Global Preview Overlay */}
            <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
                <button className="w-16 h-16 bg-premium-black border border-premium-gold/30 text-premium-gold shadow-[0_0_30px_rgba(234,179,8,0.2)] flex items-center justify-center hover:bg-premium-gold hover:text-white transition-all group overflow-hidden relative">
                    <FiEye size={24} className="relative z-10 group-hover:scale-125 transition-transform" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
                <div className="hidden md:flex flex-col gap-2 scale-75 opacity-50 hover:opacity-100 transition-opacity">
                    <button className="w-12 h-12 bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all"><FiMonitor size={20} /></button>
                    <button className="w-12 h-12 bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all"><FiSmartphone size={20} /></button>
                </div>
            </div>
        </div>
    );
}
