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
        <div className="max-w-4xl mx-auto px-4 py-16 min-h-[70vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">What are you looking for?</h1>
                <p className="text-gray-600">Search through our premium collection of fabrics and textiles</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12 border border-blue-50">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        className="w-full text-xl p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-0 outline-none transition-colors"
                        placeholder="Search for 'Silk', 'Cotton', 'Blue'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </form>

                {/* Instant Suggestions Dropdown area */}
                {query.length >= 2 && (
                    <div className="mt-4 border-t pt-4">
                        {loading ? (
                            <p className="text-gray-500 text-center py-4">Searching...</p>
                        ) : suggestions.length > 0 ? (
                            <ul className="space-y-2">
                                {suggestions.map(product => (
                                    <li key={product.id}>
                                        <Link href={`/products/${product.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg group transition">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-gray-800 group-hover:text-blue-600">{product.name}</h4>
                                                <p className="text-sm text-gray-500">{product.fabric_type} • ₹{product.price}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No specific products found matching "{query}"</p>
                        )}
                    </div>
                )}
            </div>

            {query.length < 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Trending Searches */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Trending Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {trendingSearches.map(term => (
                                <button
                                    key={term}
                                    onClick={() => handleSuggestionClick(term)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Popular Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {categorySuggestions.map(term => (
                                <button
                                    key={term}
                                    onClick={() => router.push(`/products?fabric_type=${term}`)}
                                    className="border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-full text-sm transition"
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
