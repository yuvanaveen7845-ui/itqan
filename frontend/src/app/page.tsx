'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Select, Drawer, Badge, Button, Input } from 'antd';
import { ShoppingOutlined, SearchOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/store/cart';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Cart Drawer
  const [cartVisible, setCartVisible] = useState(false);
  const { items: cartItems, getTotal, removeItem } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await productAPI.getAll({ limit: 4 });
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-white min-h-screen text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .ant-drawer-title { font-weight: 700; letter-spacing: 0.05em; font-size: 1.1rem; }
      `}} />
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-5 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-4 md:hidden">
            <MenuOutlined className="text-2xl cursor-pointer text-gray-800" />
        </div>
        
        {/* Desktop Menu Left */}
        <div className="hidden md:flex items-center gap-8 text-[13px] uppercase font-semibold tracking-wider text-gray-600">
            <Link href="/" className="text-black border-b-2 border-[#C8A165] pb-1">Home</Link>
            <Link href="/products" className="hover:text-[#C8A165] transition-colors">Shop All</Link>
            <Link href="#" className="hover:text-[#C8A165] transition-colors">Bestsellers</Link>
            <Link href="#" className="hover:text-[#C8A165] transition-colors">Perfumes</Link>
        </div>

        {/* Logo Center */}
        <div className="text-2xl md:text-[28px] font-black uppercase tracking-[0.2em] text-center flex-1 md:flex-none text-black">
            BELLAVITA
        </div>

        {/* Desktop Menu Right + Icons */}
        <div className="flex items-center gap-6 justify-end">
            <div className="hidden lg:flex items-center gap-8 text-[13px] uppercase font-semibold tracking-wider text-gray-600 mr-4">
                <Link href="#" className="hover:text-[#C8A165] transition-colors">Bath & Body</Link>
                <Link href="#" className="hover:text-[#C8A165] transition-colors">Skincare</Link>
                <Link href="#" className="hover:text-[#C8A165] transition-colors">Gifting</Link>
            </div>
            
            <div className="flex items-center gap-5 text-2xl text-gray-800">
                {searchOpen ? (
                   <Input 
                     autoFocus
                     placeholder="Search..." 
                     className="w-48 rounded-full border-gray-300 font-poppins"
                     onBlur={() => setSearchOpen(false)}
                     prefix={<SearchOutlined />}
                   />
                ) : (
                   <SearchOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors" onClick={() => setSearchOpen(true)} />
                )}
                <UserOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors hidden sm:block" />
                <Badge count={cartItemCount} color="#C8A165" offset={[-2, 4]} size="small">
                    <ShoppingOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors text-2xl" onClick={() => setCartVisible(true)} />
                </Badge>
            </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <Drawer
        title="YOUR CART"
        placement="right"
        onClose={() => setCartVisible(false)}
        open={cartVisible}
        width={400}
        drawerStyle={{ backgroundColor: '#fff', fontFamily: "'Poppins', sans-serif" }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '24px' }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', padding: '0' }}
      >
        {cartItems.length === 0 ? (
            <div className="text-center py-32 px-8 flex flex-col items-center">
                <ShoppingOutlined className="text-6xl text-gray-200 mb-6" />
                <p className="text-gray-500 font-medium mb-8">Your cart is currently empty.</p>
                <Button type="primary" onClick={() => setCartVisible(false)} className="bg-black hover:bg-gray-800 border-none h-12 uppercase tracking-wide font-semibold px-8 rounded-md">
                    Continue Shopping
                </Button>
            </div>
        ) : (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.product_id} className="flex gap-5 border-b border-gray-100 pb-6">
                           <div className="w-24 h-24 bg-[#f8f8f8] rounded-md flex items-center justify-center p-2 flex-shrink-0">
                               <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                           </div>
                           <div className="flex-1 flex flex-col pt-1">
                               <h4 className="text-[13px] font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">{item.name}</h4>
                               <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-auto">Qty: {item.quantity}</p>
                               <div className="flex justify-between items-center mt-3">
                                   <span className="font-bold text-[15px]">₹{item.price}</span>
                                   <button onClick={() => removeItem(item.product_id)} className="text-[11px] uppercase tracking-wide text-gray-400 hover:text-black transition-colors font-semibold">Remove</button>
                               </div>
                           </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-100 p-6 bg-gray-50 mt-auto">
                    <div className="flex justify-between items-center mb-6 text-lg font-bold text-gray-900">
                        <span>Subtotal</span>
                        <span>₹{getTotal()}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-6">Taxes and shipping calculated at checkout</p>
                    <Link href="/checkout">
                      <Button type="primary" block className="bg-black hover:bg-gray-800 border-none h-[52px] uppercase tracking-[0.1em] font-semibold text-[13px] rounded-lg">
                          Proceed to Checkout
                      </Button>
                    </Link>
                </div>
            </div>
        )}
      </Drawer>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[85vh] bg-[#fafafa]">
        <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2500" 
            alt="Luxury Perfume" 
            className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
            <div className="px-8 md:px-24">
               <h2 className="text-[#C8A165] font-bold uppercase tracking-[0.25em] text-sm md:text-md mb-6">New Arrivals</h2>
               <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight max-w-2xl">
                 Crafted for the <br/>Senses.
               </h1>
               <p className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-lg">
                 Experience our new collection of luxury Eau de Parfums designed to leave a lasting impression.
               </p>
               <Link href="/products">
                 <Button type="primary" size="large" className="bg-white hover:bg-gray-100 text-black uppercase tracking-[0.15em] font-semibold px-12 border-none h-14 rounded-full text-sm shadow-xl">
                    Shop The Collection
                 </Button>
               </Link>
            </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
            <div>
               <h3 className="text-[#a68249] font-bold uppercase tracking-[0.2em] text-xs mb-3">Our Signature Range</h3>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Bestsellers</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold uppercase tracking-wider text-gray-500 hover:text-black transition-colors hidden sm:block">
                View All →
            </Link>
        </div>

        {loading ? (
            <div className="flex justify-center py-24">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#C8A165] rounded-full animate-spin"></div>
            </div>
        ) : (
            <Row gutter={[24, 48]}>
                {featuredProducts.length > 0 ? (
                    featuredProducts.map((product, index) => (
                        <Col xs={24} sm={12} lg={6} key={product.id}>
                            <ProductCard product={product} badge={index % 2 === 0 ? "Bestseller" : "New"} />
                        </Col>
                    ))
                ) : (
                    <div className="w-full text-center py-20 text-gray-400 font-semibold tracking-wider uppercase">
                        No products available.
                    </div>
                )}
            </Row>
        )}
      </section>

      {/* Categories Banner Section */}
      <section className="py-24 bg-[#fdfaf6]">
         <div className="max-w-[1400px] mx-auto px-5 md:px-10 text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-16">Shop by Category</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="relative aspect-[4/5] overflow-hidden group cursor-pointer bg-black/5 rounded-2xl">
                    <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800" alt="For Her" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-2xl font-bold text-white mb-2">For Her</h3>
                        <p className="text-white/70 text-sm font-medium">Discover elegant florals</p>
                    </div>
                 </div>
                 <div className="relative aspect-[4/5] overflow-hidden group cursor-pointer bg-black/5 rounded-2xl">
                    <img src="https://images.unsplash.com/photo-1615634260167-98cbce11bc0e?auto=format&fit=crop&q=80&w=800" alt="For Him" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-2xl font-bold text-white mb-2">For Him</h3>
                        <p className="text-white/70 text-sm font-medium">Explore woody & spicy notes</p>
                    </div>
                 </div>
                 <div className="relative aspect-[4/5] overflow-hidden group cursor-pointer bg-black/5 rounded-2xl">
                    <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800" alt="Unisex" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-2xl font-bold text-white mb-2">Unisex</h3>
                        <p className="text-white/70 text-sm font-medium">A blend of universal appeal</p>
                    </div>
                 </div>
             </div>
         </div>
      </section>

      {/* Brand Story Footer */}
      <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12 text-center">
         <h2 className="text-[#C8A165] text-xl font-bold tracking-[0.2em] mb-4 uppercase">BELLAVITA</h2>
         <p className="max-w-2xl mx-auto text-gray-400 font-light leading-relaxed mb-16">
            We believe that a scent is the most intimate branding you can wear. 
            Crafted with the finest ingredients, our perfumes are designed to evoke memories and leave an unforgettable signature.
         </p>
         <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
             <span>© 2026 BELLAVITA PERFUMES. ALL RIGHTS RESERVED.</span>
             <div className="flex gap-6">
                 <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                 <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                 <Link href="#" className="hover:text-white transition-colors">Contact</Link>
             </div>
         </div>
      </footer>
    </div>
  );
}
