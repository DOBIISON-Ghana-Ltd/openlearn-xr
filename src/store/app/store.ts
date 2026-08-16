import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IStore } from './type'

export const appStore = create<IStore>()(
  persist(
    (set) => ({}),
    { name: 'app-store' }
  ),
);
