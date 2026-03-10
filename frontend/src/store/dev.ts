import { create } from 'zustand';

interface DevStore {
    isDevMode: boolean;
    toggleDevMode: () => void;
    setDevMode: (value: boolean) => void;
}

export const useDevStore = create<DevStore>((set) => ({
    isDevMode: false,
    toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
    setDevMode: (value) => set({ isDevMode: value }),
}));
