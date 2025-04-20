import React from 'react';
import { Edit, Trash2, Users } from 'lucide-react';
import { Module } from '../../types/knowledge';
import { DataSourceList } from './DataSourceList';

interface ModuleCardProps {
  module: Module;
  onEdit: (module: Module) => void;
  onDelete: (id: string) => void;
}

export function ModuleCard({ module, onEdit, onDelete }: ModuleCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{module.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{module.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(module)}
            className="p-1 text-gray-500 hover:text-primary"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(module.id)}
            className="p-1 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DataSourceList sources={module.dataSources} />

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Grupos Associados</h4>
        <div className="space-y-2">
          {module.groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{group.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {group.userCount} usuários
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Criado por: {module.author.role} - {module.author.name}</span>
        </div>
        <span>Atualizado: {module.updatedAt}</span>
      </div>
    </div>
  );
}