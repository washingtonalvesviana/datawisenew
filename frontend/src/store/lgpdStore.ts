import { create } from 'zustand';

interface PersonalData {
  id: string;
  name: string;
  category: string;
  source: string;
  sensitivity: 'low' | 'medium' | 'high';
  description?: string;
}

interface LGPDState {
  personalData: PersonalData[];
  templates: any[];
  isLoading: boolean;
  error: string | null;
  
  // Ações
  setPersonalData: (data: PersonalData[]) => void;
  addPersonalData: (data: PersonalData) => void;
  removePersonalData: (id: string) => void;
  updatePersonalData: (id: string, data: Partial<PersonalData>) => void;
  
  setTemplates: (templates: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLGPDStore = create<LGPDState>((set) => ({
  personalData: [],
  templates: [],
  isLoading: false,
  error: null,
  
  setPersonalData: (data) => set({ personalData: data }),
  addPersonalData: (data) => 
    set((state) => ({ personalData: [...state.personalData, data] })),
  removePersonalData: (id) => 
    set((state) => ({ 
      personalData: state.personalData.filter(item => item.id !== id) 
    })),
  updatePersonalData: (id, data) => 
    set((state) => ({ 
      personalData: state.personalData.map(item => 
        item.id === id ? { ...item, ...data } : item
      ) 
    })),
  
  setTemplates: (templates) => set({ templates }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));