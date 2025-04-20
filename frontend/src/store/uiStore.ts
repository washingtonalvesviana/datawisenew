import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AlertMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIState {
  // Tema e preferências
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  
  // Gerenciamento de alertas e mensagens
  alerts: AlertMessage[];
  
  // Modal
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  modalTitle: string;
  
  // Ações
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  addAlert: (alert: Omit<AlertMessage, 'id'>) => void;
  removeAlert: (id: string) => void;
  
  openModal: (title: string, content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Estado inicial
      theme: 'light',
      sidebarCollapsed: false,
      alerts: [],
      isModalOpen: false,
      modalContent: null,
      modalTitle: '',
      
      // Ações
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      addAlert: (alert) => set((state) => ({ 
        alerts: [...state.alerts, { ...alert, id: Date.now().toString() }] 
      })),
      removeAlert: (id) => set((state) => ({ 
        alerts: state.alerts.filter(alert => alert.id !== id) 
      })),
      
      openModal: (title, content) => set({ isModalOpen: true, modalTitle: title, modalContent: content }),
      closeModal: () => set({ isModalOpen: false, modalContent: null, modalTitle: '' }),
    }),
    {
      name: 'ui-storage', // nome para o localStorage
      partialize: (state) => ({ 
        theme: state.theme, 
        sidebarCollapsed: state.sidebarCollapsed 
      }),
    }
  )
);