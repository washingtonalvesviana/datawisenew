import { apiGet, apiPost, apiPut, apiDelete } from './index';
import { useLGPDStore } from '../../store/lgpdStore';

interface PersonalData {
  id: string;
  name: string;
  category: string;
  source: string;
  sensitivity: 'low' | 'medium' | 'high';
  description?: string;
}

interface AnalysisConfig {
  sensitivity: 'low' | 'medium' | 'high';
  includeContext: boolean;
  identifyPatterns: boolean;
  checkCompliance: boolean;
  generateRecommendations: boolean;
}

interface AnalysisResult {
  id: string;
  personalData: PersonalData[];
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  recommendations?: string[];
  compliance?: {
    score: number;
    issues: Array<{
      severity: 'low' | 'medium' | 'high';
      description: string;
      recommendation: string;
    }>;
  };
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  config: AnalysisConfig;
  createdAt: string;
  updatedAt: string;
}

export const LGPDService = {
  /**
   * Obtém todos os dados pessoais
   */
  getAllPersonalData: async () => {
    const response = await apiGet<PersonalData[]>('/lgpd/personal-data');
    // Atualiza o store
    useLGPDStore.getState().setPersonalData(response);
    return response;
  },

  /**
   * Obtém um registro de dados pessoais por ID
   */
  getPersonalDataById: async (id: string) => {
    return await apiGet<PersonalData>(`/lgpd/personal-data/${id}`);
  },

  /**
   * Cria um novo registro de dados pessoais
   */
  createPersonalData: async (data: Omit<PersonalData, 'id'>) => {
    const response = await apiPost<PersonalData>('/lgpd/personal-data', data);
    // Atualiza o store
    useLGPDStore.getState().addPersonalData(response);
    return response;
  },

  /**
   * Atualiza um registro de dados pessoais
   */
  updatePersonalData: async (id: string, data: Partial<PersonalData>) => {
    const response = await apiPut<PersonalData>(`/lgpd/personal-data/${id}`, data);
    // Atualiza o store
    useLGPDStore.getState().updatePersonalData(id, data);
    return response;
  },

  /**
   * Remove um registro de dados pessoais
   */
  deletePersonalData: async (id: string) => {
    await apiDelete(`/lgpd/personal-data/${id}`);
    // Atualiza o store
    useLGPDStore.getState().removePersonalData(id);
  },

  /**
   * Obtém todos os templates
   */
  getTemplates: async () => {
    const response = await apiGet<Template[]>('/lgpd/templates');
    useLGPDStore.getState().setTemplates(response);
    return response;
  },

  /**
   * Inicia uma análise LGPD
   */
  startAnalysis: async (config: AnalysisConfig) => {
    return await apiPost<{ analysisId: string }>('/lgpd/analysis', { config });
  },

  /**
   * Obtém o resultado de uma análise
   */
  getAnalysisResult: async (analysisId: string) => {
    return await apiGet<AnalysisResult>(`/lgpd/analysis/${analysisId}`);
  },
};