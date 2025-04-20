import React from 'react';
import { X, Users } from 'lucide-react';
import { ModuleForm as IModuleForm } from '../../types/knowledge';
import { DataSourceForm } from './DataSourceForm';

interface ModuleFormProps {
  formData: IModuleForm;
  errors: Partial<IModuleForm>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onChange: (data: Partial<IModuleForm>) => void;
  availableGroups: { id: string; name: string; userCount: number; }[];
  categories: { id: string; name: string; }[];
}

export function ModuleForm({
  formData,
  errors,
  onSubmit,
  onClose,
  onChange,
  availableGroups,
  categories
}: ModuleFormProps) {
  const handleGroupToggle = (groupId: string) => {
    const newGroups = formData.groups.includes(groupId)
      ? formData.groups.filter(id => id !== groupId)
      : [...formData.groups, groupId];
    onChange({ groups: newGroups });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Novo Módulo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => onChange({ category: e.target.value })}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.category ? 'border-red-500' : ''
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <DataSourceForm
            dataSources={formData.dataSources}
            onChange={(dataSources) => onChange({ dataSources })}
            error={errors.dataSources}
          />

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
                    formData.groups.includes(group.id)
                      ? 'bg-primary/5 border-primary'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
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
            {errors.groups && (
              <p className="mt-1 text-xs text-red-500">{errors.groups}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onChange({ status: e.target.value as IModuleForm['status'] })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="draft">Rascunho</option>
              <option value="active">Ativo</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Criar Módulo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}