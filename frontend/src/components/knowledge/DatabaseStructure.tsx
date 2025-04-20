import React from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

interface DatabaseSchema {
  name: string;
  tables: DatabaseTable[];
}

interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
}

interface DatabaseColumn {
  name: string;
  type: string;
  recordCount: number;
}

interface DatabaseSelection {
  schemas: string[];
  tables: { [schema: string]: string[] };
  columns: { [table: string]: string[] };
}

interface DatabaseStructureProps {
  schemas: DatabaseSchema[];
  selection: DatabaseSelection;
  expandedSchemas: string[];
  expandedTables: string[];
  loading: boolean;
  onToggleSchema: (schemaName: string) => void;
  onToggleTable: (tableName: string) => void;
  onToggleSchemaSelection: (schemaName: string) => void;
  onToggleTableSelection: (schemaName: string, tableName: string) => void;
  onToggleColumnSelection: (schemaName: string, tableName: string, columnName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectAllInSchema: (schemaName: string) => void;
  onSelectAllInTable: (schemaName: string, tableName: string) => void;
  onClearSchemaSelection: (schemaName: string) => void;
  onClearTableSelection: (schemaName: string, tableName: string) => void;
}

export function DatabaseStructure({
  schemas,
  selection,
  expandedSchemas,
  expandedTables,
  loading,
  onToggleSchema,
  onToggleTable,
  onToggleSchemaSelection,
  onToggleTableSelection,
  onToggleColumnSelection,
  onSelectAll,
  onDeselectAll,
  onSelectAllInSchema,
  onSelectAllInTable,
  onClearSchemaSelection,
  onClearTableSelection
}: DatabaseStructureProps) {
  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Estrutura do Banco de Dados</h4>
          <div className="space-x-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-sm text-primary hover:text-primary/80"
            >
              Selecionar Tudo
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpar Seleção
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {schemas.map((schema) => {
              const schemaRecords = schema.tables.reduce((total, table) => {
                const tableRecords = table.columns[0]?.recordCount || 0;
                return total + tableRecords;
              }, 0);

              return (
                <div key={schema.name} className="border rounded-lg">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => onToggleSchema(schema.name)}
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
                        checked={selection.schemas.includes(schema.name)}
                        onChange={() => onToggleSchemaSelection(schema.name)}
                        className="mr-2"
                      />
                      <span className="font-medium">{schema.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {schemaRecords.toLocaleString()} registros
                      </span>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={() => onSelectAllInSchema(schema.name)}
                          className="text-xs text-primary hover:text-primary/80"
                        >
                          Selecionar Tudo
                        </button>
                        <button
                          type="button"
                          onClick={() => onClearSchemaSelection(schema.name)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Limpar Seleção
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedSchemas.includes(schema.name) && (
                    <div className="p-2 space-y-2">
                      {schema.tables.map((table) => {
                        const tableRecords = table.columns[0]?.recordCount || 0;

                        return (
                          <div key={table.name} className="ml-4 border rounded-lg">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg">
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={() => onToggleTable(table.name)}
                                  className="mr-2"
                                >
                                  {expandedTables.includes(table.name) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <input
                                  type="checkbox"
                                  checked={selection.tables[schema.name]?.includes(table.name)}
                                  onChange={() => onToggleTableSelection(schema.name, table.name)}
                                  className="mr-2"
                                />
                                <span>{table.name}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                  {tableRecords.toLocaleString()} registros
                                </span>
                                <div className="space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => onSelectAllInTable(schema.name, table.name)}
                                    className="text-xs text-primary hover:text-primary/80"
                                  >
                                    Selecionar Tudo
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onClearTableSelection(schema.name, table.name)}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                  >
                                    Limpar Seleção
                                  </button>
                                </div>
                              </div>
                            </div>

                            {expandedTables.includes(table.name) && (
                              <div className="p-2 space-y-1">
                                {table.columns.map((column) => (
                                  <div key={column.name} className="ml-8 flex items-center justify-between">
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={selection.columns[`${schema.name}.${table.name}`]?.includes(column.name)}
                                        onChange={() => onToggleColumnSelection(schema.name, table.name, column.name)}
                                        className="mr-2"
                                      />
                                      <span className="text-sm">
                                        {column.name} <span className="text-gray-500">({column.type})</span>
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {column.recordCount.toLocaleString()} registros
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}