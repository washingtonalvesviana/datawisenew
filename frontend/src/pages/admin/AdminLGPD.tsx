import React, { useState } from 'react';
import { LGPDTemplateForm } from './LGPDTemplateForm';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { LGPDTemplate } from '../../types/lgpd';
import {
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Users,
  Database,
  Lock,
  Eye,
  Clock,
  Calendar,
  Filter,
  ArrowUpRight,
  XCircle,
  Settings,
  Tag
} from 'lucide-react';

const mockTemplates: LGPDTemplate[] = [
  {
    id: '1',
    name: 'Template Padrão LGPD',
    description: 'Template base para análise de conformidade LGPD',
    version: '1.0.0',
    status: 'active',
    dataSources: [
      {
        id: '1',
        name: 'Banco de Dados Principal',
        type: 'database',
        status: 'active',
        path: 'db.example.com',
        lastSync: '2024-03-15',
        metadata: {
          connection: '1',
          selection: {
            schemas: ['public'],
            tables: { public: ['users'] },
            columns: { 'public.users': ['email', 'name'] }
          }
        }
      }
    ],
    personalData: [
      {
        id: '1',
        field: 'email',
        type: 'personal',
        category: 'Contato',
        source: 'users.email',
        context: 'Usado para autenticação e comunicação',
        identified: true
      }
    ],
    sensitiveData: [],
    groups: [],
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15'
  }
];

export function AdminLGPD() {
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LGPDTemplate | null>(null);
  const [templates, setTemplates] = useState<LGPDTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleSaveTemplate = (template: LGPDTemplate) => {
    if (selectedTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === template.id ? template : t
      ));
    } else {
      // Add new template
      setTemplates(prev => [...prev, template]);
    }
    setShowTemplateForm(false);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (template: LGPDTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateForm(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(prev => prev.filter(t => t.id !== templateToDelete));
      setTemplateToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  const getStatusColor = (status: LGPDTemplate['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'draft':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'archived':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LGPD</h1>
          <p className="text-gray-500">Gestão de Templates LGPD</p>
        </div>
        <button
          onClick={() => setShowTemplateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Template LGPD</span>
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="draft">Rascunhos</option>
          <option value="archived">Arquivados</option>
        </select>
      </div>

      <div className="space-y-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="text-sm text-gray-500">v{template.version}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(template.status)}`}>
                {template.status === 'active' ? 'Ativo' : 
                 template.status === 'draft' ? 'Rascunho' : 'Arquivado'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Fontes de Dados</p>
                    <p className="font-medium">{template.dataSources.length}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Dados Pessoais</p>
                    <p className="font-medium">{template.personalData.length}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Dados Sensíveis</p>
                    <p className="font-medium">{template.sensitiveData?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Grupos</p>
                    <p className="font-medium">{template.groups?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Última Atualização</p>
                    <p className="font-medium">{new Date(template.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditTemplate(template)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="btn-secondary flex items-center space-x-2 text-primary hover:text-primary/80"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showTemplateForm && (
        <LGPDTemplateForm
          onClose={() => {
            setShowTemplateForm(false);
            setSelectedTemplate(null);
          }}
          onSave={handleSaveTemplate}
          initialData={selectedTemplate}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Template"
        message="Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}