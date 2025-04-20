import React, { useState } from 'react';
import { 
  ArrowLeftRight,
  Database,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  Table,
  Columns,
  Files,
  HardDrive
} from 'lucide-react';
import type { Migration } from '../types/services';

// TODO: Replace with real migrations data from backend API endpoint: /api/migrations
const mockMigrations: Migration[] = [
  {
    id: '1',
    name: 'Production DB Migration',
    status: 'in-progress',
    sourceDb: {
      name: 'Legacy Oracle DB',
      type: 'oracle',
      size: '2.5 TB'
    },
    targetDb: {
      name: 'New PostgreSQL DB',
      type: 'postgres',
      size: '2.1 TB'
    },
    startedAt: '2024-03-15 08:00:00',
    progress: 65,
    stats: {
      schemas: 8,
      tables: 245,
      columns: 1890,
      records: 15000000,
      dataSize: '1.8 TB'
    }
  },
  {
    id: '2',
    name: 'Analytics Data Migration',
    status: 'scheduled',
    sourceDb: {
      name: 'MySQL Analytics',
      type: 'mysql',
      size: '800 GB'
    },
    targetDb: {
      name: 'New Analytics DB',
      type: 'postgres',
      size: '0'
    },
    scheduledFor: '2024-03-20 00:00:00',
    stats: {
      schemas: 3,
      tables: 85,
      columns: 520,
      records: 5000000,
      dataSize: '800 GB'
    }
  },
  {
    id: '3',
    name: 'Customer Data Migration',
    status: 'completed',
    sourceDb: {
      name: 'Old SQL Server',
      type: 'sqlserver',
      size: '500 GB'
    },
    targetDb: {
      name: 'New PostgreSQL DB',
      type: 'postgres',
      size: '480 GB'
    },
    startedAt: '2024-03-10 10:00:00',
    completedAt: '2024-03-11 15:30:00',
    progress: 100,
    stats: {
      schemas: 2,
      tables: 45,
      columns: 380,
      records: 2500000,
      dataSize: '480 GB'
    }
  },
  {
    id: '4',
    name: 'Historical Data Migration',
    status: 'failed',
    sourceDb: {
      name: 'Archive DB',
      type: 'mysql',
      size: '1.2 TB'
    },
    targetDb: {
      name: 'Data Warehouse',
      type: 'postgres',
      size: '350 GB'
    },
    startedAt: '2024-03-14 20:00:00',
    progress: 35,
    stats: {
      schemas: 4,
      tables: 120,
      columns: 850,
      records: 8000000,
      dataSize: '350 GB'
    },
    error: 'Connection timeout during large table transfer'
  }
];

export function DataMigrateWise() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: Migration['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'scheduled':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: Migration['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in-progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDbTypeIcon = (type: Migration['sourceDb']['type']) => {
    switch (type) {
      case 'postgres':
        return '🐘';
      case 'mysql':
        return '🐬';
      case 'mongodb':
        return '🍃';
      case 'oracle':
        return '☕';
      case 'sqlserver':
        return '📊';
      default:
        return '💾';
    }
  };

  const filteredMigrations = selectedStatus === 'all'
    ? mockMigrations
    : mockMigrations.filter(m => m.status === selectedStatus);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Migrações de Dados</h1>
          <p className="text-gray-600">Gerencie e monitore suas migrações de banco de dados</p>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todos os Status</option>
          <option value="in-progress">Em Progresso</option>
          <option value="scheduled">Agendadas</option>
          <option value="completed">Concluídas</option>
          <option value="failed">Falhas</option>
        </select>
      </div>

      {/* Migration Cards */}
      <div className="grid grid-cols-1 gap-6 overflow-y-auto pb-6">
        {filteredMigrations.map((migration) => (
          <div
            key={migration.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ArrowLeftRight className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{migration.name}</h2>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${getStatusColor(migration.status)}`}>
                {getStatusIcon(migration.status)}
                <span className="capitalize">{migration.status.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Database Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Source Database */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Banco de Dados Origem</h3>
                  <span className="text-2xl" title={migration.sourceDb.type}>
                    {getDbTypeIcon(migration.sourceDb.type)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{migration.sourceDb.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tamanho:</span>
                    <span className="font-medium">{migration.sourceDb.size}</span>
                  </div>
                </div>
              </div>

              {/* Target Database */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Banco de Dados Destino</h3>
                  <span className="text-2xl" title={migration.targetDb.type}>
                    {getDbTypeIcon(migration.targetDb.type)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{migration.targetDb.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tamanho:</span>
                    <span className="font-medium">{migration.targetDb.size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress and Stats */}
            {migration.stats && (
              <div className="space-y-4">
                {migration.status === 'in-progress' && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{migration.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${migration.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <Database className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Schemas</p>
                      <p className="font-medium">{migration.stats.schemas}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <Table className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Tabelas</p>
                      <p className="font-medium">{migration.stats.tables}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <Columns className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Colunas</p>
                      <p className="font-medium">{migration.stats.columns}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <Files className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Registros</p>
                      <p className="font-medium">{migration.stats.records.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <HardDrive className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-gray-500">Tamanho</p>
                      <p className="font-medium">{migration.stats.dataSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              {migration.scheduledFor && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Agendado para: {migration.scheduledFor}</span>
                </div>
              )}
              {migration.startedAt && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Iniciado em: {migration.startedAt}</span>
                </div>
              )}
              {migration.completedAt && (
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluído em: {migration.completedAt}</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {migration.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700">{migration.error}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}