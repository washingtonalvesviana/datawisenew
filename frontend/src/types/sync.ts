export interface SyncTask {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  type: 'one-way' | 'bidirectional';
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  lastSync?: string;
  nextSync?: string;
  source: {
    name: string;
    type: string;
    endpoint: string;
  };
  target: {
    name: string;
    type: string;
    endpoint: string;
  };
  metrics: {
    successRate: number;
    latency: string;
    recordsProcessed: number;
    dataVolume: string;
    errors: number;
    warnings: number;
  };
  config: {
    filters?: string[];
    transformations?: string[];
    retryAttempts: number;
    timeout: string;
  };
  logs: {
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
  }[];
}