import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { DatabaseConnection } from './types';

interface SchemaViewerProps {
  database: DatabaseConnection;
  selectedSchemas: Record<string, boolean>;
  onSchemaSelect: (schemas: Record<string, boolean>) => void;
}

export function SchemaViewer({ database, selectedSchemas, onSchemaSelect }: SchemaViewerProps) {
  const [expandedSchemas, setExpandedSchemas] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const toggleSchema = (schemaName: string) => {
    setExpandedSchemas(prev => 
      prev.includes(schemaName)
        ? prev.filter(name => name !== schemaName)
        : [...prev, schemaName]
    );
  };

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev =>
      prev.includes(tableName)
        ? prev.filter(name => name !== tableName)
        : [...prev, tableName]
    );
  };

  const handleSelectAll = () => {
    const allSchemas = database.schemas.reduce((acc, schema) => ({
      ...acc,
      [schema.name]: true
    }), {});
    onSchemaSelect(allSchemas);
  };

  const handleClearAll = () => {
    onSchemaSelect({});
  };

  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Estrutura do Banco</h4>
          <div className="space-x-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-primary hover:text-primary/80"
            >
              Selecionar Tudo
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpar Tudo
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {database.schemas.map((schema) => (
          <div key={schema.name} className="border rounded-lg">
            <div className="flex items-center justify-between p-2 bg-gray-50">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => toggleSchema(schema.name)}
                  className="mr-2"
                >
                  {expandedSchemas.includes(schema.name) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="checkbox"
                  checked={selectedSchemas[schema.name] || false}
                  onChange={(e) => onSchemaSelect({
                    ...selectedSchemas,
                    [schema.name]: e.target.checked
                  })}
                  className="mr-2"
                />
                <span className="font-medium">{schema.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {schema.tables.length} tabelas
              </span>
            </div>

            {expandedSchemas.includes(schema.name) && (
              <div className="p-2 space-y-2">
                {schema.tables.map((table) => (
                  <div key={table.name} className="ml-4 border rounded-lg">
                    <div className="flex items-center justify-between p-2 bg-gray-50">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleTable(table.name)}
                          className="mr-2"
                        >
                          {expandedTables.includes(table.name) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-sm">{table.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {table.recordCount.toLocaleString()} registros
                      </span>
                    </div>

                    {expandedTables.includes(table.name) && (
                      <div className="p-2 space-y-1">
                        {table.columns.map((column) => (
                          <div key={column.name} className="ml-8 flex items-center justify-between text-sm">
                            <span>{column.name}</span>
                            <span className="text-gray-500">{column.type}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}