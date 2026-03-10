'use client';

import { useEffect, useState } from 'react';
import { cmsAPI } from '@/lib/api';
import { useCMSStore } from '@/store/cms';
import { FiLayout, FiImage, FiEdit3, FiGlobe, FiInstagram, FiFacebook, FiTwitter, FiPlus, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';

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
            await cmsAPI.updateSetting('branding', settings.branding);
            await cmsAPI.updateSetting('social_links', settings.social_links);

            // Update global store
            useCMSStore.getState().fetchCMS();

            setSaveStatus('Changes saved successfully!');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            setSaveStatus('Failed to save changes');
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Initializing CMS...</div>;

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Content Management</h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
                        <FiGlobe className="text-indigo-600" /> Site-wide Customization Engine
                    </p>
                </div>
                {saveStatus && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs animate-bounce">
                        <FiCheckCircle /> {saveStatus}
                    </div>
                )}
            </div>

            <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl w-fit">
                {[
                    { id: 'branding', label: 'Identity', icon: FiGlobe },
                    { id: 'banners', label: 'Visuals', icon: FiImage },
                    { id: 'pages', label: 'Editorial', icon: FiEdit3 },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <tab.icon /> {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm min-h-[600px]">
                {activeTab === 'branding' && (
                    <form onSubmit={handleUpdateBranding} className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-gray-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Core Brand Identity</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Legal Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-900"
                                            value={settings.branding?.name || ''}
                                            onChange={e => setSettings({ ...settings, branding: { ...settings.branding, name: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Accent Color</label>
                                        <div className="flex gap-4 items-center">
                                            <input
                                                type="color"
                                                className="w-16 h-16 rounded-2xl cursor-pointer border-none bg-transparent"
                                                value={settings.branding?.primary_color || '#4f46e5'}
                                                onChange={e => setSettings({ ...settings, branding: { ...settings.branding, primary_color: e.target.value } })}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 p-4 bg-gray-50 rounded-2xl border-none outline-none font-black text-xs"
                                                value={settings.branding?.primary_color || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-gray-900 border-l-4 border-rose-500 pl-4 uppercase tracking-tighter">Social Connectivity</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { key: 'instagram', icon: FiInstagram, color: 'hover:text-pink-600' },
                                        { key: 'facebook', icon: FiFacebook, color: 'hover:text-blue-600' },
                                        { key: 'twitter', icon: FiTwitter, color: 'hover:text-sky-500' },
                                    ].map(social => (
                                        <div key={social.key} className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl group transition-all">
                                            <div className={`p-4 bg-white rounded-xl shadow-sm text-gray-400 ${social.color} transition-colors`}>
                                                <social.icon size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder={`${social.key.charAt(0).toUpperCase() + social.key.slice(1)} URL`}
                                                className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-gray-600"
                                                value={settings.social_links?.[social.key] || ''}
                                                onChange={e => setSettings({ ...settings, social_links: { ...settings.social_links, [social.key]: e.target.value } })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-gray-50 text-right">
                            <button
                                type="submit"
                                className="bg-gray-900 text-white px-12 py-5 rounded-3xl font-black flex items-center gap-3 hover:bg-indigo-600 transition-all ml-auto shadow-2xl shadow-indigo-100 uppercase text-xs tracking-widest"
                            >
                                <FiSave /> Persist Site Identity
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'banners' && (
                    <div className="space-y-12">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Hero Slider Management</h3>
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                                <FiPlus /> New Banner Frame
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {banners.map((banner, idx) => (
                                <div key={banner.id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:border-indigo-100 transition-all shadow-sm">
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        <img src={banner.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-3 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest">Edit Layout</button>
                                                <button className="p-3 bg-rose-600 text-white rounded-xl"><FiTrash2 /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <p className="font-black text-gray-900 mb-1">{banner.title || 'Untitled Banner'}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Frame {idx + 1} — {banner.cta_text || 'No CTA'}</p>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && (
                                <div className="col-span-2 p-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 text-gray-400 font-black uppercase text-xs">
                                    No visual banners provisioned for home page slider
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'pages' && (
                    <div className="space-y-12">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Legal & Dynamic Content</h3>
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                                <FiPlus /> Create Dynamic Page
                            </button>
                        </div>
                        <div className="space-y-4">
                            {pages.map(page => (
                                <div key={page.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-hover cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {page.title.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm">{page.title}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Slug: /{page.slug} — Last Updated {new Date(page.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${page.is_published ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                            {page.is_published ? 'Live' : 'Draft'}
                                        </span>
                                        <FiEdit3 className="text-gray-400" />
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
