import React, { useState } from 'react';
import { 
  Database,
  Search, 
  Plus,
  Edit,
  Trash2,
  Server,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Link2,
  HardDrive,
  Clock,
  Users as UsersIcon,
  X,
  Save
} from 'lucide-react';
import { ConfirmationModal } from '../../components/ConfirmationModal';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'oracle' | 'sqlserver';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  status: 'connected' | 'disconnected' | 'error';
  stats: {
    schemas: number;
    tables: number;
    columns: number;
    records: number;
  };
  metrics: {
    cpu: number;
    memory: number;
    storage: number;
    uptime: string;
  };
  lastSync: string;
  activeConnections: number;
}

const initialDatabases: DatabaseConnection[] = [
  {
    id: '1',
    name: 'Production Database',
    type: 'postgres',
    host: 'db.production.com',
    port: 5432,
    database: 'main_db',
    username: 'admin',
    password: '********',
    status: 'connected',
    stats: {
      schemas: 8,
      tables: 156,
      columns: 1890,
      records: 15000000
    },
    metrics: {
      cpu: 65,
      memory: 78,
      storage: 82,
      uptime: '99.99%'
    },
    lastSync: '2024-03-15',
    activeConnections: 45
  },
  {
    id: '2',
    name: 'Analytics Database',
    type: 'mysql',
    host: 'analytics.db.com',
    port: 3306,
    database: 'analytics',
    username: 'admin',
    password: '********',
    status: 'connected',
    stats: {
      schemas: 3,
      tables: 89,
      columns: 520,
      records: 5000000
    },
    metrics: {
      cpu: 45,
      memory: 62,
      storage: 58,
      uptime: '99.95%'
    },
    lastSync: '2024-03-15',
    activeConnections: 23
  },
  {
    id: '3',
    name: 'Legacy System',
    type: 'oracle',
    host: 'legacy.internal',
    port: 1521,
    database: 'legacy_db',
    username: 'admin',
    password: '********',
    status: 'error',
    stats: {
      schemas: 12,
      tables: 234,
      columns: 2150,
      records: 8000000
    },
    metrics: {
      cpu: 89,
      memory: 92,
      storage: 95,
      uptime: '98.50%'
    },
    lastSync: '2024-03-15',
    activeConnections: 12
  }
];

interface DatabaseForm {
  name: string;
  type: DatabaseConnection['type'];
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

const initialFormData: DatabaseForm = {
  name: '',
  type: 'postgres',
  host: '',
  port: 5432,
  database: '',
  username: '',
  password: ''
};

export function AdminDatabases() {
  const [databases, setDatabases] = useState<DatabaseConnection[]>(initialDatabases);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatabaseForm, setShowDatabaseForm] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseConnection | null>(null);
  const [formData, setFormData] = useState<DatabaseForm>(initialFormData);
  const [errors, setErrors] = useState<Partial<DatabaseForm>>({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [databaseToDelete, setDatabaseToDelete] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestPassed, setConnectionTestPassed] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<DatabaseForm> = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.host) {
      newErrors.host = 'Host é obrigatório';
    }

    if (!formData.port) {
      newErrors.port = 'Porta é obrigatória';
    }

    if (!formData.database) {
      newErrors.database = 'Nome do banco é obrigatório';
    }

    if (!formData.username) {
      newErrors.username = 'Usuário é obrigatório';
    }

    if (!selectedDatabase && !formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) return;
    
