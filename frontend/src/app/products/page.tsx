'use client';

import { useEffect, useState } from 'react';
import Editable from '@/components/Editable';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { FiSliders, FiX, FiCheck, FiSearch } from 'react-icons/fi';

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Simple Header */}
      <section className="bg-white pt-24 sm:pt-32 pb-6 px-4 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto text-center">
            <Editable id="products_title" type="text" fallback="All Perfumes">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2 font-inter">
                All Perfumes
              </h1>
            </Editable>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 w-full py-6">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-semibold uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors rounded-sm"
          >
            <FiSliders size={16} />
            {isFilterOpen ? 'Hide Filters' : 'Filter'}
          </button>

          <Editable id="products_count_label" type="text" fallback="Products">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {filteredAndSortedProducts.length} Products
            </div>
          </Editable>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider hidden sm:block">Sort By:</span>
            <div className="relative group">
              <select
                className="bg-white border border-gray-300 rounded-sm px-4 py-2 pr-10 text-sm font-semibold uppercase tracking-wider text-gray-700 focus:border-black outline-none cursor-pointer appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetically, A-Z</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <FiSliders size={12} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0 bg-white p-6 border border-gray-200 rounded-sm lg:sticky lg:top-24 mb-6 lg:mb-0 w-full`}>
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Search</h3>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:bg-white focus:border-black transition-all rounded-sm"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <Editable id="products_filter_family_header" fallback="Category">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Category</h3>
                </Editable>
                <div className="flex flex-col gap-1">
                  {['Oud', 'Floral', 'Spicy', 'Oriental', 'Fresh'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group py-1">
                      <input 
                        type="checkbox"
                        checked={filters.Fragrance_type === cat}
                        onChange={() => setFilters({ ...filters, Fragrance_type: filters.Fragrance_type === cat ? '' : cat })}
                        className="w-4 h-4 rounded-sm border-gray-300 text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Editable id="products_filter_price_header" fallback="Price Range">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Price Range</h3>
                </Editable>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-gray-50 border border-gray-200 p-2 text-sm focus:border-black rounded-sm"
                    value={filters.price_min}
                    onChange={(e) => setFilters({ ...filters, price_min: e.target.value })}
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-gray-50 border border-gray-200 p-2 text-sm focus:border-black rounded-sm"
                    value={filters.price_max}
                    onChange={(e) => setFilters({ ...filters, price_max: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Editable id="products_filter_clear_btn" fallback="Clear Filters">
                  <button
                    onClick={() => setFilters({ Fragrance_type: '', price_min: '', price_max: '', search: '' })}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
                  >
                    Clear Filters
                  </button>
                </Editable>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 w-full relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-40 bg-white border border-gray-200 rounded-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiX className="text-gray-400 w-6 h-6" />
                </div>
                <Editable id="products_empty_state_title" fallback="No products found">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                </Editable>
                <Editable id="products_empty_state_desc" fallback="Try removing some filters.">
                  <p className="text-gray-500">Try removing some filters.</p>
                </Editable>
              </div>
            ) : (
              <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-6`}>
                {filteredAndSortedProducts.map((product: any, index: number) => {
                  const elements = [
                    <div key={product.id}>
                        <ProductCard product={product} />
                    </div>
                  ];

                  // Promotional Banner Injection after every 9th item (to mimic fragrance finder banner)
                  if (index === 8) {
                     elements.push(
                       <div key={`promo-banner-${index}`} className="col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 bg-[#fdf3e7] p-8 md:p-12 my-2 flex flex-col md:flex-row items-center justify-between text-center md:text-left rounded-sm border border-[#e2a868]/20 shadow-sm gap-6">
                           <div className="flex-1">
                               <h2 className="text-[#e2a868] text-2xl md:text-3xl font-black uppercase tracking-[0.1em] mb-2 font-inter">FRAGRANCE FINDER</h2>
                               <p className="text-gray-800 font-medium text-sm md:text-base">Discover your new favourite scents! Match your personality.</p>
                           </div>
                           <button className="bg-[#e2a868] hover:bg-[#c9955c] text-white px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap shadow-md">
                               SHOP SALE →
                           </button>
                       </div>
                     );
                  }
                  return elements;
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* FAQs Section */}
        <div className="mt-24 border-t border-gray-200 pt-16 pb-24">
            <Editable id="products_faq_title" type="text" fallback="FAQs">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-inter">FAQs</h2>
            </Editable>
            
            <div className="space-y-6 max-w-4xl text-left">
              <div>
                 <Editable id="products_faq_1_q" fallback="Where are the products made?">
                    <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Where are the products made?</h4>
                 </Editable>
                 <Editable id="products_faq_1_a" type="richtext" fallback="All our products are proudly manufactured using premium ingredients ensuring the best quality.">
                    <p className="text-gray-600 text-sm leading-relaxed">All our products are proudly manufactured using premium ingredients ensuring the best quality.</p>
                 </Editable>
              </div>
              <div>
                 <Editable id="products_faq_2_q" fallback="Are your products cruelty-free?">
                    <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">Are your products cruelty-free?</h4>
                 </Editable>
                 <Editable id="products_faq_2_a" type="richtext" fallback="Yes, we are a 100% cruelty-free brand. We do not test any of our products on animals.">
                    <p className="text-gray-600 text-sm leading-relaxed">Yes, we are a 100% cruelty-free brand. We do not test any of our products on animals.</p>
                 </Editable>
              </div>
              <div>
                 <Editable id="products_faq_3_q" fallback="How long do the perfumes last?">
                    <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">How long do the perfumes last?</h4>
                 </Editable>
                 <Editable id="products_faq_3_a" type="richtext" fallback="Our perfumes usually last up to 6-8 hours depending on your body chemistry and environment.">
                    <p className="text-gray-600 text-sm leading-relaxed">Our perfumes usually last up to 6-8 hours depending on your body chemistry and environment.</p>
                 </Editable>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}
