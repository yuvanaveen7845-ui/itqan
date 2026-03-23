// Imperial Scent UI Deploy: Phase 14 - Exotic Gold Products Overhaul
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
    <div className="min-h-screen bg-premium-black selection:bg-premium-gold selection:text-black">
      {/* Exotic Boutique Header Section */}
      <section className="bg-premium-black pt-36 sm:pt-60 pb-20 sm:pb-40 px-4 sm:px-12 md:px-24 boutique-layout border-b border-white/5 gold-dust-overlay relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-premium-black z-10"></div>
        <div className="flex flex-col items-center text-center space-y-12 relative z-20">
          <Editable id="products_eyebrow" type="text" fallback="Curated Artisan Scents">
            <span className="text-premium-gold text-[10px] font-black uppercase tracking-[1.2rem] block animate-reveal">Collections</span>
          </Editable>
          <Editable id="products_title" type="richtext" fallback="Specialist Editions">
            <h1 className="text-5xl sm:text-6xl md:text-[100px] lg:text-[140px] imperial-serif text-white animate-reveal leading-none" style={{ animationDelay: '0.2s' }}>
              Specialist <br />
              <span className="gold-luxury-text italic lowercase font-normal">Editions</span>
            </h1>
          </Editable>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent animate-reveal" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </section>

      <div className="liquid-gold-divider opacity-30"></div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-6 border-b border-white/5 pb-12">
          <div className="flex items-center gap-12">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-premium-gold transition-all"
            >
              <div className={`p-3 rounded-full border transition-all ${isFilterOpen ? 'bg-premium-gold border-premium-gold text-black' : 'border-white/10 group-hover:border-premium-gold'}`}>
                {isFilterOpen ? <FiX size={14} /> : <FiSliders size={14} />}
              </div>
              {isFilterOpen ? 'Close Filters' : 'Filter Selection'}
            </button>
            <Editable id="products_count_label" fallback="SIGNATURES">
              <span className="text-[10px] text-premium-gold/40 font-black uppercase tracking-[0.6em]">{filteredAndSortedProducts.length} Signatures Found</span>
            </Editable>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-[10px] font-black text-premium-gold/30 uppercase tracking-[0.4em]">Chronological Order</span>
            <div className="relative group">
              <select
                className="bg-zinc-900 border border-white/10 rounded-none px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-premium-gold outline-none cursor-pointer appearance-none min-w-[200px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-premium-gold/50">
                <FiSliders size={12} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
          {/* Filters Sidebar - Exotic Glass */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:col-span-1 sticky top-32 h-fit mb-12`}>
            <div className="space-y-16 p-10 arabesque-border glass-panel">
              <div>
                <h3 className="text-[11px] font-black text-premium-gold uppercase tracking-[0.6em] mb-10 pb-4 border-b border-white/5">Olfactive Search</h3>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search essences..."
                    className="w-full bg-white/5 border border-white/5 px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white focus:bg-white/10 focus:border-premium-gold transition-all placeholder:text-white/20"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Editable id="products_filter_family_header" fallback="Fragrance Families">
                  <h3 className="text-[11px] font-black text-premium-gold uppercase tracking-[0.6em] mb-10 pb-4 border-b border-white/5">Fragrance Families</h3>
                </Editable>
                <div className="flex flex-col gap-2">
                  {['Oud', 'Floral', 'Spicy', 'Oriental', 'Fresh'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, Fragrance_type: filters.Fragrance_type === cat ? '' : cat })}
                      className={`group flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] py-5 px-6 transition-all border ${filters.Fragrance_type === cat ? 'bg-premium-gold border-premium-gold text-premium-black' : 'border-white/5 bg-white/0 hover:bg-white/5 hover:border-premium-gold/30 text-white/40 hover:text-white'
                        }`}
                    >
                      <span>{cat}</span>
                      {filters.Fragrance_type === cat ? <FiCheck size={14} /> : <div className="w-1 h-1 bg-premium-gold/40 rounded-full group-hover:scale-150 transition-transform"></div>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Editable id="products_filter_price_header" fallback="Price Reserve">
                  <h3 className="text-[11px] font-black text-premium-gold uppercase tracking-[0.6em] mb-10 pb-4 border-b border-white/5">Price Reserve</h3>
                </Editable>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <span className="text-[8px] font-black text-premium-gold/30 uppercase tracking-[0.3em] block">Floor (₹)</span>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/5 p-4 text-[10px] font-bold text-white focus:border-premium-gold"
                        value={filters.price_min}
                        onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <span className="text-[8px] font-black text-premium-gold/30 uppercase tracking-[0.3em] block">Ceiling (₹)</span>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/5 p-4 text-[10px] font-bold text-white focus:border-premium-gold"
                        value={filters.price_max}
                        onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10">
                <Editable id="products_filter_clear_btn" fallback="Clear Selection">
                  <button
                    onClick={() => setFilters({ Fragrance_type: '', price_min: '', price_max: '', search: '' })}
                    className="w-full py-6 bg-premium-black border border-premium-gold/20 text-premium-gold text-[9px] font-black uppercase tracking-[0.5em] hover:bg-premium-gold hover:text-black transition-all duration-700 signature-shimmer"
                  >
                    Reset Archive
                  </button>
                </Editable>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`${isFilterOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-60 gap-10">
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-premium-gold/5 rounded-full"></div>
                  <div className="absolute inset-0 w-24 h-24 border-2 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border border-premium-gold/10 rounded-full animate-pulse"></div>
                </div>
                <p className="text-[10px] font-black text-premium-gold uppercase tracking-[1rem] animate-pulse">Distilling Essence...</p>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-60 border border-white/5 bg-white/[0.01] arabesque-border">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-12 border border-white/10">
                  <FiX className="text-premium-gold/50 w-8 h-8" />
                </div>
                <Editable id="products_empty_state_title" fallback="No matching signatures discovered">
                  <h3 className="text-4xl imperial-serif text-white mb-6">No matching <br/> signatures discovered</h3>
                </Editable>
                <Editable id="products_empty_state_desc" fallback="Refine your search parameters">
                  <p className="text-[10px] font-black text-premium-gold/40 uppercase tracking-[0.6em]">The archive remains silent</p>
                </Editable>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-x-10 gap-y-20 animate-in fade-in duration-1000`}>
                {filteredAndSortedProducts.map((product: any) => (
                  <div key={product.id} className="arabesque-border group">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
