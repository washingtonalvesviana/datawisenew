import { apiGet, apiPost } from './index';
import { useAuthStore } from '../../store/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const AuthService = {
  /**
   * Realiza login do usuário
   */
  login: async (credentials: LoginCredentials) => {
    const response = await apiPost<LoginResponse>('/auth/login', credentials);
    
    // Salva os dados no store de autenticação
    useAuthStore.getState().login(response.user, response.token);
    
    return response;
  },

  /**
   * Realiza logout do usuário
   */
  logout: async () => {
    try {
      await apiPost('/auth/logout');
    } finally {
      useAuthStore.getState().logout();
    }
  },

  /**
   * Registra um novo usuário
   */
  register: async (userData: RegisterData) => {
    return await apiPost<{ message: string }>('/auth/register', userData);
  },

  /**
   * Verifica se o token é válido
   */
  validateToken: async () => {
    try {
      const response = await apiGet<{ valid: boolean }>('/auth/validate-token');
      return response.valid;
    } catch (error) {
      useAuthStore.getState().logout();
      return false;
    }
  },

  /**
   * Solicita recuperação de senha
   */
  forgotPassword: async (email: string) => {
    return await apiPost<{ message: string }>('/auth/forgot-password', { email });
  },

  /**
   * Redefine senha com token
   */
  resetPassword: async (token: string, newPassword: string) => {
    return await apiPost<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    });
  },
};