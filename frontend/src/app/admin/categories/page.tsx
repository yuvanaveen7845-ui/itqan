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
        if (confirm('Are you sure you want to delete this category? Products in this category may become uncategorized.')) {
            try {
                await categoryAPI.delete(id);
                fetchCategories();
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };

    // Helper to find parent name
    const getParentName = (parentId: string) => {
        return categories.find(c => c.id === parentId)?.name || 'Root';
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Category Architecture</h1>
                    <p className="text-gray-500 font-medium">Define your store hierarchy and SEO landing pages.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-lg ${showForm ? 'bg-gray-100 text-gray-700' : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
                        }`}
                >
                    {showForm ? <><FiX /> Cancel</> : <><FiPlus /> New Category</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-800">{editingId ? 'Edit Structural Node' : 'Initialize New Category'}</h2>
                        <div className="flex gap-2">
                            {[
                                { id: 'general', label: 'Identity', icon: <FiFolder /> },
                                { id: 'seo', label: 'SEO & Visuals', icon: <FiGlobe /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {activeTab === 'general' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Category Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 outline-none transition"
                                        placeholder="e.g. Concentrated Oils"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Parent Category</label>
                                    <select
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 outline-none transition appearance-none"
                                        value={formData.parent_id}
                                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    >
                                        <option value="">None (Top Level)</option>
                                        {categories.filter(c => c.id !== editingId).map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Description</label>
                                    <textarea
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 outline-none transition"
                                        rows={3}
                                        placeholder="Short description for display..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Landing Banner URL</label>
                                    <div className="flex gap-2">
                                        <div className="bg-gray-100 p-3 rounded-xl text-gray-400">
                                            <FiImage size={24} />
                                        </div>
                                        <input
                                            type="url"
                                            className="flex-grow px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 outline-none transition"
                                            placeholder="https://images.unsplash.com/..."
                                            value={formData.banner_url}
                                            onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Custom Meta Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 outline-none transition"
                                        placeholder="SEO title for search results"
                                        value={formData.meta_title}
                                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Custom Meta Description</label>
                                    <textarea
                                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 outline-none transition"
                                        rows={2}
                                        placeholder="Search engine snippet..."
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
                            <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                                {editingId ? 'Update Global Category' : 'Provision New Category'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden self-start">
                    <div className="p-8 border-b border-gray-100">
                        <h3 className="text-xl font-black text-gray-900">Current Map</h3>
                    </div>
                    <div className="p-4 space-y-2">
                        {categories.length === 0 ? (
                            <p className="p-8 text-center text-gray-400 font-medium italic">No categories mapped yet.</p>
                        ) : categories.map(cat => (
                            <div key={cat.id} className="group relative">
                                <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${editingId === cat.id ? 'bg-indigo-50 border-indigo-200 shadow-inner' : 'bg-white border-gray-50 hover:border-indigo-100 hover:shadow-sm'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                            <FiFolder />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{cat.name}</h4>
                                            {cat.parent_id && (
                                                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400">
                                                    <span>Subcategory of</span>
                                                    <FiChevronRight size={10} />
                                                    <span className="text-indigo-400">{getParentName(cat.parent_id)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(cat)} className="p-2 text-gray-400 hover:text-indigo-600 transition"><FiEdit2 /></button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 transition"><FiTrash2 /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block bg-gradient-to-br from-indigo-600 to-premium-black rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-4xl font-black mb-6">Hierarchy Insight</h3>
                        <p className="text-indigo-100 font-medium leading-relaxed mb-8">
                            Nested categories allow you to build a powerful navigation system. Use Parent Categories to group related products (e.g., "Seasonals") and subcategories for specific items (e.g., "Winter Oud").
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                <FiGlobe className="text-2xl" />
                                <div>
                                    <p className="font-bold">SEO Ready</p>
                                    <p className="text-sm text-indigo-100">Every category generates a dedicated SEO landing page.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                                <FiImage className="text-2xl" />
                                <div>
                                    <p className="font-bold">Dynamic Banners</p>
                                    <p className="text-sm text-indigo-100">Add URLs to customize the visual feel of each department.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
