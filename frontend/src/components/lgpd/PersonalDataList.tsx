import React from 'react';
import { Trash2 } from 'lucide-react';
import type { PersonalData } from '../../types/lgpd';

interface PersonalDataListProps {
  data: PersonalData[];
  onRemove: (id: string) => void;
}

export function PersonalDataList({ data, onRemove }: PersonalDataListProps) {
  if (!data.length) return null;

  return (
    <div>
      <h3 className="font-medium mb-4">Dados Pessoais Identificados</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-gray-50 rounded-lg flex items-start justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.type === 'sensitive' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.type === 'sensitive' ? 'Sensível' : 'Pessoal'}
                </span>
                <h4 className="font-medium">{item.field}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Categoria:</span>
                  <span className="ml-2">{item.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Fonte:</span>
                  <span className="ml-2">{item.source}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{item.context}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}