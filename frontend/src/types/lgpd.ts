import type { DataSource } from './knowledge';

export interface PersonalDataQuantity {
  type: string;
  volume: number;
  retentionPeriod: string;
  legalBasis: string;
  purpose: string;
}

export interface SensitiveData {
  category: string;
  handlingRequirements: string[];
  securityMeasures: string[];
}

export interface LGPDGroup {
  id: string;
  name: string;
  userCount: number;
}

export interface PersonalData {
  id: string;
  field: string;
  type: 'personal' | 'sensitive';
  category: string;
  source: string;
  context: string;
  identified: boolean;
  quantity: PersonalDataQuantity;
  dataFlow?: string[];
  processingActivities?: string[];
}

export interface LGPDTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  dataSources: DataSource[];
  personalData: PersonalData[];
  sensitiveData: SensitiveData[];
  groups: LGPDGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface LGPDAnalysisConfig {
  sensitivity: 'low' | 'medium' | 'high';
  includeContext: boolean;
  identifyPatterns: boolean;
  checkCompliance: boolean;
  generateRecommendations: boolean;
}