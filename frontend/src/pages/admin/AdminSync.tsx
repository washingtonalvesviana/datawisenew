import React, { useState } from 'react';
import { RefreshCw, Search, Plus } from 'lucide-react';
import { SyncCard } from '../../components/sync/SyncCard';
import { SyncRegistrationForm } from '../../components/sync/SyncRegistrationForm';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import type { SyncTask } from '../../types/sync';

// TODO: Replace with real data from API
const mockSyncTasks: SyncTask[] = [
  {
    id: '1',
    name: 'Customer Data Sync',
    description: 'Synchronize customer data between CRM and Data Warehouse',
    status: 'active',
    type: 'bidirectional',
    frequency: 'realtime',
    lastSync: '2024-03-15 14:30:00',
    nextSync: '2024-03-15 15:30:00',
    source: {
      name: 'CRM System',
      type: 'API',
      endpoint: 'https://api.crm.example.com'
    },
    target: {
      name: 'Data Warehouse',
      type: 'Database',
      endpoint: 'warehouse.example.com'
    },
    metrics: {
      successRate: 99.8,
      latency: '120ms',
      recordsProcessed: 15000,
      dataVolume: '2.5 GB',
      errors: 3,
      warnings: 12
    },
    config: {
      filters: ['active_customers_only', 'exclude_test_accounts'],
      transformations: ['normalize_phone_numbers', 'standardize_addresses'],
      retryAttempts: 3,
      timeout: '30s'
    },
    logs: [
      {
        id: '1',
        timestamp: '2024-03-15 14:30:00',
        level: 'info',
        message: 'Successfully synchronized 15000 records'
      },
      {
        id: '2',
        timestamp: '2024-03-15 14:29:50',
        level: 'warning',
        message: 'High latency detected in data transfer'
      }
    ]
  }
];

export function AdminSync() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showSyncForm, setShowSyncForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [syncToDelete, setSyncToDelete] = useState<string | null>(null);
  const [syncs, setSyncs] = useState<SyncTask[]>(mockSyncTasks);
  const [selectedSync, setSelectedSync] = useState<SyncTask | null>(null);

  const handleCreateSync = (data: any) => {
    const newSync: SyncTask = {
      id: Date.now().toString(),
      ...data,
      status: 'active',
      metrics: {
        successRate: 0,
        latency: '0ms',
        recordsProcessed: 0,
        dataVolume: '0 B',
        errors: 0,
        warnings: 0
      },
      logs: []
    };
    setSyncs(prev => [...prev, newSync]);
    setShowSyncForm(false);
  };

  const handleEditSync = (sync: SyncTask) => {
    setSelectedSync(sync);
    setShowSyncForm(true);
  };

  const handlePauseSync = (id: string) => {
    setSyncs(prev => prev.map(sync => 
      sync.id === id ? { ...sync, status: 'paused' } : sync
    ));
  };

  const handleResumeSync = (id: string) => {
    setSyncs(prev => prev.map(sync => 
      sync.id === id ? { ...sync, status: 'active' } : sync
    ));
  };

  const handleMonitorSync = (id: string) => {
    // TODO: Implement monitoring view
    console.log('Monitoring sync:', id);
  };

  const handleConfigureSync = (id: string) => {
    // TODO: Implement configuration view
    console.log('Configuring sync:', id);
  };

  const handleDeleteSync = (id: string) => {
    setSyncToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (syncToDelete) {
      setSyncs(prev => prev.filter(sync => sync.id !== syncToDelete));
      setSyncToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sincronizações</h1>
          <p className="text-gray-500">Gerenciamento de Sincronização de Dados</p>
        </div>
        <button
          onClick={() => setShowSyncForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Sincronização</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar sincronizações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="paused">Pausados</option>
          <option value="error">Com Erro</option>
        </select>
      </div>

      {/* Sync Tasks List */}
      <div className="space-y-6">
        {syncs.map((sync) => (
          <SyncCard
            key={sync.id}
            sync={sync}
            onEdit={handleEditSync}
            onDelete={handleDeleteSync}
            onPause={handlePauseSync}
            onResume={handleResumeSync}
            onMonitor={handleMonitorSync}
            onConfigure={handleConfigureSync}
          />
        ))}
      </div>

      {/* Sync Form Modal */}
      {showSyncForm && (
        <SyncRegistrationForm
          onClose={() => {
            setShowSyncForm(false);
            setSelectedSync(null);
          }}
          onSubmit={handleCreateSync}
          initialData={selectedSync}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDelete}
        title="Excluir Sincronização"
        message="Tem certeza que deseja excluir esta sincronização? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}