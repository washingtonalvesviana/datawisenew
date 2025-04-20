import React, { useState } from 'react';
import { 
  KeyRound, 
  Mail, 
  Phone, 
  Save, 
  X, 
  User as UserIcon,
  Shield,
  Users,
  UserCog
} from 'lucide-react';
import type { ServiceId, Group } from '../types/services';

// TODO: Replace with real user data from backend API endpoint: /api/users/me
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'user@example.com',
  phone: '+55 11 99999-9999',
  type: 'Colaborador', // or 'Gestor'
  role: 'Analista de Dados',
  services: [
    'dataQueryWise',
    'dbManageWise',
    'lgpdQueryWise'
  ] as ServiceId[],
  groups: [
    { id: '1', name: 'RH' },
    { id: '2', name: 'Financeiro' }
  ] as Group[]
};

// TODO: Replace with real services data from backend API endpoint: /api/services
const availableServices = {
  dataQueryWise: 'DataQueryWise',
  dbManageWise: 'DBManageWise',
  lgpdQueryWise: 'LGPDQueryWise',
  dpoQueryWise: 'DPOQueryWise',
  legalQueryWise: 'LegalQueryWise',
  easyApiWise: 'EasyApiWise',
  appGenWise: 'AppGenWise',
  dataMigrateWise: 'DataMigrateWise'
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Profile() {
  const [formData, setFormData] = useState<FormData>({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'A nova senha deve ter pelo menos 8 caracteres';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // TODO: Replace with real API call to backend endpoint: /api/users/update-profile
      console.log('Updating profile with:', formData);
      
      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Perfil do Usuário</h1>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between">
                {successMessage}
                <button onClick={() => setSuccessMessage('')}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Password Section */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h2>
                
                {/* Current Password */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Role and Access Info */}
        <div className="space-y-6">
          {/* Type Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <UserCog className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Tipo</h2>
            </div>
            <p className="text-gray-700 font-medium">{mockUser.type}</p>
          </div>

          {/* Role Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Cargo</h2>
            </div>
            <p className="text-gray-700 font-medium">{mockUser.role}</p>
          </div>

          {/* Services Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Serviços</h2>
            </div>
            <div className="space-y-2">
              {mockUser.services.map((serviceId) => (
                <div
                  key={serviceId}
                  className="p-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
                >
                  {availableServices[serviceId]}
                </div>
              ))}
            </div>
          </div>

          {/* Groups Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Grupos</h2>
            </div>
            <div className="space-y-2">
              {mockUser.groups.map((group) => (
                <div
                  key={group.id}
                  className="p-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
                >
                  {group.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}