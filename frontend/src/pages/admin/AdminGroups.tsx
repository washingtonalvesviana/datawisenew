import React, { useState } from 'react';
import { 
  Users,
  Search, 
  Plus,
  Edit,
  Trash2,
  UserCircle,
  X,
  Save
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

// TODO: Replace with real data from API
const initialGroups: Group[] = [
  {
    id: '1',
    name: 'Administradores',
    description: 'Grupo com acesso total ao sistema',
    members: 5,
    createdAt: '2024-03-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Gestores',
    description: 'Acesso a relatórios e dashboards',
    members: 12,
    createdAt: '2024-03-14',
    status: 'active'
  },
  {
    id: '3',
    name: 'Analistas',
    description: 'Acesso a consultas e análises',
    members: 25,
    createdAt: '2024-03-13',
    status: 'active'
  }
];

interface GroupForm {
  name: string;
  description: string;
}

export function AdminGroups() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<GroupForm>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<GroupForm>>({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<GroupForm> = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedGroup) {
      // Update existing group
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === selectedGroup.id 
            ? { 
                ...group, 
                name: formData.name, 
                description: formData.description 
              }
            : group
        )
      );
    } else {
      // Create new group
      const newGroup: Group = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        members: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setGroups(prevGroups => [...prevGroups, newGroup]);
    }

    handleCloseForm();
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description
    });
    setShowGroupForm(true);
  };

  const handleDelete = (groupId: string) => {
    setGroupToDelete(groupId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (groupToDelete) {
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupToDelete));
      if (selectedGroup?.id === groupToDelete) {
        setSelectedGroup(null);
      }
    }
  };

  const handleCloseForm = () => {
    setShowGroupForm(false);
    setSelectedGroup(null);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grupos</h1>
          <p className="text-gray-500">Gerencie os grupos de usuários</p>
        </div>
        <button
          onClick={() => setShowGroupForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Grupo</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar grupos..."
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

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(group)}
                  className="p-1 text-gray-500 hover:text-primary"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(group.id)}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Group Stats */}
            <div className="flex items-center justify-between py-3 border-t border-b">
              <div className="flex items-center space-x-2">
                <UserCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{group.members} membros</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                group.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {group.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {/* Created At */}
            <div className="mt-4 text-xs text-gray-500">
              Criado em: {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Group Form Modal */}
      {showGroupForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {selectedGroup ? 'Editar Grupo' : 'Novo Grupo'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Grupo
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
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                )}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Grupo"
        message="Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
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