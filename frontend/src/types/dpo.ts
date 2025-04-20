import type { DataSource } from './knowledge';

export interface DPOGroup {
  id: string;
  name: string;
  userCount: number;
}

export interface DPOFormData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  dataSources: DataSource[];
  groups: DPOGroup[];
  createdAt: string;
  updatedAt: string;
}