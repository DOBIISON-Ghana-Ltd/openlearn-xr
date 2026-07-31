import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IStore } from './type'

export const editorStore = create<IStore>()(
  persist(
    (set) => ({}),
    { name: 'editor-store' }
  ),
);