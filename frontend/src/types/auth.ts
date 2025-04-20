export type UserRole = 'admin' | 'manager' | 'collaborator';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  created_at: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}