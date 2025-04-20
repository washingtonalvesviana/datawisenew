import React, { useState } from 'react';
import { Book, Search, Plus, Filter } from 'lucide-react';
import { CategoryCard } from '../../components/knowledge/CategoryCard';
import { ModuleCard } from '../../components/knowledge/ModuleCard';
import { ModuleForm } from '../../components/knowledge/ModuleForm';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { Category, Module, ModuleForm as IModuleForm } from '../../types/knowledge';

// TODO: Replace with real data from API
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Documentação Técnica',
    description: 'Documentação de sistemas e APIs',
    modules: 15,
    icon: '📚'
  },
  {
    id: '2',
    name: 'Processos Internos',
    description: 'Documentação de processos e fluxos',
    modules: 8,
    icon: '📋'
  },
  {
    id: '3',
    name: 'Políticas',
    description: 'Políticas e normas da empresa',
    modules: 12,
    icon: '📜'
  }
];

// TODO: Replace with real data from API
const mockModules: Module[] = [
  {
    id: '1',
    title: 'Documentação Sistema Financeiro',
    description: 'Base de conhecimento do sistema financeiro',
    category: 'Documentação Técnica',
    status: 'active',
    dataSources: [
      {
        id: '1',
        name: 'Banco de Dados Financeiro',
        type: 'database',
        status: 'active',
        path: 'finance_db',
        lastSync: '2024-03-15',
        size: '2.5 GB',
        itemCount: 150000
      },
      {
        id: '2',
        name: 'Documentos Técnicos',
        type: 'folder',
        status: 'active',
        path: '/docs/finance',
        lastSync: '2024-03-15',
        size: '500 MB',
        itemCount: 250
      }
    ],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    author: {
      name: 'João Silva',
      role: 'Gestor'
    },
    tags: ['financeiro', 'documentação', 'técnico'],
    groups: [
      { id: '1', name: 'Financeiro', userCount: 25 },
      { id: '2', name: 'Contabilidade', userCount: 15 },
      { id: '3', name: 'Auditoria', userCount: 8 }
    ]
  }
];

// Available groups for selection
const availableGroups = [
  { id: '1', name: 'Financeiro', userCount: 25 },
  { id: '2', name: 'Contabilidade', userCount: 15 },
  { id: '3', name: 'Auditoria', userCount: 8 },
  { id: '4', name: 'TI', userCount: 12 },
  { id: '5', name: 'RH', userCount: 10 }
];

const initialFormData: IModuleForm = {
  title: '',
  description: '',
  category: '',
  dataSources: [],
  groups: [],
  status: 'draft'
};

export function AdminKnowledge() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewModuleForm, setShowNewModuleForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState<IModuleForm>(initialFormData);
  const [errors, setErrors] = useState<Partial<IModuleForm>>({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<IModuleForm> = {};

    if (!formData.title) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData.dataSources.length === 0) {
      newErrors.dataSources = 'Adicione pelo menos uma fonte de dados';
    }

    if (formData.groups.length === 0) {
      newErrors.groups = 'Selecione pelo menos um grupo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // TODO: Submit form data to backend
    console.log('Form data:', formData);
    setShowNewModuleForm(false);
  };

  const handleDelete = (moduleId: string) => {
    setModuleToDelete(moduleId);
    setShowDeleteConfirmation(true);
  };

  const handleEdit = (module: Module) => {
    setSelectedModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      category: module.category,
      dataSources: module.dataSources,
      groups: module.groups.map(g => g.id),
      status: module.status
    });
    setShowNewModuleForm(true);
  };

  const handleCloseForm = () => {
    setShowNewModuleForm(false);
    setSelectedModule(null);
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h1>
          <p className="text-gray-500">Gerencie documentação, módulos e recursos</p>
        </div>
        <button
          onClick={() => setShowNewModuleForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Módulo</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar na base de conhecimento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="draft">Rascunhos</option>
          <option value="archived">Arquivados</option>
        </select>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {mockCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onSelect={setSelectedCategory}
            />
          ))}
        </div>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Módulos</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* Module Form */}
      {showNewModuleForm && (
        <ModuleForm
          formData={formData}
          errors={errors}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
          availableGroups={availableGroups}
          categories={mockCategories}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => {
          // TODO: Implement delete logic
          console.log('Deleting module:', moduleToDelete);
          setShowDeleteConfirmation(false);
        }}
        title="Excluir Módulo"
        message="Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita."
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