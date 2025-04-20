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
  HardDrive,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { MigrationModal } from './migracoes/modal';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { Migration } from '../../types/services';

// TODO: Replace with real data from API
const mockMigrations: Migration[] = [
  {
    id: '1',
    name: 'Production Database Migration',
    description: 'Migration of legacy production database to new PostgreSQL instance',
    status: 'in-progress',
    priority: 'high',
    sourceDb: {
      id: '1',
      name: 'Legacy Oracle DB',
      type: 'oracle',
      size: '2.5 TB',
      host: 'oracle.legacy.internal'
    },
    targetDb: {
      id: '2',
      name: 'New PostgreSQL DB',
      type: 'postgres',
      size: '2.1 TB',
      host: 'postgres.new.internal'
    },
    startedAt: '2024-03-15 08:00:00',
    progress: 65,
    assignedTo: 'João Silva',
    stats: {
      schemas: 8,
      tables: 245,
      columns: 1890,
      records: 15000000,
      dataSize: '1.8 TB',
      estimatedTime: '24h',
      elapsedTime: '16h'
    },
    logs: [
      {
        id: '1',
        timestamp: '2024-03-15 08:00:00',
        level: 'info',
        message: 'Migration started'
      },
      {
        id: '2',
        timestamp: '2024-03-15 12:00:00',
        level: 'warning',
        message: 'Large table detected, adjusting batch size'
      }
    ]
  }
];

export function AdminMigrations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [migrationToDelete, setMigrationToDelete] = useState<string | null>(null);
  const [selectedMigration, setSelectedMigration] = useState<Migration | null>(null);
  const [migrations, setMigrations] = useState<Migration[]>(mockMigrations);

  const handleCreateMigration = (data: any) => {
    // TODO: Implement migration creation logic
    console.log('Creating migration with data:', data);
    setShowMigrationModal(false);
  };

  const handleEditMigration = (migration: Migration) => {
    setSelectedMigration(migration);
    setShowMigrationModal(true);
  };

  const handleDeleteMigration = (migrationId: string) => {
    setMigrationToDelete(migrationId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (migrationToDelete) {
      setMigrations(prev => prev.filter(m => m.id !== migrationToDelete));
      setMigrationToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

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
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Migrações</h1>
          <p className="text-gray-500">Gerenciamento de Migrações de Banco de Dados</p>
        </div>
        <button
          onClick={() => {
            setSelectedMigration(null);
            setShowMigrationModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Migração</span>
        </button>
      </div>

      {/* Migration Cards */}
      <div className="space-y-6">
        {migrations.map((migration) => (
          <div
            key={migration.id}
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-gray-900">{migration.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    migration.priority === 'high' ? 'bg-red-100 text-red-700' :
                    migration.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {migration.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{migration.description}</p>
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
                  <h4 className="font-medium">Banco de Dados Origem</h4>
                  <span className="text-2xl">🗄️</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{migration.sourceDb.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Host:</span>
                    <span className="font-medium">{migration.sourceDb.host}</span>
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
                  <h4 className="font-medium">Banco de Dados Destino</h4>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{migration.targetDb.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Host:</span>
                    <span className="font-medium">{migration.targetDb.host}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tamanho:</span>
                    <span className="font-medium">{migration.targetDb.size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress and Stats */}
            <div className="space-y-4">
              {migration.status === 'in-progress' && migration.progress !== undefined && (
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

            {/* Logs */}
            {migration.logs.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Logs</h4>
                <div className="space-y-2">
                  {migration.logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2 rounded-lg text-sm ${
                        log.level === 'error' ? 'bg-red-50 text-red-700' :
                        log.level === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{log.message}</span>
                        <span className="text-xs opacity-75">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEditMigration(migration)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDeleteMigration(migration.id)}
                className="btn-secondary flex items-center space-x-2 text-primary hover:text-primary/80"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Migration Modal */}
      {showMigrationModal && (
        <MigrationModal
          onClose={() => {
            setShowMigrationModal(false);
            setSelectedMigration(null);
          }}
          onSubmit={handleCreateMigration}
          initialData={selectedMigration}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Migração"
        message="Tem certeza que deseja excluir esta migração? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}