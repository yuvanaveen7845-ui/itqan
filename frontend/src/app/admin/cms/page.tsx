'use client';

import { useEffect, useState } from 'react';
import { cmsAPI } from '@/lib/api';
import { useCMSStore } from '@/store/cms';
import { FiLayout, FiImage, FiEdit3, FiGlobe, FiInstagram, FiFacebook, FiTwitter, FiPlus, FiTrash2, FiSave, FiCheckCircle, FiBell, FiSettings } from 'react-icons/fi';

export default function CMSPage() {
    const [activeTab, setActiveTab] = useState<'branding' | 'banners' | 'pages'>('branding');
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});
    const [banners, setBanners] = useState<any[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);

    useEffect(() => {
        fetchCMSData();
    }, []);

    const fetchCMSData = async () => {
        try {
            setLoading(true);
            const [settingsRes, bannersRes, pagesRes] = await Promise.all([
                cmsAPI.getSettings(),
                cmsAPI.getBanners(),
                cmsAPI.getPages()
            ]);
            setSettings(settingsRes.data);
            setBanners(bannersRes.data);
            setPages(pagesRes.data);
        } catch (error) {
            console.error('Failed to fetch CMS data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBranding = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveStatus('Saving...');
            // In a real app we'd batch these or have a better UI, but keeping it simple for now
            await Promise.all([
                cmsAPI.updateSetting('branding', settings.branding),
                cmsAPI.updateSetting('social_links', settings.social_links),
                cmsAPI.updateSetting('announcement', settings.announcement),
                cmsAPI.updateSetting('footer', settings.footer)
            ]);

            // Update global store
            useCMSStore.getState().fetchCMS();

            setSaveStatus('Master Configuration Saved!');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            setSaveStatus('Failed to Persist Configuration');
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-premium-gold tracking-widest uppercase">Initializing Elite CMS...</div>;

    return (
        <div className="space-y-12 max-w-[1400px] mx-auto pb-20">
            <div className="flex justify-between items-end border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-playfair font-black text-premium-black tracking-tight">The Atelier</h1>
                    <p className="text-premium-gold font-black uppercase text-[10px] tracking-[0.5em] mt-3 flex items-center gap-3">
                        <FiGlobe /> Global Aesthetics Configuration
                    </p>
                </div>
                {saveStatus && (
                    <div className="flex items-center gap-3 px-6 py-3 bg-premium-black text-premium-gold border border-premium-gold/30 font-black text-[10px] uppercase tracking-widest animate-fade-in">
                        <FiCheckCircle /> {saveStatus}
                    </div>
                )}
            </div>

            <div className="flex gap-2 p-1 bg-gray-50 border border-gray-100 w-fit">
                {[
                    { id: 'branding', label: 'Identity & Atmosphere', icon: FiGlobe },
                    { id: 'banners', label: 'Visual Experience', icon: FiImage },
                    { id: 'pages', label: 'Editorial Content', icon: FiEdit3 },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-premium-black text-premium-gold' : 'text-premium-charcoal/40 hover:text-premium-black'
                            }`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white p-12 border border-gray-100 shadow-sm min-h-[700px]">
                {activeTab === 'branding' && (
                    <form onSubmit={handleUpdateBranding} className="space-y-20">
                        {/* Core Identity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                            <div className="space-y-10">
                                <h3 className="text-xs font-black text-premium-black border-b border-premium-gold/20 pb-4 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <FiSettings className="text-premium-gold" /> Core Brand Architecture
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em] mb-3">Maison Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-5 bg-premium-cream/30 border border-gray-50 focus:border-premium-gold outline-none font-playfair italic text-xl text-premium-black transition-colors"
                                            value={settings.branding?.name || ''}
                                            onChange={e => setSettings({ ...settings, branding: { ...settings.branding, name: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em] mb-3">Signature Color</label>
                                        <div className="flex gap-6 items-center">
                                            <input
                                                type="color"
                                                className="w-20 h-20 cursor-pointer border-4 border-white shadow-lg p-0 bg-transparent"
                                                value={settings.branding?.primary_color || '#C5A059'}
                                                onChange={e => setSettings({ ...settings, branding: { ...settings.branding, primary_color: e.target.value } })}
                                            />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-premium-black">{settings.branding?.primary_color || '#C5A059'}</p>
                                                <p className="text-[8px] text-premium-charcoal/40 uppercase mt-1">Global Accent Token</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <h3 className="text-xs font-black text-premium-black border-b border-premium-gold/20 pb-4 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <FiBell className="text-premium-gold" /> Announcement Theatre
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <label className="text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em]">Display Status</label>
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, announcement: { ...settings.announcement, is_active: !settings.announcement?.is_active } })}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.announcement?.is_active ? 'bg-premium-gold' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.announcement?.is_active ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em] mb-3">Manifesto Message</label>
                                        <input
                                            type="text"
                                            className="w-full p-5 bg-premium-cream/30 border border-gray-50 focus:border-premium-gold outline-none font-bold text-xs text-premium-black transition-colors"
                                            value={settings.announcement?.text || ''}
                                            onChange={e => setSettings({ ...settings, announcement: { ...settings.announcement, text: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em] mb-3">Privileged Link (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. /products/signature-oud"
                                            className="w-full p-5 bg-premium-cream/30 border border-gray-50 focus:border-premium-gold outline-none font-bold text-xs text-premium-black transition-colors"
                                            value={settings.announcement?.link || ''}
                                            onChange={e => setSettings({ ...settings, announcement: { ...settings.announcement, link: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer & Social Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                            <div className="space-y-10">
                                <h3 className="text-xs font-black text-premium-black border-b border-premium-gold/20 pb-4 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <FiLayout className="text-premium-gold" /> Footer Narratives
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em] mb-3">Maison Philosophy (Footer About)</label>
                                        <textarea
                                            rows={3}
                                            className="w-full p-5 bg-premium-cream/30 border border-gray-50 focus:border-premium-gold outline-none font-bold text-xs text-premium-black transition-colors"
                                            value={settings.footer?.about_text || ''}
                                            onChange={e => setSettings({ ...settings, footer: { ...settings.footer, about_text: e.target.value } })}
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em] mb-3">Concierge Email</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-premium-cream/30 border border-gray-50 font-bold text-xs"
                                                value={settings.footer?.contact_email || ''}
                                                onChange={e => setSettings({ ...settings, footer: { ...settings.footer, contact_email: e.target.value } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-premium-charcoal/40 uppercase tracking-[0.3em] mb-3">Privileged Line</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-premium-cream/30 border border-gray-50 font-bold text-xs"
                                                value={settings.footer?.contact_phone || ''}
                                                onChange={e => setSettings({ ...settings, footer: { ...settings.footer, contact_phone: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <h3 className="text-xs font-black text-premium-black border-b border-premium-gold/20 pb-4 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <FiInstagram className="text-premium-gold" /> Social Coordinates
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { key: 'instagram', icon: FiInstagram },
                                        { key: 'facebook', icon: FiFacebook },
                                        { key: 'twitter', icon: FiTwitter },
                                    ].map(social => (
                                        <div key={social.key} className="flex items-center gap-6 bg-premium-cream/10 p-4 border border-gray-50 transition-all group">
                                            <div className="p-4 bg-white border border-premium-gold/10 text-premium-gold group-hover:bg-premium-black group-hover:text-premium-gold transition-all">
                                                <social.icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[7px] font-black text-premium-charcoal/30 uppercase tracking-[0.3em] mb-1">{social.key} Mastery URL</label>
                                                <input
                                                    type="text"
                                                    placeholder={`Exquisite ${social.key} profile...`}
                                                    className="w-full bg-transparent border-none outline-none font-bold text-xs text-premium-black"
                                                    value={settings.social_links?.[social.key] || ''}
                                                    onChange={e => setSettings({ ...settings, social_links: { ...settings.social_links, [social.key]: e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-gray-50 flex justify-end">
                            <button
                                type="submit"
                                className="bg-premium-black text-premium-gold px-20 py-6 font-black flex items-center gap-4 hover:bg-premium-gold hover:text-white transition-all shadow-2xl uppercase text-[10px] tracking-[0.4em]"
                            >
                                <FiSave size={18} /> Commit Master Changes
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'banners' && (
                    <div className="space-y-12">
                        <div className="flex justify-between items-center bg-premium-cream/30 p-8 border-l-4 border-premium-gold">
                            <div>
                                <h3 className="text-xl font-playfair font-black text-premium-black">Visual Symphony</h3>
                                <p className="text-[9px] font-black text-premium-gold uppercase tracking-widest mt-1">Hero Banners & Seasonal Visuals</p>
                            </div>
                            <button className="bg-premium-black text-premium-gold px-10 py-4 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-premium-gold hover:text-white transition-all">
                                <FiPlus /> Provision New Frame
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {banners.map((banner, idx) => (
                                <div key={banner.id} className="group bg-white border border-gray-100 overflow-hidden hover:border-premium-gold/30 transition-all relative">
                                    <div className="h-64 bg-gray-100 relative overflow-hidden">
                                        <img src={banner.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s] ease-out" alt="" />
                                        <div className="absolute inset-0 bg-premium-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-4">
                                            <p className="text-white text-xs font-black uppercase tracking-widest">Active Experience</p>
                                            <div className="flex gap-4">
                                                <button className="px-6 py-3 bg-white text-premium-black font-black text-[9px] uppercase tracking-widest hover:bg-premium-gold hover:text-white transition-colors">Edit Frame</button>
                                                <button className="p-3 bg-rose-600 text-white hover:bg-rose-700 transition-colors"><FiTrash2 /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-10 text-center">
                                        <p className="text-[9px] font-black text-premium-gold uppercase tracking-[0.4em] mb-2">{banner.subtitle || `FRAME 0${idx + 1}`}</p>
                                        <p className="text-2xl font-playfair font-black text-premium-black mb-3">{banner.title || 'Exquisite Scent'}</p>
                                        <div className="w-12 h-px bg-premium-gold/20 mx-auto"></div>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && (
                                <div className="col-span-2 p-32 text-center bg-premium-cream/20 border-2 border-dashed border-premium-gold/10 text-premium-charcoal/40 font-black uppercase text-[10px] tracking-[0.5em]">
                                    No visual frames provisioned for the hero theatre
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'pages' && (
                    <div className="space-y-12">
                        <div className="flex justify-between items-center bg-premium-cream/30 p-8 border-l-4 border-premium-gold">
                            <div>
                                <h3 className="text-xl font-playfair font-black text-premium-black">The Archives</h3>
                                <p className="text-[9px] font-black text-premium-gold uppercase tracking-widest mt-1">Legal Manuscripts & Brand Storytelling</p>
                            </div>
                            <button className="bg-premium-black text-premium-gold px-10 py-4 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-premium-gold hover:text-white transition-all">
                                <FiPlus /> Scribe New Chapter
                            </button>
                        </div>
                        <div className="space-y-6">
                            {pages.map(page => (
                                <div key={page.id} className="flex items-center justify-between p-8 bg-white border border-gray-100 hover:border-premium-gold/30 hover:shadow-xl transition-all cursor-pointer group">
                                    <div className="flex items-center gap-10">
                                        <div className="w-16 h-16 bg-premium-cream border border-premium-gold/10 flex items-center justify-center text-premium-black font-playfair italic text-2xl group-hover:bg-premium-black group-hover:text-premium-gold transition-all duration-500">
                                            {page.title.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-playfair font-black text-premium-black text-xl group-hover:text-premium-gold transition-colors">{page.title}</p>
                                            <p className="text-[8px] text-premium-charcoal/40 font-black uppercase tracking-[0.3em] mt-2">Access Slug: /{page.slug} — Manuscript Updated {new Date(page.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <span className={`px-6 py-2 text-[8px] font-black uppercase tracking-widest border ${page.is_published ? 'bg-premium-black text-premium-gold border-premium-gold/30' : 'bg-white text-premium-charcoal/30 border-gray-100'}`}>
                                            {page.is_published ? 'Publicly Released' : 'Private Draft'}
                                        </span>
                                        <FiEdit3 className="text-premium-gold group-hover:scale-125 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
