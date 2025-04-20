export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'oracle' | 'sqlserver';
  host: string;
  size: string;
  recordCount: number;
  schemas: DatabaseSchema[];
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
  recordCount: number;
}

export interface DatabaseSchema {
  name: string;
  tables: DatabaseTable[];
}

export interface MigrationConfig {
  sourceDb: DatabaseConnection;
  targetDb: DatabaseConnection;
  selectedSchemas: Record<string, boolean>;
  scheduleType: 'agora' | 'data' | 'semanal';
  scheduleDate?: string;
  scheduleTime?: string;
}