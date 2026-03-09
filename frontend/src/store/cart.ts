import { create } from 'zustand';
import { cartAPI } from '../lib/api';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  syncCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await cartAPI.getAll();
      if (data && data.length > 0) {
        const mappedItems = data.map((item: any) => ({
          product_id: item.product_id,
          name: item.products.name,
          price: item.products.price,
          quantity: item.quantity,
          image: item.products.image_url,
        }));
        set({ items: mappedItems });
        localStorage.setItem('cart', JSON.stringify(mappedItems));
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  syncCart: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await cartAPI.sync(get().items.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity
      })));
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  },

  addItem: (item) => {
    const items = [...get().items];
    const existing = items.find((i) => i.product_id === item.product_id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push(item);
    }
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
    get().syncCart();
  },

  removeItem: (productId) => {
    const items = get().items.filter((i) => i.product_id !== productId);
    set({ items });
    localStorage.setItem('cart', JSON.stringify(items));
    get().syncCart();
  },

  updateQuantity: (productId, quantity) => {
    const items = [...get().items];
    const itemIdx = items.findIndex((i) => i.product_id === productId);
    if (itemIdx > -1) {
      if (quantity <= 0) {
        items.splice(itemIdx, 1);
      } else {
        items[itemIdx].quantity = quantity;
      }
      set({ items });
      localStorage.setItem('cart', JSON.stringify(items));
      get().syncCart();
    }
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
    get().syncCart();
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const cart = localStorage.getItem('cart');
  if (cart) {
    useCartStore.setState({ items: JSON.parse(cart) });
  }
}

