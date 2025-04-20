import React, { useState, useEffect } from 'react';
import { Trash2, X, Upload, Edit } from 'lucide-react';
import { DataSource } from '../../types/knowledge';
import { getDataSourceIcon } from '../../utils/knowledge';
import { DatabaseStructure } from './DatabaseStructure';
import { DataSourceTypeSelector } from './DataSourceTypeSelector';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'oracle' | 'sqlserver';
  host: string;
}

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

interface DataSourceFormProps {
  dataSources: DataSource[];
  onChange: (dataSources: DataSource[]) => void;
  error?: string;
}

const initialSelection: DatabaseSelection = {
  schemas: [],
  tables: {},
  columns: {}
};

const initialFormState: Omit<DataSource, 'id'> = {
  type: 'database',
  name: '',
  url: '',
  path: '',
  status: 'active',
  lastSync: new Date().toISOString(),
  size: '',
  itemCount: 0,
  metadata: {
    connection: '',
    selection: initialSelection
  }
};

const mockConnections: DatabaseConnection[] = [
  {
    id: '1',
    name: 'Production Database',
    type: 'postgres',
    host: 'db.production.com'
  },
  {
    id: '2',
    name: 'Analytics Database',
    type: 'mysql',
    host: 'analytics.db.com'
  }
];

