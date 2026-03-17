'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { categoryAPI } from '@/lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiFolder, FiChevronRight, FiGlobe, FiImage } from 'react-icons/fi';

export default function AdminCategoriesPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_id: '',
        banner_url: '',
        meta_title: '',
        meta_description: ''
    });

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
            router.push('/');
            return;
        }
        fetchCategories();
    }, [user, router]);

    const fetchCategories = async () => {
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                parent_id: formData.parent_id || null
            };

            if (editingId) {
                await categoryAPI.update(editingId, payload);
            } else {
                await categoryAPI.create(payload);
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            alert(`Failed to ${editingId ? 'update' : 'add'} category`);
        }
    };

    const handleEditClick = (cat: any) => {
        setEditingId(cat.id);
        setFormData({
            name: cat.name,
            description: cat.description || '',
            parent_id: cat.parent_id || '',
            banner_url: cat.banner_url || '',
            meta_title: cat.meta_title || '',
            meta_description: cat.meta_description || ''
        });
        setShowForm(true);
        setActiveTab('general');
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '', description: '', parent_id: '', banner_url: '',
            meta_title: '', meta_description: ''
        });
        setShowForm(false);
        setActiveTab('general');
    };

    const handleDelete = async (id: string) => {
        if (confirm('Eradicating this map node? Masterpieces within may fall to the unordered abyss.')) {
            try {
                await categoryAPI.delete(id);
                fetchCategories();
            } catch (error) {
                alert('Failed to eradicate node');
            }
        }
    };

    // Helper to find parent name
    const getParentName = (parentId: string) => {
        return categories.find(c => c.id === parentId)?.name || 'Root Vector';
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-premium-gold/20 pb-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-premium-cream mb-2 tracking-tight">Taxonomy Architecture</h1>
                    <p className="text-premium-gold font-bold uppercase text-[10px] tracking-[0.3em]">Design the navigational framework and strategic landing indices.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(!showForm);
                    }}
                    className={`flex items-center gap-3 px-8 py-4 font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-xl border ${showForm ? 'bg-[#1A1A1A] text-white/50 border-white/10 hover:border-premium-gold' : 'bg-premium-black text-premium-gold border-premium-gold/30 hover:bg-premium-gold hover:text-white hover:scale-105 active:scale-95'
                        }`}
                >
                    {showForm ? <><FiX size={16} /> Discard Blueprint</> : <><FiPlus size={16} /> Mint New Sector</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 relative">
                    <div className="bg-premium-gold/5 px-10 py-6 border-b border-premium-gold/10 flex items-center justify-between">
                        <h2 className="text-xl font-playfair font-black text-premium-cream tracking-wide">{editingId ? 'Recalibrate Sector Node' : 'Initialize Sector Matrix'}</h2>
                        <div className="flex gap-2">
                            {[
                                { id: 'general', label: 'Hierarchy Identity', icon: <FiFolder /> },
                                { id: 'seo', label: 'Global Aesthetics', icon: <FiGlobe /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-6 py-2 border font-black text-[9px] uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-premium-black text-premium-gold border-premium-gold/30' : 'bg-transparent text-white/30 border-transparent hover:text-white/80'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10">
                        {activeTab === 'general' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Sector Notation</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-premium-cream focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all font-playfair text-xl italic"
                                        placeholder="Dominion of Velvet..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Inheritance Anchor</label>
                                    <select
                                        className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all appearance-none cursor-pointer"
                                        value={formData.parent_id}
                                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    >
                                        <option value="">Absolute Genesis (Root)</option>
                                        {categories.filter(c => c.id !== editingId).map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Thematic Narrative</label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white/80 focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all text-sm font-medium"
                                        rows={3}
                                        placeholder="The tale woven through these articles..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-300">
                                <div>
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Omni-Banner Asset URL</label>
                                    <div className="flex gap-4">
                                        <div className="bg-white/5 border border-white/10 p-5 text-premium-gold/50 flex items-center justify-center shadow-inner">
                                            <FiImage size={24} />
                                        </div>
                                        <input
                                            type="url"
                                            className="flex-grow px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 focus:bg-white/10 outline-none transition-all text-sm font-mono"
                                            placeholder="https://content.asset/.../banner.jpg"
                                            value={formData.banner_url}
                                            onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Network Directory Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm"
                                        placeholder="Optimized sector title..."
                                        value={formData.meta_title}
                                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-white/40 mb-3 uppercase tracking-[0.3em]">Metadata Inscription</label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white focus:border-premium-gold/50 outline-none transition-all text-sm font-medium"
                                        rows={2}
                                        placeholder="Global dispatch script..."
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
                            <button type="submit" className="flex-1 bg-premium-black border border-premium-gold/30 text-premium-gold py-5 font-black uppercase text-[10px] tracking-widest hover:bg-premium-gold hover:text-white transition-all shadow-xl">
                                {editingId ? 'Commit Structural Axiom' : 'Instantiate Neural Sector'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm} className="px-12 bg-white/5 border border-white/10 text-white/50 py-5 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all">
                                    Void Edits
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-[#1A1A1A] shadow-2xl border border-white/5 overflow-hidden relative self-start">
                    <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/5 pointer-events-none"></div>
                    <div className="p-10 border-b border-white/5 relative z-10">
                        <h3 className="text-2xl font-playfair font-black text-premium-cream">Sector Topography</h3>
                    </div>
                    <div className="p-6 space-y-3 relative z-10">
                        {categories.length === 0 ? (
                            <p className="p-10 text-center text-white/30 font-playfair italic text-xl">The taxonomy remains void.</p>
                        ) : categories.map(cat => (
                            <div key={cat.id} className="group relative">
                                <div className={`p-6 border transition-all flex items-center justify-between ${editingId === cat.id ? 'bg-premium-gold/5 border-premium-gold shadow-inner' : 'bg-black/40 border-white/5 hover:border-premium-gold/50 hover:bg-white/5'
                                    }`}>
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-white/5 border border-white/10 text-white/50 group-hover:bg-premium-gold group-hover:text-premium-black group-hover:border-premium-gold transition-all shadow-[0_0_15px_rgba(234,179,8,0)] group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                            <FiFolder size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-playfair font-black text-lg text-premium-cream tracking-wide">{cat.name}</h4>
                                            {cat.parent_id && (
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">
                                                    <span>Origin Anchor</span>
                                                    <FiChevronRight size={10} className="text-premium-gold/50" />
                                                    <span className="text-premium-gold/80">{getParentName(cat.parent_id)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(cat)} className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-premium-gold hover:border-premium-gold hover:text-white transition-all shadow-sm" title="Reconfigure Sequence"><FiEdit2 size={16} /></button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-rose-600 hover:border-rose-600 hover:text-white transition-all shadow-sm" title="Purge Topology"><FiTrash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block bg-premium-black border border-premium-gold/20 p-12 shadow-2xl relative overflow-hidden self-start">
                    <div className="relative z-10">
                        <h3 className="text-4xl font-playfair font-black text-premium-cream mb-8 tracking-tight">System<br /><span className="text-premium-gold italic font-light">Elegance</span></h3>
                        <p className="text-white/60 font-medium leading-relaxed mb-10 text-sm">
                            Forging nested sequences permits the construction of vast, elegant navigations. Interlink grand sectors ("Spring '28 Premiere") with localized chapters ("Nocturnal Essences") to guide the patron's eye.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-6 bg-white/5 border border-white/10 p-6 shadow-inner">
                                <FiGlobe className="text-3xl text-premium-gold" />
                                <div>
                                    <p className="font-black text-[10px] tracking-[0.2em] text-white uppercase mb-2">Omnipresent Discovery</p>
                                    <p className="text-xs text-white/50 leading-relaxed font-medium">Each sector autonomously instantiates an indexed portal to captivate global search telemetry.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 bg-white/5 border border-white/10 p-6 shadow-inner">
                                <FiImage className="text-3xl text-premium-gold" />
                                <div>
                                    <p className="font-black text-[10px] tracking-[0.2em] text-white uppercase mb-2">Visual Supremacy</p>
                                    <p className="text-xs text-white/50 leading-relaxed font-medium">Inject tailored master assets to dominate the aesthetic narrative of individual departments.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-premium-gold/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
}
