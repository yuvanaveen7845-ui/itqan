'use client';

import { useEffect, useState } from 'react';
import Editable from '@/components/Editable';
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
    <div className="min-h-screen bg-premium-black">
      {/* Radical Boutique Header Section */}
      <section className="bg-premium-black pt-36 sm:pt-60 pb-20 sm:pb-40 px-4 sm:px-12 md:px-24 boutique-layout border-b border-premium-gold/10">
        <div className="flex flex-col items-center text-center space-y-12">
          <Editable id="products_eyebrow" type="text" fallback="Curated Artisan Scents">
            <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1rem] block animate-reveal">Collections</span>
          </Editable>
          <Editable id="products_title" type="richtext" fallback="The Olfactive Archive">
            <h1 className="text-7xl md:text-9xl imperial-serif text-premium-black animate-reveal" style={{ animationDelay: '0.2s' }}>
              Specialist <br />
              <span className="gold-luxury-text italic lowercase font-normal">Editions</span>
            </h1>
          </Editable>
          <div className="w-24 h-px bg-premium-gold/30 animate-reveal" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </section>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 border-b border-premium-gold/10 pb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white hover:text-premium-gold transition-colors"
            >
              <FiSliders size={16} />
              {isFilterOpen ? 'Close Filters' : 'Filter Selection'}
            </button>
            <span className="text-[10px] text-premium-charcoal/40 font-black uppercase tracking-widest">{filteredAndSortedProducts.length} SIGNATURES</span>
          </div>

          <div className="flex items-center gap-6">
            <label className="text-[10px] font-black text-premium-charcoal/60 uppercase tracking-widest font-inter">Sort By</label>
            <select
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-white focus:ring-0 cursor-pointer hover:text-premium-gold transition-colors"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block animate-in fade-in slide-in-from-left-8 duration-1000' : 'hidden'} lg:col-span-1 border-r border-premium-gold/10 pr-10 sticky top-32 h-fit`}>
            <div className="space-y-12 luxury-card-rich p-8 border-none shadow-xl">
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-8 border-b border-premium-gold/20 pb-4 font-inter">Olfactive Search</h3>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search essences..."
                    className="w-full bg-white/5 border-none px-6 py-5 text-xs font-bold text-white focus:ring-1 focus:ring-premium-gold/30 transition-all placeholder:text-white/30 font-inter"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-premium-gold group-focus-within:w-full transition-all duration-700"></div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-6 border-b border-premium-gold/30 pb-3 font-inter">Fragrance Families</h3>
                <div className="flex flex-col gap-1">
                  {['Oud', 'Floral', 'Spicy', 'Oriental', 'Fresh'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, Fragrance_type: filters.Fragrance_type === cat ? '' : cat })}
                      className={`group flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] py-3.5 px-2 rounded-lg transition-all ${filters.Fragrance_type === cat ? 'bg-premium-gold text-premium-black px-4' : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <span>{cat}</span>
                      {filters.Fragrance_type === cat ? <FiCheck size={14} /> : <div className="w-1 h-1 bg-premium-gold/20 rounded-full group-hover:scale-150 transition-transform"></div>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-6 border-b border-premium-gold/30 pb-3 font-inter">Price Reserve</h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-premium-charcoal/30 uppercase tracking-widest pl-1">Min (₹)</span>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full bg-white/5 border-none p-4 text-xs font-black text-white placeholder:text-white/20 focus:ring-1 focus:ring-premium-gold/30"
                        value={filters.price_min}
                        onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-premium-charcoal/30 uppercase tracking-widest pl-1">Max (₹)</span>
                      <input
                        type="number"
                        placeholder="50,000"
                        className="w-full bg-white/5 border-none p-4 text-xs font-black text-white placeholder:text-white/20 focus:ring-1 focus:ring-premium-gold/30"
                        value={filters.price_max}
                        onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setFilters({ Fragrance_type: '', price_min: '', price_max: '', search: '' })}
                  className="w-full py-5 bg-premium-gold text-premium-black text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 shadow-xl shadow-premium-gold/10"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`${isFilterOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-60 gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-premium-gold/10 rounded-full"></div>
                  <div className="absolute inset-0 w-16 h-16 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.6em] animate-pulse">Distilling Essence...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-60 border border-premium-gold/10 bg-white/[0.02] rounded-3xl animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <FiX className="text-premium-gold/30 w-8 h-8" />
                </div>
                <h3 className="text-3xl font-playfair italic text-white mb-4">No matching signatures discovered</h3>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Refine your search parameters</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-x-8 gap-y-16 animate-in fade-in duration-1000`}>
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
