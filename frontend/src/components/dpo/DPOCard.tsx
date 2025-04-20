import React from 'react';
import { Shield, Database, Users, Clock, Edit, Trash2 } from 'lucide-react';
import type { DPOFormData } from '../../types/dpo';

interface DPOCardProps {
  dpo: DPOFormData;
  onEdit: (dpo: DPOFormData) => void;
  onDelete: (id: string) => void;
}

export function DPOCard({ dpo, onEdit, onDelete }: DPOCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{dpo.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{dpo.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(dpo)}
            className="p-1 text-gray-500 hover:text-primary"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(dpo.id)}
            className="p-1 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Fontes de Dados</p>
              <p className="font-medium">{dpo.dataSources.length}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Grupos</p>
              <p className="font-medium">{dpo.groups.length}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-medium capitalize">{dpo.status}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Última Atualização</p>
              <p className="font-medium">{new Date(dpo.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Grupos Associados</h4>
        <div className="space-y-2">
          {dpo.groups.map((group) => (
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
    </div>
  );
}