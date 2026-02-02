// stores/useAppStore.ts
import { create } from "zustand";

interface User {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Thing {
  _id: string;
  thing: string;
  who: string;
  why?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppStore {
  user: User | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logoutUser: () => void;
  things: Thing[];
  selectedThing: Thing | null;
  isThingsLoading: boolean;
  isMutatingThing: boolean;
  setThings: (things: Thing[]) => void;
  addThing: (thing: Thing) => void;
  updateThingInState: (thing: Thing) => void;
  removeThing: (thingId: string) => void;
  clearThings: () => void;
  setSelectedThing: (thing: Thing | null) => void;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (thing: Thing) => void;
  closeEditModal: () => void;
  openDeleteModal: (thing: Thing) => void;
  closeDeleteModal: () => void;
  exportFormat: "json" | "txt";
  isExporting: boolean;
  setExportFormat: (format: "json" | "txt") => void;
  setExporting: (state: boolean) => void;
  error: string | null;
  setError: (message: string | null) => void;
  setAuthLoading?: (state: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  isAuthLoading: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logoutUser: () => set({ user: null, isAuthenticated: false, things: [] }),
  things: [],
  selectedThing: null,
  isThingsLoading: false,
  isMutatingThing: false,
  setThings: (things) => set({ things }),
  addThing: (thing) => set({ things: [...get().things, thing] }),
  updateThingInState: (updated) =>
    set({ things: get().things.map((t) => (t._id === updated._id ? updated : t)) }),
  removeThing: (id) => set({ things: get().things.filter((t) => t._id !== id) }),
  clearThings: () => set({ things: [] }),
  setSelectedThing: (thing) => set({ selectedThing: thing }),
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openEditModal: (thing) => set({ isEditModalOpen: true, selectedThing: thing }),
  closeEditModal: () => set({ isEditModalOpen: false, selectedThing: null }),
  openDeleteModal: (thing) => set({ isDeleteModalOpen: true, selectedThing: thing }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedThing: null }),
  exportFormat: "json",
  isExporting: false,
  setExportFormat: (format) => set({ exportFormat: format }),
  setExporting: (state) => set({ isExporting: state }),
  error: null,
  setError: (message) => set({ error: message }),
  setAuthLoading: (state) => set({ isAuthLoading: state }),
}));