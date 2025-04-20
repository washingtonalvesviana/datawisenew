import React from 'react';
import { Database, Clock, Shield, FileText, Trash2 } from 'lucide-react';
import type { PersonalData } from '../../types/lgpd';

interface PersonalDataCardProps {
  data: PersonalData;
  onRemove: (id: string) => void;
}

export function PersonalDataCard({ data, onRemove }: PersonalDataCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-full text-xs ${
            data.type === 'sensitive' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {data.type === 'sensitive' ? 'Sensível' : 'Pessoal'}
          </span>
          <h4 className="font-medium">{data.field}</h4>
        </div>
        <button
          type="button"
          onClick={() => onRemove(data.id)}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Quantidade</p>
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{data.quantity.volume.toLocaleString()} registros</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Retenção</p>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{data.quantity.retentionPeriod}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Base Legal</p>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{data.quantity.legalBasis}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Finalidade</p>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{data.quantity.purpose}</span>
          </div>
        </div>
      </div>

      {data.dataFlow && data.dataFlow.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 font-medium mb-2">Fluxo de Dados</p>
          <div className="space-y-1">
            {data.dataFlow.map((step, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.processingActivities && data.processingActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 font-medium mb-2">Atividades de Processamento</p>
          <div className="space-y-1">
            {data.processingActivities.map((activity, index) => (
              <div key={index} className="text-sm text-gray-600">
                • {activity}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}