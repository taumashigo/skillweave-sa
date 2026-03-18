import { create } from "zustand";
import type {
  Profile,
  Module,
  Pathway,
  PathwayItem,
  PathwayValidation,
  Notification,
  LearnerDashboardStats,
} from "@/types";

// ============================================
// Auth Store
// ============================================
interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ============================================
// Pathway Builder Store
// ============================================
interface PathwayBuilderState {
  pathway: Pathway | null;
  items: PathwayItem[];
  availableModules: Module[];
  validation: PathwayValidation | null;
  isDragging: boolean;
  selectedModule: Module | null;

  setPathway: (pathway: Pathway | null) => void;
  setItems: (items: PathwayItem[]) => void;
  addItem: (item: PathwayItem) => void;
  removeItem: (itemId: string) => void;
  reorderItems: (items: PathwayItem[]) => void;
  setAvailableModules: (modules: Module[]) => void;
  setValidation: (validation: PathwayValidation | null) => void;
  setIsDragging: (dragging: boolean) => void;
  setSelectedModule: (module: Module | null) => void;
}

export const usePathwayBuilderStore = create<PathwayBuilderState>((set) => ({
  pathway: null,
  items: [],
  availableModules: [],
  validation: null,
  isDragging: false,
  selectedModule: null,

  setPathway: (pathway) => set({ pathway }),
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),
  reorderItems: (items) => set({ items }),
  setAvailableModules: (modules) => set({ availableModules: modules }),
  setValidation: (validation) => set({ validation }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setSelectedModule: (module) => set({ selectedModule: module }),
}));

// ============================================
// Notification Store
// ============================================
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
}));

// ============================================
// Catalogue Filter Store
// ============================================
interface CatalogueFilterState {
  search: string;
  pricingModel: string[];
  difficulty: string[];
  mode: string[];
  industry: string[];
  nqfLevel: string[];
  isAccredited: boolean | null;
  hasRemediation: boolean | null;
  employerEndorsed: boolean | null;
  sortBy: "relevance" | "rating" | "newest" | "price_low" | "price_high";

  setSearch: (search: string) => void;
  toggleFilter: (key: string, value: string) => void;
  setAccredited: (val: boolean | null) => void;
  setRemediation: (val: boolean | null) => void;
  setEmployerEndorsed: (val: boolean | null) => void;
  setSortBy: (sort: CatalogueFilterState["sortBy"]) => void;
  clearFilters: () => void;
}

export const useCatalogueFilterStore = create<CatalogueFilterState>(
  (set) => ({
    search: "",
    pricingModel: [],
    difficulty: [],
    mode: [],
    industry: [],
    nqfLevel: [],
    isAccredited: null,
    hasRemediation: null,
    employerEndorsed: null,
    sortBy: "relevance",

    setSearch: (search) => set({ search }),
    toggleFilter: (key, value) =>
      set((state) => {
        const arr = (state as any)[key] as string[];
        const next = arr.includes(value)
          ? arr.filter((v: string) => v !== value)
          : [...arr, value];
        return { [key]: next };
      }),
    setAccredited: (isAccredited) => set({ isAccredited }),
    setRemediation: (hasRemediation) => set({ hasRemediation }),
    setEmployerEndorsed: (employerEndorsed) => set({ employerEndorsed }),
    setSortBy: (sortBy) => set({ sortBy }),
    clearFilters: () =>
      set({
        search: "",
        pricingModel: [],
        difficulty: [],
        mode: [],
        industry: [],
        nqfLevel: [],
        isAccredited: null,
        hasRemediation: null,
        employerEndorsed: null,
        sortBy: "relevance",
      }),
  })
);
