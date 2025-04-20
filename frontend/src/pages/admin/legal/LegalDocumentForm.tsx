import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gavel, 
  Save, 
  X, 
  Upload, 
  FileText,
  Plus,
  Trash2,
  Users,
  Calendar
} from 'lucide-react';
import { DataSourceForm } from '../../../components/knowledge/DataSourceForm';
import type { LegalDocumentFormData, LegalParty } from '../../../types/legal';

interface LegalDocumentFormProps {
  onClose: () => void;
  onSave: (document: LegalDocumentFormData) => void;
  initialData?: LegalDocumentFormData;
}

const documentTypes = [
  { value: 'contract', label: 'Contrato' },
  { value: 'policy', label: 'Política' },
  { value: 'agreement', label: 'Acordo' },
  { value: 'regulation', label: 'Regulamento' },
  { value: 'lawsuit', label: 'Processo' }
];

const availableGroups = [
  { id: '1', name: 'Jurídico', userCount: 15 },
  { id: '2', name: 'Compliance', userCount: 8 },
  { id: '3', name: 'Diretoria', userCount: 5 },
  { id: '4', name: 'RH', userCount: 12 },
  { id: '5', name: 'Financeiro', userCount: 10 }
];

interface FormErrors {
  title?: string;
  type?: string;
  description?: string;
  responsible?: string;
  files?: string;
  parties?: string;
}

export function LegalDocumentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LegalDocumentFormData>({
    title: '',
    type: 'contract',
    status: 'draft',
    description: '',
    responsible: '',
    parties: [],
    dataSources: [],
    files: [],
    tags: [],
    groups: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [newParty, setNewParty] = useState<Partial<LegalParty>>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório';
    }

    if (!formData.description) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.responsible) {
      newErrors.responsible = 'Responsável é obrigatório';
    }

    if (formData.files.length === 0) {
      newErrors.files = 'Adicione pelo menos um arquivo';
    }

    if (formData.parties.length === 0) {
      newErrors.parties = 'Adicione pelo menos uma parte envolvida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // TODO: Submit form data to backend
      console.log('Form data:', formData);
      navigate('/admin/legal');
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleAddParty = () => {
    if (!newParty.name || !newParty.role) return;

    setFormData(prev => ({
      ...prev,
      parties: [...prev.parties, { 
        id: Date.now().toString(),
        ...newParty as Omit<LegalParty, 'id'>
      }]
    }));
    setNewParty({});
  };

  const handleRemoveParty = (id: string) => {
    setFormData(prev => ({
      ...prev,
      parties: prev.parties.filter(party => party.id !== id)
    }));
  };

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => {
      const currentGroups = prev.groups;
      const group = availableGroups.find(g => g.id === groupId);
      
      if (!group) return prev;

      if (currentGroups.some(g => g.id === groupId)) {
        return {
          ...prev,
          groups: currentGroups.filter(g => g.id !== groupId)
        };
      }

      return {
        ...prev,
        groups: [...currentGroups, group]
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gavel className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Novo Documento</h2>
          </div>
          <button
            onClick={() => navigate('/admin/legal')}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full p-2 border rounded-lg ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    type: e.target.value as LegalDocumentFormData['type']
                  }))}
                  className={`w-full p-2 border rounded-lg ${errors.type ? 'border-red-500' : ''}`}
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-xs text-red-500">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
                  className={`w-full p-2 border rounded-lg ${errors.responsible ? 'border-red-500' : ''}`}
                />
                {errors.responsible && (
                  <p className="mt-1 text-xs text-red-500">{errors.responsible}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full p-2 border rounded-lg ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Parties */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Partes Envolvidas</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={newParty.name || ''}
                    onChange={(e) => setNewParty(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome"
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={newParty.role || ''}
                    onChange={(e) => setNewParty(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Função/Papel"
                    className="p-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddParty}
                    className="btn-secondary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Parte
                  </button>
                </div>

                {formData.parties.length > 0 ? (
                  <div className="space-y-2">
                    {formData.parties.map((party) => (
                      <div
                        key={party.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{party.name}</p>
                          <p className="text-sm text-gray-500">{party.role}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveParty(party.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">Nenhuma parte adicionada</p>
                  </div>
                )}
                {errors.parties && (
                  <p className="text-xs text-red-500">{errors.parties}</p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Documentos</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label className="relative cursor-pointer">
                        <span className="text-primary hover:text-primary/80">Upload de arquivo</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt"
                          className="sr-only"
                        />
                      </label>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX ou TXT
                      </p>
                    </div>
                  </div>
                </div>

                {formData.files.length > 0 && (
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.files && (
                  <p className="text-xs text-red-500">{errors.files}</p>
                )}
              </div>
            </div>

            {/* Data Sources */}
            <DataSourceForm
              dataSources={formData.dataSources}
              onChange={(dataSources) => setFormData(prev => ({ ...prev, dataSources }))}
            />

            {/* Groups */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Grupos</h3>
              <div className="space-y-2">
                {availableGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleGroupToggle(group.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      formData.groups.some(g => g.id === group.id)
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {group.userCount} usuários
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.value as LegalDocumentFormData['status']
                }))}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="draft">Rascunho</option>
                <option value="active">Ativo</option>
                <option value="review">Em Revisão</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => navigate('/admin/legal')}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}