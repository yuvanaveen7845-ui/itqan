// Bellavita UI: Global Header
'use client';

import { useState } from 'react';
import { Drawer, Badge, Button, Input } from 'antd';
import { ShoppingOutlined, SearchOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  
  const { items: cartItems, getTotal, removeItem } = useCartStore();
  const { user, logout } = useAuthStore();

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ant-drawer-title { font-weight: 700; letter-spacing: 0.05em; font-size: 1.1rem; }
      `}} />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 py-5 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-4 md:hidden">
            <MenuOutlined className="text-2xl cursor-pointer text-gray-800" />
        </div>
        
        {/* Desktop Menu Left */}
        <div className="hidden md:flex items-center gap-8 text-[13px] uppercase font-semibold tracking-wider text-gray-600">
            <Link href="/" className="hover:text-[#C8A165] transition-colors">Home</Link>
            <Link href="/products" className="hover:text-[#C8A165] transition-colors">Shop All</Link>
            <Link href="/products" className="hover:text-[#C8A165] transition-colors">Bestsellers</Link>
            <Link href="/products" className="hover:text-[#C8A165] transition-colors">Perfumes</Link>
        </div>

        {/* Logo Center */}
        <Link href="/" className="text-2xl md:text-[28px] font-black uppercase tracking-[0.2em] text-center flex-1 md:flex-none text-black hover:text-[#C8A165] transition-colors">
            BELLAVITA
        </Link>

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
                
                {user ? (
                   <div className="group relative">
                      <Link href="/profile" className="hidden sm:block">
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors">
                           {user.name.charAt(0)}
                         </div>
                      </Link>
                      <div className="absolute top-full right-0 mt-2 bg-white shadow-xl border border-gray-100 rounded-md p-2 hidden group-hover:block w-48 z-50">
                          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 uppercase tracking-wider font-semibold">Profile</Link>
                          {(user.role === 'admin' || user.role === 'super_admin') && (
                              <Link href="/admin" className="block px-4 py-2 text-sm text-[#C8A165] hover:bg-gray-50 uppercase tracking-wider font-semibold">Admin Panel</Link>
                          )}
                          <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 uppercase tracking-wider font-semibold">Logout</button>
                      </div>
                   </div>
                ) : (
                   <Link href="/login" className="hidden sm:block"><UserOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors text-2xl" /></Link>
                )}

                <Badge count={cartItemCount} color="#C8A165" offset={[-2, 4]} size="small">
                    <ShoppingOutlined className="cursor-pointer hover:text-[#C8A165] transition-colors text-2xl" onClick={() => setCartVisible(true)} />
                </Badge>
            </div>
        </div>
      </header>

      {/* Global Cart Drawer */}
      <Drawer
        title="YOUR CART"
        placement="right"
        onClose={() => setCartVisible(false)}
        open={cartVisible}
        width={400}
        styles={{ 
            body: { display: 'flex', flexDirection: 'column', padding: '0' },
            header: { borderBottom: '1px solid #f0f0f0', padding: '24px' }
        }}
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
    </>
  );
}
