'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { FiSliders, FiX, FiCheck } from 'react-icons/fi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    Fragrance_type: '',
    price_min: '',
    price_max: '',
    search: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await productAPI.getAll(filters);
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const [sortBy, setSortBy] = useState('latest');

  const filteredAndSortedProducts = [...products]
    .sort((a: any, b: any) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Sub-Header */}
      <div className="bg-premium-cream border-b border-premium-gold/10 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-playfair font-black text-premium-black mb-4">The Collection</h1>
        <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.5em] font-inter">Private Reserve & Signature Blends</p>
      </div>

      <div className="max-w-[1800px] mx-auto px-8 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-premium-black hover:text-premium-gold transition-colors"
            >
              <FiSliders size={16} />
              {isFilterOpen ? 'Close Filters' : 'Filter Selection'}
            </button>
            <span className="text-[10px] text-premium-charcoal/40 font-black uppercase tracking-widest">{filteredAndSortedProducts.length} SIGNATURES</span>
          </div>

          <div className="flex items-center gap-6">
            <label className="text-[10px] font-black text-premium-charcoal/60 uppercase tracking-widest font-inter">Sort By</label>
            <select
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-premium-black focus:ring-0 cursor-pointer hover:text-premium-gold transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Alphabetical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Overlay/Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:col-span-1 border-r border-gray-50 pr-8`}>
            <div className="space-y-12 sticky top-32">
              <div>
                <h3 className="text-[11px] font-black text-premium-black uppercase tracking-[0.3em] mb-6 border-b border-premium-gold/20 pb-2 font-inter">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Look for a scent..."
                    className="w-full bg-premium-cream border-none p-4 text-xs font-bold focus:ring-1 focus:ring-premium-gold"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black text-premium-black uppercase tracking-[0.3em] mb-6 border-b border-premium-gold/20 pb-2 font-inter">Olfactive Family</h3>
                <div className="flex flex-col gap-3">
                  {['Oud', 'Floral', 'Spicy', 'Oriental', 'Fresh'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, Fragrance_type: filters.Fragrance_type === cat ? '' : cat })}
                      className={`flex items-center justify-between text-[11px] font-bold uppercase tracking-widest py-2 transition-all ${filters.Fragrance_type === cat ? 'text-premium-gold translate-x-2' : 'text-premium-charcoal/60 hover:text-premium-black hover:translate-x-1'
                        }`}
                    >
                      {cat}
                      {filters.Fragrance_type === cat && <FiCheck size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black text-premium-black uppercase tracking-[0.3em] mb-6 border-b border-premium-gold/20 pb-2 font-inter">Price Privilege (₹)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="bg-premium-cream border-none p-3 text-xs font-black placeholder:text-premium-charcoal/30"
                    value={filters.price_min}
                    onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="bg-premium-cream border-none p-3 text-xs font-black placeholder:text-premium-charcoal/30"
                    value={filters.price_max}
                    onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                  />
                </div>
              </div>

              <button
                onClick={() => setFilters({ Fragrance_type: '', price_min: '', price_max: '', search: '' })}
                className="w-full py-4 border border-premium-black text-[10px] font-black uppercase tracking-widest hover:bg-premium-black hover:text-premium-gold transition-all"
              >
                Reset Selection
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`${isFilterOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="w-12 h-12 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em]">Curating Senses...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-40 border border-dashed border-premium-gold/20 bg-premium-cream/30">
                <h3 className="text-2xl font-playfair italic text-premium-black mb-4">No matching signatures found</h3>
                <p className="text-[10px] font-black text-premium-charcoal/40 uppercase tracking-widest">Adjust your search to discover our collection</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-12`}>
                {filteredAndSortedProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