    setIsTestingConnection(true);
    
    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionTestPassed(true);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !connectionTestPassed) return;

    if (selectedDatabase) {
      setDatabases(prevDatabases =>
        prevDatabases.map(db =>
          db.id === selectedDatabase.id
            ? {
                ...db,
                name: formData.name,
                type: formData.type,
                host: formData.host,
                port: formData.port,
                database: formData.database,
                username: formData.username,
                ...(formData.password ? { password: formData.password } : {})
              }
            : db
        )
      );
    } else {
      const newDatabase: DatabaseConnection = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        host: formData.host,
        port: formData.port,
        database: formData.database,
        username: formData.username,
        password: formData.password,
        status: 'connected',
        stats: {
          schemas: 0,
          tables: 0,
          columns: 0,
          records: 0
        },
        metrics: {
          cpu: 0,
          memory: 0,
          storage: 0,
          uptime: '100%'
        },
        lastSync: new Date().toISOString().split('T')[0],
        activeConnections: 0
      };
      setDatabases(prevDatabases => [...prevDatabases, newDatabase]);
    }

    handleCloseForm();
  };

  const handleEdit = (database: DatabaseConnection) => {
    setSelectedDatabase(database);
    setFormData({
      name: database.name,
      type: database.type,
      host: database.host,
      port: database.port,
      database: database.database,
      username: database.username,
      password: ''
    });
    setShowDatabaseForm(true);
  };

  const handleDelete = (databaseId: string) => {
    setDatabaseToDelete(databaseId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (databaseToDelete) {
      setDatabases(prevDatabases => prevDatabases.filter(db => db.id !== databaseToDelete));
      if (selectedDatabase?.id === databaseToDelete) {
        setSelectedDatabase(null);
      }
    }
    setShowDeleteConfirmation(false);
  };

  const handleCloseForm = () => {
    setShowDatabaseForm(false);
    setSelectedDatabase(null);
    setFormData(initialFormData);
    setErrors({});
    setConnectionTestPassed(false);
  };

  const getStatusColor = (status: DatabaseConnection['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'disconnected':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: DatabaseConnection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-red-600';
    if (value >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bancos de Dados</h1>
          <p className="text-gray-500">Gerencie suas conexões de banco de dados</p>
        </div>
        <button
          onClick={() => setShowDatabaseForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conexão</span>
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar bancos de dados..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">Todos os Status</option>
          <option value="connected">Conectados</option>
          <option value="disconnected">Desconectados</option>
          <option value="error">Com Erro</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {databases.map((db) => (
          <div
            key={db.id}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{db.name}</h3>
                  <p className="text-sm text-gray-500">{db.host}:{db.port}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-50"
                  title="Sincronizar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleEdit(db)}
                  className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-50"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(db.id)}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-50"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${getStatusColor(db.status)}`}>
                {getStatusIcon(db.status)}
                <span className="font-medium capitalize">{db.status}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{db.activeConnections} conexões</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">Schemas</span>
                  <span className="text-lg font-medium">{db.stats.schemas}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(db.stats.schemas / 20) * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">Tabelas</span>
                  <span className="text-lg font-medium">{db.stats.tables}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(db.stats.tables / 300) * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">Colunas</span>
                  <span className="text-lg font-medium">{db.stats.columns}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(db.stats.columns / 3000) * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-1">Registros</span>
                  <span className="text-lg font-medium">{db.stats.records.toLocaleString()}</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(db.stats.records / 20000000) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span className={getMetricColor(db.metrics.cpu)}>
                    {db.metrics.cpu}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      db.metrics.cpu >= 90 ? 'bg-red-500' :
                      db.metrics.cpu >= 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${db.metrics.cpu}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span className={getMetricColor(db.metrics.memory)}>
                    {db.metrics.memory}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      db.metrics.memory >= 90 ? 'bg-red-500' :
                      db.metrics.memory >= 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${db.metrics.memory}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage Usage</span>
                  <span className={getMetricColor(db.metrics.storage)}>
                    {db.metrics.storage}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      db.metrics.storage >= 90 ? 'bg-red-500' :
                      db.metrics.storage >= 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${db.metrics.storage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Uptime: {db.metrics.uptime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Última sincronização: {db.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDatabaseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {selectedDatabase ? 'Editar Conexão' : 'Nova Conexão'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Conexão
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Banco
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DatabaseConnection['type'] })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="postgres">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="oracle">Oracle</option>
                    <option value="sqlserver">SQL Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host
                  </label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.host ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.host && (
                    <p className="mt-1 text-xs text-red-500">{errors.host}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Porta
                  </label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.port ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.port && (
                    <p className="mt-1 text-xs text-red-500">{errors.port}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Banco
                  </label>
                  <input
                    type="text"
                    value={formData.database}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.database ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.database && (
                    <p className="mt-1 text-xs text-red-500">{errors.database}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuário
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.username ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    placeholder={selectedDatabase ? '••••••••' : ''}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                  {selectedDatabase && (
                    <p className="mt-1 text-xs text-gray-500">
                      Deixe em branco para manter a senha atual
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="btn-secondary flex items-center space-x-2"
                >
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Testando...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Testar Conexão</span>
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  disabled={!connectionTestPassed}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>

              {connectionTestPassed && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Conexão testada com sucesso!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Conexão"
        message="Tem certeza que deseja excluir esta conexão? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando 1-10 de 50 resultados
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Anterior
          </button>
          <button className="px-3 py-1 border rounded bg-primary text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}