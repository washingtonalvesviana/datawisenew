import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  UserCircle,
  X,
  Save,
  Lock,
  Database,
  Bot,
  ArrowLeftRight,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  type: 'Gestor' | 'Colaborador';
  status: 'active' | 'inactive';
  lastLogin: string;
  groups: string[];
  services: string[];
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    role: 'Admin',
    type: 'Gestor',
    status: 'active',
    lastLogin: '2024-03-15 14:30',
    groups: ['TI', 'Gestores', 'Administradores'],
    services: ['DataQueryWise', 'DBManageWise', 'LGPDQueryWise']
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '(11) 98888-8888',
    role: 'Analista',
    type: 'Colaborador',
    status: 'active',
    lastLogin: '2024-03-15 13:45',
    groups: ['Analistas', 'Suporte'],
    services: ['DataQueryWise', 'LGPDQueryWise']
  }
];

const availableGroups = [
  'TI',
  'Gestores',
  'Administradores',
  'Analistas',
  'Suporte',
  'Financeiro',
  'RH'
];

const availableServices = [
  'DataQueryWise',
  'DBManageWise',
  'LGPDQueryWise',
  'DPOQueryWise',
  'LegalQueryWise',
  'DataMigrateWise',
  'EasyApiWise',
  'AppGenWise'
];

interface UserForm {
  name: string;
  email: string;
  phone: string;
  type: 'Gestor' | 'Colaborador';
  role: string;
  password?: string;
  confirmPassword?: string;
  groups: string[];
  services: string[];
}

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    email: '',
    phone: '',
    type: 'Colaborador',
    role: '',
    password: '',
    confirmPassword: '',
    groups: [],
    services: []
  });
  const [errors, setErrors] = useState<Partial<UserForm>>({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<UserForm> = {};

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

    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório';
    }

    if (!formData.role) {
      newErrors.role = 'Cargo é obrigatório';
    }

    if (formData.password || formData.confirmPassword) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 8) {
        newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    } else if (!selectedUser) {
      newErrors.password = 'Senha é obrigatória';
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    }

    if (formData.groups.length === 0) {
      newErrors.groups = 'Selecione pelo menos um grupo';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Selecione pelo menos um serviço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedUser) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                type: formData.type,
                role: formData.role,
                groups: formData.groups,
                services: formData.services
              }
            : user
        )
      );
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
        role: formData.role,
        status: 'active',
        lastLogin: '-',
        groups: formData.groups,
        services: formData.services
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
    }

    handleCloseForm();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      type: user.type,
      role: user.role,
      groups: user.groups,
      services: user.services,
      password: '',
      confirmPassword: ''
    });
    setShowUserForm(true);
  };

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      if (selectedUser?.id === userToDelete) {
        setSelectedUser(null);
      }
    }
    setShowDeleteConfirmation(false);
  };

  const handleCloseForm = () => {
    setShowUserForm(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'Colaborador',
      role: '',
      password: '',
      confirmPassword: '',
      groups: [],
      services: []
    });
    setErrors({});
  };

  const handleGroupToggle = (group: string) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.includes(group)
        ? prev.groups.filter(g => g !== group)
        : [...prev.groups, group]
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'DataQueryWise':
        return <Database className="w-4 h-4" />;
      case 'DBManageWise':
        return <Database className="w-4 h-4" />;
      case 'LGPDQueryWise':
        return <Shield className="w-4 h-4" />;
      case 'DPOQueryWise':
        return <Shield className="w-4 h-4" />;
      case 'LegalQueryWise':
        return <Shield className="w-4 h-4" />;
      case 'DataMigrateWise':
        return <ArrowLeftRight className="w-4 h-4" />;
      case 'EasyApiWise':
        return <Code className="w-4 h-4" />;
      case 'AppGenWise':
        return <Bot className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500">Gerencie os usuários do sistema</p>
        </div>
        <button
          onClick={() => setShowUserForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grupos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviços
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Acesso
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <UserCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.type === 'Gestor'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.groups.map((group) => (
                      <span
                        key={group}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.services.map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs flex items-center"
                      >
                        {getServiceIcon(service)}
                        <span className="ml-1">{service}</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Gestor' | 'Colaborador' })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.type ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="Colaborador">Colaborador</option>
                    <option value="Gestor">Gestor</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-500">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.role ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {selectedUser ? 'Alterar Senha' : 'Definir Senha'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedUser ? 'Nova Senha' : 'Senha'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                        placeholder={selectedUser ? 'Digite para alterar a senha' : 'Digite a senha'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={`w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          errors.confirmPassword ? 'border-red-500' : ''
                        }`}
                        placeholder={selectedUser ? 'Confirme a nova senha' : 'Confirme a senha'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                {selectedUser && (
                  <p className="mt-2 text-sm text-gray-500">
                    Deixe os campos em branco para manter a senha atual.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grupos
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {availableGroups.map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => handleGroupToggle(group)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.groups.includes(group)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                  {errors.groups && (
                    <p className="text-xs text-red-500">{errors.groups}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviços
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {availableServices.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleServiceToggle(service)}
                        className={`px-3 py-1 rounded-full text-sm flex items-center ${
                          formData.services.includes(service)
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {getServiceIcon(service)}
                        <span className="ml-1">{service}</span>
                      </button>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-xs text-red-500">{errors.services}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando 1-10 de 50 resultados
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Anterior
          </button>
          <button className="px-3 py-1 border rounded bg-primary text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}