'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productAPI } from '@/lib/api';

export default function SearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock trending searches
    const trendingSearches = ['Premium Silk', 'Summer Cotton', 'Floral Pattern', 'Linen Suits'];
    // Mock categories
    const categorySuggestions = ['Cotton', 'Silk', 'Linen', 'Wool', 'Perfume'];

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                // In a real app, this might be a dedicated auto-complete endpoint
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
        <div className="max-w-4xl mx-auto px-6 py-24 min-h-[70vh] scroll-reveal visible">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black mb-4 imperial-serif text-premium-black lowercase">Seek the Essence</h1>
                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-premium-gold/60 max-w-2xl mx-auto font-inter">Explore our private reserve and signature blends</p>
            </div>

            <div className="luxury-card-rich p-8 md:p-12 mb-16 shadow-2xl rounded-[40px] border-none">
                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        className="premium-input w-full text-2xl p-8 pl-16 rounded-[24px] normal-case font-medium placeholder:italic placeholder:font-light"
                        placeholder="Search for 'Silk', 'Cotton', 'Blue'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <svg className="w-6 h-6 text-premium-gold/40 absolute left-6 top-1/2 transform -translate-y-1/2 group-focus-within:text-premium-gold transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-premium-black text-premium-gold px-10 py-4 rounded-[16px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-premium-gold hover:text-black transition-all duration-700 shadow-xl"
                    >
                        Search
                    </button>
                </form>

                {/* Instant Suggestions Dropdown area */}
                {query.length >= 2 && (
                    <div className="mt-10 border-t border-premium-gold/10 pt-10">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.6em] text-premium-gold">Querying the Archive...</div>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <ul className="space-y-4">
                                {suggestions.map(product => (
                                    <li key={product.id}>
                                        <Link href={`/products/${product.id}`} className="flex items-center gap-8 p-6 hover:bg-premium-cream/50 rounded-[20px] group transition-all duration-700">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-premium-gold/10 grayscale group-hover:grayscale-0 transition-all duration-1000" />
                                            ) : (
                                                <div className="w-16 h-16 bg-premium-cream rounded-xl flex-shrink-0"></div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-premium-black text-lg group-hover:text-premium-gold transition-colors duration-500">{product.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-premium-gold/60">{product.Fragrance_type} • ₹{product.price.toLocaleString()}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-premium-charcoal/40 text-center py-8 text-[10px] font-black uppercase tracking-[0.4em]">No specific products found matching "{query}"</p>
                        )}
                    </div>
                )}
            </div>

            {query.length < 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 scroll-reveal visible">
                    {/* Trending Searches */}
                    <div className="luxury-card-rich p-10 shadow-xl rounded-[32px] border-none">
                        <h3 className="text-[12px] font-black mb-8 flex items-center gap-4 text-premium-black uppercase tracking-[0.4em]">
                            <svg className="w-4 h-4 text-premium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Trending Queries
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {trendingSearches.map(term => (
                                <button
                                    key={term}
                                    onClick={() => handleSuggestionClick(term)}
                                    className="bg-premium-cream/50 hover:bg-premium-gold hover:text-black text-premium-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border border-premium-gold/10"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Categories */}
                    <div className="luxury-card-rich p-10 shadow-xl rounded-[32px] border-none">
                        <h3 className="text-[12px] font-black mb-8 flex items-center gap-4 text-premium-black uppercase tracking-[0.4em]">
                            <svg className="w-4 h-4 text-premium-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Olfactive Tiers
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {categorySuggestions.map(term => (
                                <button
                                    key={term}
                                    onClick={() => router.push(`/products?Fragrance_type=${term}`)}
                                    className="bg-transparent hover:bg-premium-black hover:text-premium-gold text-premium-black border border-premium-gold/20 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
