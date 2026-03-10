import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistAPI } from '../lib/api';

interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    products: {
        id: string;
        name: string;
        price: number;
        image_url: string;
        Fragrance_type: string;
    };
}

interface WishlistState {
    items: WishlistItem[];
    loading: boolean;
    fetchWishlist: () => Promise<void>;
    addItem: (productId: string) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,

            fetchWishlist: async () => {
                set({ loading: true });
                try {
                    const { data } = await wishlistAPI.getAll();
                    set({ items: data });
                } catch (error) {
                    console.error('Failed to fetch wishlist:', error);
                } finally {
                    set({ loading: false });
                }
            },

            addItem: async (productId) => {
                try {
                    await wishlistAPI.add(productId);
                    await get().fetchWishlist();
                } catch (error) {
                    console.error('Failed to add to wishlist:', error);
                }
            },

            removeItem: async (productId) => {
                try {
                    await wishlistAPI.remove(productId);
                    set({ items: get().items.filter((item) => item.product_id !== productId) });
                } catch (error) {
                    console.error('Failed to remove from wishlist:', error);
                }
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.product_id === productId);
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