export function DataSourceForm({ dataSources, onChange, error }: DataSourceFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [currentSource, setCurrentSource] = useState<Omit<DataSource, 'id'>>(initialFormState);
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [schemas, setSchemas] = useState<DatabaseSchema[]>([]);
  const [expandedSchemas, setExpandedSchemas] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [selection, setSelection] = useState<DatabaseSelection>(initialSelection);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);

  const resetForm = () => {
    setCurrentSource(initialFormState);
    setSelectedConnection('');
    setSchemas([]);
    setSelection(initialSelection);
    setExpandedSchemas([]);
    setExpandedTables([]);
    setSelectedFile(null);
    setEditingSource(null);
  };

  useEffect(() => {
    if (selectedConnection && currentSource.type === 'database') {
      setLoading(true);
      setTimeout(() => {
        setSchemas([
          {
            name: 'public',
            tables: [
              {
                name: 'users',
                columns: [
                  { name: 'id', type: 'uuid', recordCount: 10000 },
                  { name: 'name', type: 'text', recordCount: 10000 },
                  { name: 'email', type: 'text', recordCount: 9850 }
                ]
              },
              {
                name: 'orders',
                columns: [
                  { name: 'id', type: 'uuid', recordCount: 25000 },
                  { name: 'user_id', type: 'uuid', recordCount: 25000 },
                  { name: 'total', type: 'numeric', recordCount: 25000 }
                ]
              }
            ]
          },
          {
            name: 'analytics',
            tables: [
              {
                name: 'events',
                columns: [
                  { name: 'id', type: 'uuid', recordCount: 150000 },
                  { name: 'type', type: 'text', recordCount: 150000 },
                  { name: 'data', type: 'jsonb', recordCount: 148500 }
                ]
              }
            ]
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [selectedConnection, currentSource.type]);

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

  const selectAll = () => {
    const newSelection: DatabaseSelection = {
      schemas: [],
      tables: {},
      columns: {}
    };

    schemas.forEach(schema => {
      newSelection.schemas.push(schema.name);
      newSelection.tables[schema.name] = [];
      
      schema.tables.forEach(table => {
        const fullTableName = `${schema.name}.${table.name}`;
        newSelection.tables[schema.name].push(table.name);
        newSelection.columns[fullTableName] = table.columns.map(col => col.name);
      });
    });

    setSelection(newSelection);
  };

  const deselectAll = () => {
    setSelection(initialSelection);
  };

  const selectAllInSchema = (schemaName: string) => {
    const schema = schemas.find(s => s.name === schemaName);
    if (!schema) return;

    setSelection(prev => {
      const newSelection = { ...prev };
      
      if (!newSelection.schemas.includes(schemaName)) {
        newSelection.schemas = [...newSelection.schemas, schemaName];
      }
      
      newSelection.tables[schemaName] = schema.tables.map(t => t.name);
      
      schema.tables.forEach(table => {
        const fullTableName = `${schemaName}.${table.name}`;
        newSelection.columns[fullTableName] = table.columns.map(c => c.name);
      });

      return newSelection;
    });
  };

  const selectAllInTable = (schemaName: string, tableName: string) => {
    const schema = schemas.find(s => s.name === schemaName);
    const table = schema?.tables.find(t => t.name === tableName);
    if (!schema || !table) return;

    setSelection(prev => {
      const newSelection = { ...prev };
      const fullTableName = `${schemaName}.${tableName}`;

      if (!newSelection.tables[schemaName]) {
        newSelection.tables[schemaName] = [];
      }
      if (!newSelection.tables[schemaName].includes(tableName)) {
        newSelection.tables[schemaName] = [...newSelection.tables[schemaName], tableName];
      }

      newSelection.columns[fullTableName] = table.columns.map(c => c.name);

      return newSelection;
    });
  };

  const toggleSchemaSelection = (schemaName: string) => {
    const schema = schemas.find(s => s.name === schemaName);
    if (!schema) return;

    setSelection(prev => {
      const isSelected = prev.schemas.includes(schemaName);
      const newSelection = { ...prev };

      if (isSelected) {
        newSelection.schemas = prev.schemas.filter(s => s !== schemaName);
        schema.tables.forEach(table => {
          const fullTableName = `${schemaName}.${table.name}`;
          delete newSelection.tables[schemaName];
          delete newSelection.columns[fullTableName];
        });
      } else {
        newSelection.schemas = [...prev.schemas, schemaName];
        newSelection.tables[schemaName] = schema.tables.map(t => t.name);
        schema.tables.forEach(table => {
          const fullTableName = `${schemaName}.${table.name}`;
          newSelection.columns[fullTableName] = table.columns.map(c => c.name);
        });
      }

      return newSelection;
    });
  };

  const toggleTableSelection = (schemaName: string, tableName: string) => {
    const schema = schemas.find(s => s.name === schemaName);
    const table = schema?.tables.find(t => t.name === tableName);
    if (!schema || !table) return;

    setSelection(prev => {
      const fullTableName = `${schemaName}.${tableName}`;
      const isSelected = prev.tables[schemaName]?.includes(tableName);
      const newSelection = { ...prev };

      if (isSelected) {
        newSelection.tables[schemaName] = prev.tables[schemaName]?.filter(t => t !== tableName) || [];
        delete newSelection.columns[fullTableName];
      } else {
        newSelection.tables[schemaName] = [...(prev.tables[schemaName] || []), tableName];
        newSelection.columns[fullTableName] = table.columns.map(c => c.name);
      }

      return newSelection;
    });
  };

  const toggleColumnSelection = (schemaName: string, tableName: string, columnName: string) => {
    const fullTableName = `${schemaName}.${tableName}`;
    
    setSelection(prev => {
      const isSelected = prev.columns[fullTableName]?.includes(columnName);
      const newSelection = { ...prev };

      if (isSelected) {
        newSelection.columns[fullTableName] = prev.columns[fullTableName]?.filter(c => c !== columnName) || [];
      } else {
        newSelection.columns[fullTableName] = [...(prev.columns[fullTableName] || []), columnName];
      }

      return newSelection;
    });
  };

  const clearSchemaSelection = (schemaName: string) => {
    setSelection(prev => {
      const newSelection = { ...prev };
      // Remove schema from selection
      newSelection.schemas = prev.schemas.filter(s => s !== schemaName);
      // Remove all tables from this schema
      delete newSelection.tables[schemaName];
      // Remove all columns from this schema's tables
      const schema = schemas.find(s => s.name === schemaName);
      if (schema) {
        schema.tables.forEach(table => {
          delete newSelection.columns[`${schemaName}.${table.name}`];
        });
      }
      return newSelection;
    });
  };

  const clearTableSelection = (schemaName: string, tableName: string) => {
    setSelection(prev => {
      const newSelection = { ...prev };
      // Remove table from schema's tables
      newSelection.tables[schemaName] = (prev.tables[schemaName] || [])
        .filter(t => t !== tableName);
      // Remove all columns from this table
      delete newSelection.columns[`${schemaName}.${tableName}`];
      return newSelection;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCurrentSource(prev => ({
        ...prev,
        name: file.name,
        path: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }));
    }
  };

  const handleEdit = (source: DataSource) => {
    setEditingSource(source);
    setCurrentSource({
      type: source.type,
      name: source.name,
      url: source.url || '',
      path: source.path || '',
      status: source.status || 'active',
      lastSync: source.lastSync || new Date().toISOString(),
      size: source.size || '',
      itemCount: source.itemCount || 0,
      metadata: source.metadata
    });

    if (source.type === 'database' && source.metadata?.connection) {
      setSelectedConnection(source.metadata.connection);
      if (source.metadata.selection) {
        setSelection(source.metadata.selection);
      }
    }

    setShowForm(true);
  };

  const handleAddSource = () => {
    if (currentSource.type === 'database') {
      if (!selectedConnection) return;

      const connection = mockConnections.find(c => c.id === selectedConnection);
      if (!connection) return;

      const sourceData: DataSource = {
        id: editingSource?.id || Date.now().toString(),
        ...currentSource,
        name: connection.name,
        path: connection.host,
        metadata: {
          connection: selectedConnection,
          selection
        }
      };

      if (editingSource) {
        onChange(dataSources.map(s => s.id === editingSource.id ? sourceData : s));
      } else {
        onChange([...dataSources, sourceData]);
      }
      resetForm();
    } else if (currentSource.type === 'file' && selectedFile) {
      const sourceData: DataSource = {
        ...currentSource,
        id: editingSource?.id || Date.now().toString(),
        type: 'file',
        name: selectedFile.name,
        path: selectedFile.name,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
      };
      
      if (editingSource) {
        onChange(dataSources.map(s => s.id === editingSource.id ? sourceData : s));
      } else {
        onChange([...dataSources, sourceData]);
      }
      resetForm();
    } else {
      if (!currentSource.name || (currentSource.type === 'url' && !currentSource.url) || 
          ((currentSource.type === 'gdoc' || currentSource.type === 'api') && !currentSource.path)) {
        return;
      }

      const sourceData: DataSource = {
        ...currentSource,
        id: editingSource?.id || Date.now().toString()
      };

      if (editingSource) {
        onChange(dataSources.map(s => s.id === editingSource.id ? sourceData : s));
      } else {
        onChange([...dataSources, sourceData]);
      }
      resetForm();
    }

    setShowForm(false);
  };

  const renderSourceTypeForm = () => {
    switch (currentSource.type) {
      case 'database':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conexão
              </label>
              <select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione uma conexão</option>
                {mockConnections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name} ({conn.host})
                  </option>
                ))}
              </select>
            </div>

            {selectedConnection && (
              <DatabaseStructure
                schemas={schemas}
                selection={selection}
                expandedSchemas={expandedSchemas}
                expandedTables={expandedTables}
                loading={loading}
                onToggleSchema={toggleSchema}
                onToggleTable={toggleTable}
                onToggleSchemaSelection={toggleSchemaSelection}
                onToggleTableSelection={toggleTableSelection}
                onToggleColumnSelection={toggleColumnSelection}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                onSelectAllInSchema={selectAllInSchema}
                onSelectAllInTable={selectAllInTable}
                onClearSchemaSelection={clearSchemaSelection}
                onClearTableSelection={clearTableSelection}
              />
            )}
          </>
        );

      case 'file':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload de Arquivo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                    <span>Upload de arquivo</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.xlsx,.xls,.csv,.txt,.doc,.docx,.json,.xml"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, Excel, CSV, TXT, Word, JSON, XML
                </p>
              </div>
            </div>
          </div>
        );

      case 'url':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Externa
            </label>
            <input
              type="url"
              value={currentSource.url}
              onChange={(e) => setCurrentSource({
                ...currentSource,
                url: e.target.value,
                name: e.target.value
              })}
              placeholder="https://exemplo.com/dados"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        );

      case 'gdoc':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link do Google Doc
            </label>
            <input
              type="url"
              value={currentSource.path}
              onChange={(e) => setCurrentSource({
                ...currentSource,
                path: e.target.value,
                name: 'Google Doc'
              })}
              placeholder="https://docs.google.com/..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        );

      case 'api':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da API
              </label>
              <input
                type="text"
                value={currentSource.name}
                onChange={(e) => setCurrentSource({
                  ...currentSource,
                  name: e.target.value
                })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endpoint
              </label>
              <input
                type="url"
                value={currentSource.path}
                onChange={(e) => setCurrentSource({
                  ...currentSource,
                  path: e.target.value
                })}
                placeholder="https://api.exemplo.com/v1"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderIcon = (icon: React.ElementType) => {
    const Icon = icon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Fontes de Dados
        </label>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-primary hover:text-primary/80 text-sm"
        >
          + Adicionar Fonte
        </button>
      </div>

      {dataSources.length > 0 ? (
        <div className="space-y-2">
          {dataSources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {renderIcon(getDataSourceIcon(source.type))}
                <div>
                  <p className="text-sm font-medium">{source.name}</p>
                  <p className="text-xs text-gray-500">
                    {source.type === 'url' ? source.url : source.path}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(source)}
                  className="text-gray-500 hover:text-primary"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(dataSources.filter(s => s.id !== source.id))}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">Nenhuma fonte de dados adicionada</p>
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {editingSource ? 'Editar Fonte de Dados' : 'Adicionar Fonte de Dados'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <DataSourceTypeSelector
                selectedType={currentSource.type}
                onTypeSelect={(type) => setCurrentSource(prev => ({ ...prev, type }))}
              />

              {renderSourceTypeForm()}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddSource}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : editingSource ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}