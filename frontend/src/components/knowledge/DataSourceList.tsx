import React from 'react';
import { Database, FileText, Globe, FileJson, Folder } from 'lucide-react';
import { DataSource } from '../../types/knowledge';

interface DataSourceListProps {
  sources: DataSource[];
}

export function DataSourceList({ sources }: DataSourceListProps) {
  const getDataSourceIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'url':
        return <Globe className="w-4 h-4" />;
      case 'gdoc':
        return <FileJson className="w-4 h-4" />;
      case 'folder':
        return <Folder className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Fontes de Dados</h4>
      <div className="space-y-2">
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              {getDataSourceIcon(source.type)}
              <div>
                <p className="text-sm font-medium">{source.name}</p>
                <p className="text-xs text-gray-500">
                  {source.path}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Última Sync: {source.lastSync}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}