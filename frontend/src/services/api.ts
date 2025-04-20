import { createClient } from '@supabase/supabase-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    return response.json();
  },

  // API endpoints matching Python backend routes
  endpoints: {
    queries: {
      getStats: () => api.fetch('/api/queries/stats'),
      getDistribution: () => api.fetch('/api/queries/distribution'),
      getTrends: () => api.fetch('/api/queries/trends'),
    },
    databases: {
      getConnected: () => api.fetch('/api/databases/connected'),
      getStatus: () => api.fetch('/api/databases/status'),
    },
    users: {
      getCurrent: () => api.fetch('/api/users/me'),
      getAll: () => api.fetch('/api/users'),
    },
  },
};