// Add these new types to the existing file
export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: {
    query?: Parameter[];
    body?: Parameter[];
    headers?: Parameter[];
  };
  responses: {
    [key: string]: {
      description: string;
      schema: any;
    };
  };
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'apiKey';
    required: boolean;
  };
  version: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'deprecated';
}

export interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  default?: any;
}

export interface ApiDeployment {
  id: string;
  environment: 'development' | 'staging' | 'production';
  url: string;
  version: string;
  deployedAt: string;
  status: 'deploying' | 'active' | 'failed';
  error?: string;
}