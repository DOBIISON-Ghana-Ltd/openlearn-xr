import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IStore } from './type'

export const sessionStore = create<IStore>()(
  persist(
    (set) => ({}),
    { name: 'session-store' }
  ),
);