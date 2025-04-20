import React from 'react';
import { Database, Upload, Globe, FileJson, Code } from 'lucide-react';
import type { DataSource } from '../../types/knowledge';

interface DataSourceType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  formats?: string[];
}

interface DataSourceTypeSelectorProps {
  selectedType: DataSource['type'];
  onTypeSelect: (type: DataSource['type']) => void;
}

const dataSourceTypes: DataSourceType[] = [
  {
    id: 'database',
    name: 'Conexões Banco de Dados',
    description: 'Nome das conexões que foram salvas na aplicação que tem acesso ao banco de dados de origem.',
    icon: Database
  },
  {
    id: 'file',
    name: 'Upload de Documentos',
    description: 'PDF, Excel, CSV, TXT, Word, JSON, XML',
    icon: Upload,
    formats: ['pdf', 'xlsx', 'xls', 'csv', 'txt', 'doc', 'docx', 'json', 'xml']
  },
  {
    id: 'url',
    name: 'URLs Externas',
    description: 'Páginas Web, Arquivos hospedados, Feeds RSS, Endpoints REST',
    icon: Globe
  },
  {
    id: 'gdoc',
    name: 'Google Docs',
    description: 'Documentos do Google Workspace',
    icon: FileJson
  },
  {
    id: 'api',
    name: 'APIs',
    description: 'REST, SOAP, GraphQL, Webhooks',
    icon: Code
  }
];

export function DataSourceTypeSelector({ selectedType, onTypeSelect }: DataSourceTypeSelectorProps) {
  const renderIcon = (icon: React.ElementType) => {
    const Icon = icon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Fonte
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSourceTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onTypeSelect(type.id as DataSource['type'])}
            className={`p-4 rounded-lg border text-left transition-colors ${
              selectedType === type.id
                ? 'bg-primary/5 border-primary'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              {renderIcon(type.icon)}
              <span className="font-medium">{type.name}</span>
            </div>
            <p className="text-sm text-gray-500">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}