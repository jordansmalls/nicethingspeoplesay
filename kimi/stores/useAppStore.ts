import { create } from "zustand";
import { User, Thing } from "@/types";

type AppStore = {
  /* ================= USER STATE ================= */
  user: User | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  logoutUser: () => void;

  /* ================= THINGS STATE ================= */
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

  /* ================= UI STATE ================= */
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (thing: Thing) => void;
  closeEditModal: () => void;
  openDeleteModal: (thing: Thing) => void;
  closeDeleteModal: () => void;

  /* ================= EXPORT STATE ================= */
  exportFormat: "json" | "txt";
  isExporting: boolean;

  setExportFormat: (format: "json" | "txt") => void;
  setExporting: (state: boolean) => void;

  /* ================= ERROR STATE ================= */
  error: string | null;
  setError: (message: string | null) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  /* ================= USER STATE ================= */
  user: null,
  isAuthLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, isAuthLoading: false }),
  logoutUser: () => set({ user: null, isAuthenticated: false, things: [] }),

  /* ================= THINGS STATE ================= */
  things: [],
  selectedThing: null,

  isThingsLoading: false,
  isMutatingThing: false,

  setThings: (things) => set({ things }),
  addThing: (thing) => set((state) => ({ things: [thing, ...state.things] })),
  updateThingInState: (thing) =>
    set((state) => ({
      things: state.things.map((t) => (t._id === thing._id ? thing : t)),
    })),
  removeThing: (thingId) =>
    set((state) => ({
      things: state.things.filter((t) => t._id !== thingId),
    })),
  clearThings: () => set({ things: [] }),

  setSelectedThing: (thing) => set({ selectedThing: thing }),

  /* ================= UI STATE ================= */
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openEditModal: (thing) => set({ isEditModalOpen: true, selectedThing: thing }),
  closeEditModal: () => set({ isEditModalOpen: false, selectedThing: null }),
  openDeleteModal: (thing) => set({ isDeleteModalOpen: true, selectedThing: thing }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedThing: null }),

  /* ================= EXPORT STATE ================= */
  exportFormat: "json",
  isExporting: false,

  setExportFormat: (format) => set({ exportFormat: format }),
  setExporting: (state) => set({ isExporting: state }),

  /* ================= ERROR STATE ================= */
  error: null,
  setError: (message) => set({ error: message }),
}));