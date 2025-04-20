export interface Category {
  id: string;
  name: string;
  description: string;
  modules: number;
  icon: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'file' | 'url' | 'gdoc' | 'folder';
  status?: 'active' | 'inactive' | 'processing';
  path?: string;
  url?: string;
  lastSync?: string;
  size?: string;
  itemCount?: number;
  metadata?: {
    connection?: string;
    selection?: {
      schemas: string[];
      tables: { [schema: string]: string[] };
      columns: { [table: string]: string[] };
    };
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  dataSources: DataSource[];
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  groups: {
    id: string;
    name: string;
    userCount: number;
  }[];
}

export interface ModuleForm {
  title: string;
  description: string;
  category: string;
  dataSources: DataSource[];
  groups: string[];
  status: 'active' | 'draft' | 'archived';
}