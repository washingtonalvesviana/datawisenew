import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Database, Upload, Globe, FileJson, Code } from 'lucide-react';
import { DataSourceForm } from '../knowledge/DataSourceForm';
import type { DataSource } from '../../types/knowledge';
import type { DPOFormData } from '../../types/dpo';

interface DPOFormProps {
  onClose: () => void;
  onSave: (dpo: DPOFormData) => void;
  initialData?: DPOFormData;
}

const availableGroups = [
  { id: '1', name: 'Financeiro', userCount: 25 },
  { id: '2', name: 'Contabilidade', userCount: 15 },
  { id: '3', name: 'Auditoria', userCount: 8 },
  { id: '4', name: 'TI', userCount: 12 },
  { id: '5', name: 'RH', userCount: 10 }
];

export function DPOForm({ onClose, onSave, initialData }: DPOFormProps) {
  // Initialize form data with initialData if provided
  const [formData, setFormData] = useState<Partial<DPOFormData>>(() => {
    if (initialData) {
      return {
        ...initialData,
        // Ensure we create new arrays to avoid reference issues
        dataSources: [...initialData.dataSources],
        groups: [...initialData.groups]
      };
    }
    return {
      name: '',
      description: '',
      status: 'active',
      dataSources: [],
      groups: []
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Effect to handle initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dataSources: [...initialData.dataSources],
        groups: [...initialData.groups]
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.dataSources?.length) {
      newErrors.dataSources = 'Adicione pelo menos uma fonte de dados';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dpo: DPOFormData = {
      id: initialData?.id || Date.now().toString(),
      ...formData as Omit<DPOFormData, 'id'>,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(dpo);
    setSuccessMessage('DPO salvo com sucesso!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1500);
  };

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => {
      const currentGroups = prev.groups || [];
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

  const handleDataSourcesChange = (dataSources: DataSource[]) => {
    setFormData(prev => ({
      ...prev,
      dataSources
    }));
    // Clear any previous data source errors
    if (errors.dataSources) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dataSources;
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {initialData ? 'Editar DPO' : 'Novo DPO'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border-b border-green-200">
            <p className="text-green-700 text-center">{successMessage}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Data Sources */}
            <div>
              <DataSourceForm
                dataSources={formData.dataSources || []}
                onChange={handleDataSourcesChange}
                error={errors.dataSources}
              />
            </div>

            {/* Groups */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grupos
              </label>
              <div className="space-y-2">
                {availableGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleGroupToggle(group.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      formData.groups?.some(g => g.id === group.id)
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {group.userCount} usuários
                    </span>
                  </button>
                ))}
              </div>
              {errors.groups && (
                <p className="mt-1 text-xs text-red-500">{errors.groups}</p>
              )}
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
                  status: e.target.value as DPOFormData['status']
                }))}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
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
                <span>{initialData ? 'Salvar Alterações' : 'Salvar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}