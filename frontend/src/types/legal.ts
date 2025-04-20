import type { DataSource } from './knowledge';

export interface LegalParty {
  id: string;
  name: string;
  role: string;
  contact?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  type: 'contract' | 'policy' | 'agreement' | 'regulation' | 'lawsuit';
  createdAt: string;
  status: 'draft' | 'active' | 'review' | 'expired' | 'archived';
  parties: LegalParty[];
  description: string;
  dataSources: DataSource[];
  processNumber?: string;
  responsible: string;
  deadline?: string;
  updatedAt: string;
  tags: string[];
  groups: {
    id: string;
    name: string;
    userCount: number;
  }[];
}

export interface LegalDocumentFormData extends Omit<LegalDocument, 'id' | 'createdAt' | 'updatedAt'> {
  files: File[];
}