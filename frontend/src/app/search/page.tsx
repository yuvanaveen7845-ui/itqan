// Imperial Scent UI Deploy: Phase 14 - Exotic Gold Search Overhaul
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productAPI } from '@/lib/api';
import { FiSearch, FiTrendingUp, FiTag, FiWind, FiX } from 'react-icons/fi';

export default function SearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const trendingSearches = ['Majestic Oud', 'Velvet Rose', 'Amber Spice', 'Saffron Gold'];
    const categorySuggestions = ['Oud', 'Floral', 'Spicy', 'Oriental', 'Fresh'];

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const { data } = await productAPI.getAll({ search: query, limit: 5 });
                setSuggestions(data.products);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleSuggestionClick = (term: string) => {
        setQuery(term);
        router.push(`/products?search=${encodeURIComponent(term)}`);
    };

    return (
        <div className="min-h-screen bg-premium-black gold-dust-overlay pt-32 sm:pt-48 pb-24 px-6 relative selection:bg-premium-gold selection:text-black">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-premium-black z-10 pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto relative z-20">
                <div className="text-center mb-20 space-y-6">
                    <span className="text-premium-gold text-[10px] font-black uppercase tracking-[0.8rem] block animate-reveal">Discovery Room</span>
                    <h1 className="text-6xl lg:text-9xl imperial-serif text-white leading-none animate-reveal" style={{ animationDelay: '0.2s' }}>
                        Seek the <br/>
                        <span className="gold-luxury-text italic font-normal lowercase">Essence</span>
                    </h1>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent mx-auto mt-8 opacity-40"></div>
                </div>

                <div className="arabesque-border glass-panel p-2 mb-20 shadow-2xl">
                    <form onSubmit={handleSearch} className="relative group flex items-center bg-zinc-950 p-4">
                        <div className="pl-6 pr-4 border-r border-white/5">
                            <FiSearch className="w-6 h-6 text-premium-gold animate-pulse" />
                        </div>
                        <input
                            type="text"
                            className="bg-transparent w-full text-2xl p-6 text-white outline-none placeholder:text-white/10 font-bold tracking-tight lowercase"
                            placeholder="Enter notes, families, or collections..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-premium-gold text-premium-black px-12 py-5 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white transition-all duration-700 signature-shimmer"
                        >
                            Execute
                        </button>
                    </form>

                    {/* Instant Suggestions Dropdown area */}
                    {query.length >= 2 && (
                        <div className="bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="w-8 h-8 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : suggestions.length > 0 ? (
                                <ul className="space-y-2">
                                    {suggestions.map(product => (
                                        <li key={product.id}>
                                            <Link href={`/products/${product.id}`} className="flex items-center gap-8 p-4 hover:bg-white/5 group transition-all duration-500">
                                                <div className="w-16 h-16 relative overflow-hidden arabesque-border bg-black">
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-white text-lg group-hover:text-premium-gold transition-colors">{product.name}</h4>
                                                    <div className="flex items-center gap-4 mt-1 opacity-40">
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{product.Fragrance_type}</span>
                                                        <span className="w-1 h-1 bg-white rounded-full"></span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest">₹{product.price.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <FiTrendingUp className="text-premium-gold/0 group-hover:text-premium-gold/100 transition-all duration-500" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-premium-gold/30 text-[10px] font-black uppercase tracking-[0.5em]">The archive remains silent for "{query}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {query.length < 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in duration-1000">
                        {/* Trending Searches */}
                        <div className="glass-panel p-10 border-white/10 group hover:border-premium-gold/40 transition-all">
                            <h3 className="text-[11px] font-black mb-10 flex items-center gap-4 text-premium-gold uppercase tracking-[0.5em]">
                                <FiTrendingUp className="text-premium-gold animate-bounce" />
                                Trending Essences
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {trendingSearches.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => handleSuggestionClick(term)}
                                        className="bg-white/5 hover:bg-premium-gold hover:text-black text-white/60 hover:text-black px-6 py-4 rounded-none text-[10px] font-black uppercase tracking-widest transition-all duration-500 border border-white/5 hover:border-premium-gold signature-shimmer"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Popular Categories */}
                        <div className="glass-panel p-10 border-white/10 group hover:border-premium-gold/40 transition-all">
                            <h3 className="text-[11px] font-black mb-10 flex items-center gap-4 text-premium-gold uppercase tracking-[0.5em]">
                                <FiTag className="text-premium-gold" />
                                Olfactive Families
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {categorySuggestions.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => router.push(`/products?Fragrance_type=${term}`)}
                                        className="bg-transparent hover:bg-white text-premium-gold border border-premium-gold/30 px-6 py-4 rounded-none text-[10px] font-black uppercase tracking-widest transition-all duration-500 signature-shimmer"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
