import { create } from 'zustand'

export const useStore = create((set) => ({
  isAddTransactionOpen: false,
  setAddTransactionOpen: (isOpen) => set({ isAddTransactionOpen: isOpen }),
}))